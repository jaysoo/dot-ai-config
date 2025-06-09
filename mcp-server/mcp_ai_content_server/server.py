"""MCP AI Content Server main implementation."""

import asyncio
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional, Sequence

from mcp.server import Server
from mcp.server.models import InitializationOptions
from mcp.server.stdio import stdio_server
from mcp.types import (
    CallToolRequest,
    CallToolResult,
    ListToolsRequest,
    ListToolsResult,
    Tool,
    TextContent,
)

from .content_indexer import ContentIndexer
from .search_engine import SearchEngine

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class AIContentServer:
    """MCP server for AI-generated content search and retrieval."""

    def __init__(self, base_path: Optional[Path] = None):
        """Initialize the AI content server.
        
        Args:
            base_path: Base path to search for dot_ai directories. 
                      Defaults to current working directory.
        """
        self.base_path = base_path or Path.cwd().parent
        self.content_indexer = ContentIndexer(self.base_path)
        self.search_engine = SearchEngine(self.content_indexer)
        
        # Initialize MCP server
        self.server = Server("ai-content-server")
        self._setup_handlers()
        
        logger.info(f"Initialized AI Content Server with base path: {self.base_path}")

    def _setup_handlers(self):
        """Set up MCP server handlers."""
        
        @self.server.list_tools()
        async def handle_list_tools() -> List[Tool]:
            """List available tools."""
            return [
                Tool(
                    name="search_ai_content",
                    description="Search across AI-generated content with category filtering",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "query": {
                                "type": "string",
                                "description": "Search query text"
                            },
                            "category": {
                                "type": "string",
                                "enum": ["specs", "tasks", "dictations", "all"],
                                "description": "Content category to search in",
                                "default": "all"
                            },
                            "date_filter": {
                                "type": "string",
                                "description": "Date filter in YYYY-MM-DD format (optional)",
                                "pattern": r"^\d{4}-\d{2}-\d{2}$"
                            },
                            "max_results": {
                                "type": "integer",
                                "description": "Maximum number of results to return",
                                "default": 10,
                                "minimum": 1,
                                "maximum": 50
                            }
                        },
                        "required": ["query"]
                    }
                ),
                Tool(
                    name="get_task_context",
                    description="Retrieve context for continuing specific tasks",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "task_name": {
                                "type": "string",
                                "description": "Name or partial name of the task"
                            },
                            "include_related": {
                                "type": "boolean",
                                "description": "Include related files and context",
                                "default": True
                            }
                        },
                        "required": ["task_name"]
                    }
                ),
                Tool(
                    name="find_specs",
                    description="Locate specification files by filename patterns",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "spec_name": {
                                "type": "string",
                                "description": "Name or partial name of the specification"
                            },
                            "date_filter": {
                                "type": "string",
                                "description": "Date filter in YYYY-MM-DD format (optional)",
                                "pattern": r"^\d{4}-\d{2}-\d{2}$"
                            }
                        },
                        "required": ["spec_name"]
                    }
                ),
                Tool(
                    name="get_summaries",
                    description="Access summary files for quick overview",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "date_filter": {
                                "type": "string",
                                "description": "Date filter in YYYY-MM-DD format (optional)",
                                "pattern": r"^\d{4}-\d{2}-\d{2}$"
                            },
                            "max_results": {
                                "type": "integer",
                                "description": "Maximum number of summaries to return",
                                "default": 5,
                                "minimum": 1,
                                "maximum": 20
                            }
                        }
                    }
                ),
                Tool(
                    name="extract_todos",
                    description="Find and extract TODO items from files",
                    inputSchema={
                        "type": "object",
                        "properties": {
                            "category": {
                                "type": "string",
                                "enum": ["specs", "tasks", "dictations", "all"],
                                "description": "Content category to search in",
                                "default": "all"
                            },
                            "date_filter": {
                                "type": "string",
                                "description": "Date filter in YYYY-MM-DD format (optional)",
                                "pattern": r"^\d{4}-\d{2}-\d{2}$"
                            }
                        }
                    }
                )
            ]

        @self.server.call_tool()
        async def handle_call_tool(request: CallToolRequest) -> CallToolResult:
            """Handle tool calls."""
            try:
                if request.name == "search_ai_content":
                    return await self._handle_search_content(request.arguments)
                elif request.name == "get_task_context":
                    return await self._handle_get_task_context(request.arguments)
                elif request.name == "find_specs":
                    return await self._handle_find_specs(request.arguments)
                elif request.name == "get_summaries":
                    return await self._handle_get_summaries(request.arguments)
                elif request.name == "extract_todos":
                    return await self._handle_extract_todos(request.arguments)
                else:
                    raise ValueError(f"Unknown tool: {request.name}")
            except Exception as e:
                logger.error(f"Error handling tool call {request.name}: {e}")
                return CallToolResult(
                    content=[TextContent(type="text", text=f"Error: {str(e)}")],
                    isError=True
                )

    async def _handle_search_content(self, arguments: Dict[str, Any]) -> CallToolResult:
        """Handle search_ai_content tool call."""
        query = arguments["query"]
        category = arguments.get("category", "all")
        date_filter = arguments.get("date_filter")
        max_results = arguments.get("max_results", 10)
        
        results = await self.search_engine.search(
            query=query,
            category=category,
            date_filter=date_filter,
            max_results=max_results
        )
        
        if not results:
            return CallToolResult(
                content=[TextContent(type="text", text=f"No results found for query: {query}")]
            )
        
        response_text = f"Found {len(results)} results for '{query}' in category '{category}':\n\n"
        for i, result in enumerate(results, 1):
            response_text += f"{i}. **{result['filename']}** ({result['category']})\n"
            response_text += f"   Path: {result['path']}\n"
            response_text += f"   Score: {result['score']:.3f}\n"
            if result.get('snippet'):
                response_text += f"   Snippet: {result['snippet']}\n"
            response_text += "\n"
        
        return CallToolResult(
            content=[TextContent(type="text", text=response_text)]
        )

    async def _handle_get_task_context(self, arguments: Dict[str, Any]) -> CallToolResult:
        """Handle get_task_context tool call."""
        task_name = arguments["task_name"]
        include_related = arguments.get("include_related", True)
        
        results = await self.search_engine.get_task_context(task_name, include_related)
        
        if not results:
            return CallToolResult(
                content=[TextContent(type="text", text=f"No task context found for: {task_name}")]
            )
        
        response_text = f"Task context for '{task_name}':\n\n"
        for result in results:
            response_text += f"**{result['filename']}** ({result['category']})\n"
            response_text += f"Path: {result['path']}\n"
            if result.get('content'):
                response_text += f"Content preview: {result['content'][:500]}...\n"
            response_text += "\n"
        
        return CallToolResult(
            content=[TextContent(type="text", text=response_text)]
        )

    async def _handle_find_specs(self, arguments: Dict[str, Any]) -> CallToolResult:
        """Handle find_specs tool call."""
        spec_name = arguments["spec_name"]
        date_filter = arguments.get("date_filter")
        
        results = await self.search_engine.find_specs(spec_name, date_filter)
        
        if not results:
            return CallToolResult(
                content=[TextContent(type="text", text=f"No specifications found for: {spec_name}")]
            )
        
        response_text = f"Specifications matching '{spec_name}':\n\n"
        for result in results:
            response_text += f"**{result['filename']}**\n"
            response_text += f"Path: {result['path']}\n"
            response_text += f"Date: {result['date']}\n"
            if result.get('content'):
                response_text += f"Content preview: {result['content'][:300]}...\n"
            response_text += "\n"
        
        return CallToolResult(
            content=[TextContent(type="text", text=response_text)]
        )

    async def _handle_get_summaries(self, arguments: Dict[str, Any]) -> CallToolResult:
        """Handle get_summaries tool call."""
        date_filter = arguments.get("date_filter")
        max_results = arguments.get("max_results", 5)
        
        results = await self.search_engine.get_summaries(date_filter, max_results)
        
        if not results:
            return CallToolResult(
                content=[TextContent(type="text", text="No summary files found")]
            )
        
        response_text = f"Found {len(results)} summary files:\n\n"
        for result in results:
            response_text += f"**{result['filename']}**\n"
            response_text += f"Path: {result['path']}\n"
            response_text += f"Date: {result['date']}\n"
            if result.get('content'):
                response_text += f"Summary: {result['content'][:400]}...\n"
            response_text += "\n"
        
        return CallToolResult(
            content=[TextContent(type="text", text=response_text)]
        )

    async def _handle_extract_todos(self, arguments: Dict[str, Any]) -> CallToolResult:
        """Handle extract_todos tool call."""
        category = arguments.get("category", "all")
        date_filter = arguments.get("date_filter")
        
        results = await self.search_engine.extract_todos(category, date_filter)
        
        if not results:
            return CallToolResult(
                content=[TextContent(type="text", text=f"No TODO items found in category: {category}")]
            )
        
        response_text = f"TODO items found in category '{category}':\n\n"
        for result in results:
            response_text += f"**{result['filename']}**:\n"
            for todo in result['todos']:
                response_text += f"  - {todo}\n"
            response_text += "\n"
        
        return CallToolResult(
            content=[TextContent(type="text", text=response_text)]
        )

    async def run(self):
        """Run the MCP server."""
        logger.info("Starting AI Content Server...")
        
        # Initialize content indexer
        await self.content_indexer.initialize()
        
        # Run the server
        async with stdio_server() as (read_stream, write_stream):
            await self.server.run(
                read_stream,
                write_stream,
                InitializationOptions(
                    server_name="ai-content-server",
                    server_version="0.1.0",
                    capabilities={}
                )
            )


async def main():
    """Main entry point."""
    server = AIContentServer()
    await server.run()


if __name__ == "__main__":
    asyncio.run(main())
"""MCP AI Content Server main implementation."""

import asyncio
import logging
import os
from pathlib import Path
from typing import Optional

from fastmcp import FastMCP

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
                      Defaults to file-relative parent directory.
        """
        self.base_path = base_path or Path(__file__).parent.parent.parent
        self.content_indexer = ContentIndexer(self.base_path)
        self.search_engine = SearchEngine(self.content_indexer)
        
        # Initialize FastMCP server
        self.server = FastMCP("ai-content-server")
        self._setup_tools()
        
        logger.info(f"Initialized AI Content Server with base path: {self.base_path}")

    def _setup_tools(self):
        """Set up MCP server tools."""
        
        @self.server.tool(
            name="search_ai_content",
            description="Search across AI-generated content with category filtering"
        )
        async def search_ai_content(
            query: str,
            category: str = "all",
            date_filter: Optional[str] = None,
            max_results: int = 10
        ) -> str:
            """Search for AI content."""
            valid_categories = ["spec", "specs", "task", "tasks", "dictation", "dictations", "all"]
            if category not in valid_categories:
                return f"Error: category must be one of: {', '.join(valid_categories)}"
            
            if max_results < 1 or max_results > 50:
                return "Error: max_results must be between 1 and 50"
                
            # Check for index refresh
            await self.check_and_refresh_index()
                
            results = await self.search_engine.search(
                query=query,
                category=category,
                date_filter=date_filter,
                max_results=max_results
            )
            
            if not results:
                return f"No results found for query: {query}"
            
            response_text = f"Found {len(results)} results for '{query}' in category '{category}':\n\n"
            for i, result in enumerate(results, 1):
                response_text += f"{i}. **{result['filename']}** ({result['category']})\n"
                response_text += f"   Path: {result['path']}\n"
                response_text += f"   Score: {result['score']:.3f}\n"
                if result.get('snippet'):
                    response_text += f"   Snippet: {result['snippet']}\n"
                response_text += "\n"
            
            return response_text

        @self.server.tool(
            name="get_task_context", 
            description="Retrieve context for continuing specific tasks"
        )
        async def get_task_context(
            task_name: str,
            include_related: bool = True
        ) -> str:
            """Get task context."""
            # Check for index refresh
            await self.check_and_refresh_index()
            
            results = await self.search_engine.get_task_context(task_name, include_related)
            
            if not results:
                return f"No task context found for: {task_name}"
            
            response_text = f"Task context for '{task_name}':\n\n"
            for result in results:
                response_text += f"**{result['filename']}** ({result['category']})\n"
                response_text += f"Path: {result['path']}\n"
                if result.get('content'):
                    response_text += f"Content preview: {result['content'][:500]}...\n"
                response_text += "\n"
            
            return response_text

        @self.server.tool(
            name="find_specs",
            description="Locate specification files by filename patterns"
        )
        async def find_specs(
            spec_name: str,
            date_filter: Optional[str] = None
        ) -> str:
            """Find specification files."""
            # Check for index refresh
            await self.check_and_refresh_index()
            
            results = await self.search_engine.find_specs(spec_name, date_filter)
            
            if not results:
                return f"No specifications found for: {spec_name}"
            
            response_text = f"Specifications matching '{spec_name}':\n\n"
            for result in results:
                response_text += f"**{result['filename']}**\n"
                response_text += f"Path: {result['path']}\n"
                response_text += f"Date: {result['date']}\n"
                if result.get('content'):
                    response_text += f"Content preview: {result['content'][:300]}...\n"
                response_text += "\n"
            
            return response_text

        @self.server.tool(
            name="get_summaries",
            description="Access summary files for quick overview"
        )
        async def get_summaries(
            date_filter: Optional[str] = None,
            max_results: int = 5
        ) -> str:
            """Get summary files."""
            if max_results < 1 or max_results > 20:
                return "Error: max_results must be between 1 and 20"
                
            # Check for index refresh
            await self.check_and_refresh_index()
                
            results = await self.search_engine.get_summaries(date_filter, max_results)
            
            if not results:
                return "No summary files found"
            
            response_text = f"Found {len(results)} summary files:\n\n"
            for result in results:
                response_text += f"**{result['filename']}**\n"
                response_text += f"Path: {result['path']}\n"
                response_text += f"Date: {result['date']}\n"
                if result.get('content'):
                    response_text += f"Summary: {result['content'][:400]}...\n"
                response_text += "\n"
            
            return response_text

        @self.server.tool(
            name="extract_todos",
            description="Find and extract TODO items from files"
        )
        async def extract_todos(
            category: str = "all",
            date_filter: Optional[str] = None,
            verbosity: str = "minimal",
            status_filter: str = "pending"
        ):
            """Extract TODO items with optimized token usage.
            
            Args:
                category: Category to search ('spec', 'specs', 'task', 'tasks', 'dictation', 'dictations', 'all')
                date_filter: Optional date filter (YYYY-MM-DD or YYYY-MM-DD..YYYY-MM-DD)
                verbosity: Output detail level ('minimal', 'standard', 'detailed')
                status_filter: Filter by status ('pending', 'completed', 'all')
            
            Returns:
                Optimized TODO summary and items
            """
            valid_categories = ["spec", "specs", "task", "tasks", "dictation", "dictations", "all"]
            if category not in valid_categories:
                return {"error": f"category must be one of: {', '.join(valid_categories)}"}
            
            valid_verbosities = ["minimal", "standard", "detailed"]
            if verbosity not in valid_verbosities:
                return {"error": f"verbosity must be one of: {', '.join(valid_verbosities)}"}
            
            valid_status_filters = ["pending", "completed", "all"]
            if status_filter not in valid_status_filters:
                return {"error": f"status_filter must be one of: {', '.join(valid_status_filters)}"}
                
            # Check for index refresh
            await self.check_and_refresh_index()
                
            result = await self.search_engine.extract_todos(
                category=category,
                date_filter=date_filter,
                verbosity=verbosity,
                status_filter=status_filter
            )
            
            return result

    async def initialize(self):
        """Initialize content indexer."""
        await self.content_indexer.initialize()
        
    async def check_and_refresh_index(self):
        """Check if index needs refresh and update if necessary."""
        try:
            refreshed = await self.content_indexer.refresh()
            if refreshed > 0:
                logger.info(f"Auto-reindexed {refreshed} files")
        except Exception as e:
            logger.error(f"Error during auto-reindex: {e}")

    def run(self, transport: str = "streamable-http"):
        """Run the MCP server with specified transport."""
        logger.info(f"Starting AI Content Server with {transport} transport...")
        
        asyncio.run(self.initialize())
            
        port = int(os.environ.get("PORT", 8888))
        self.server.run(transport="sse", host="127.0.0.1", port=port)

def main():
    """Main entry point."""
    transport = os.environ.get("TRANSPORT", "streamable-http")
    server = AIContentServer()
    server.run(transport=transport)


if __name__ == "__main__":
    main()

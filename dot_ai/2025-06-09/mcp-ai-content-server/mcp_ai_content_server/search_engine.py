"""Search engine for AI-generated content with semantic and keyword search."""

import logging
import re
from typing import Dict, List, Optional, Any
from dataclasses import asdict

from .content_indexer import ContentIndexer, ContentItem
from .semantic_search import SemanticSearchEngine

logger = logging.getLogger(__name__)


class SearchEngine:
    """Search engine for AI-generated content."""
    
    def __init__(self, content_indexer: ContentIndexer):
        """Initialize the search engine.
        
        Args:
            content_indexer: Content indexer instance
        """
        self.indexer = content_indexer
        self.semantic_engine = SemanticSearchEngine()
        
    async def search(
        self, 
        query: str, 
        category: str = "all", 
        date_filter: Optional[str] = None,
        max_results: int = 10
    ) -> List[Dict[str, Any]]:
        """Search for content with keyword matching and category filtering.
        
        Args:
            query: Search query
            category: Category filter ('specs', 'tasks', 'dictations', 'all')
            date_filter: Optional date filter (YYYY-MM-DD)
            max_results: Maximum number of results
            
        Returns:
            List of search results with metadata
        """
        logger.debug(f"Searching for '{query}' in category '{category}'")
        
        # Get base results from filename search
        filename_results = self.indexer.search_by_filename(query, category)
        
        # Get content search results
        content_results = self.indexer.search_content(query, category)
        
        # Get semantic search results if available
        semantic_results = []
        if self.semantic_engine.is_available():
            available_items = self.indexer.get_files_by_category(category)
            if date_filter:
                available_items = [item for item in available_items if item.date == date_filter]
            semantic_results = await self.semantic_engine.semantic_search(
                query, available_items, max_results=max_results * 2
            )
        
        # Combine and deduplicate results
        all_results = {}
        
        # Add filename results with higher base score
        for item in filename_results:
            key = str(item.path.relative_to(self.indexer.base_path))
            score = self._calculate_filename_score(query, item.filename)
            all_results[key] = {
                'item': item,
                'score': score + 1.0,  # Filename bonus
                'match_type': 'filename'
            }
            
        # Add content results
        for item, content_score in content_results:
            key = str(item.path.relative_to(self.indexer.base_path))
            if key in all_results:
                # Combine scores if already found via filename
                all_results[key]['score'] += content_score
                all_results[key]['match_type'] = 'both'
            else:
                all_results[key] = {
                    'item': item,
                    'score': content_score,
                    'match_type': 'content'
                }
                
        # Add semantic results
        for item, semantic_score in semantic_results:
            key = str(item.path.relative_to(self.indexer.base_path))
            semantic_boost = semantic_score * 2.0  # Boost semantic matches
            
            if key in all_results:
                # Combine scores if already found
                all_results[key]['score'] += semantic_boost
                all_results[key]['match_type'] = 'hybrid'
            else:
                all_results[key] = {
                    'item': item,
                    'score': semantic_boost,
                    'match_type': 'semantic'
                }
                
        # Apply date filter
        if date_filter:
            all_results = {
                k: v for k, v in all_results.items() 
                if v['item'].date == date_filter
            }
            
        # Sort by score and limit results
        sorted_results = sorted(
            all_results.values(), 
            key=lambda x: x['score'], 
            reverse=True
        )[:max_results]
        
        # Format results
        formatted_results = []
        for result in sorted_results:
            item = result['item']
            formatted_result = {
                'filename': item.filename,
                'path': str(item.path),
                'category': item.category,
                'date': item.date,
                'score': result['score'],
                'match_type': result['match_type'],
                'snippet': self._extract_snippet(query, item.content) if item.content else None
            }
            formatted_results.append(formatted_result)
            
        return formatted_results
        
    def _calculate_filename_score(self, query: str, filename: str) -> float:
        """Calculate relevance score for filename match.
        
        Args:
            query: Search query
            filename: Filename to score
            
        Returns:
            Relevance score
        """
        query_lower = query.lower()
        filename_lower = filename.lower()
        
        # Exact match
        if query_lower == filename_lower:
            return 5.0
            
        # Starts with query
        if filename_lower.startswith(query_lower):
            return 3.0
            
        # Contains query
        if query_lower in filename_lower:
            return 2.0
            
        # Word boundary matches
        query_words = query_lower.split()
        filename_words = filename_lower.replace('-', ' ').replace('_', ' ').split()
        
        matches = sum(1 for word in query_words if word in filename_words)
        return matches * 0.5
        
    def _extract_snippet(self, query: str, content: str, snippet_length: int = 200) -> str:
        """Extract a relevant snippet from content around the query.
        
        Args:
            query: Search query
            content: File content
            snippet_length: Maximum snippet length
            
        Returns:
            Relevant snippet
        """
        if not content:
            return ""
            
        query_lower = query.lower()
        content_lower = content.lower()
        
        # Find first occurrence of query
        index = content_lower.find(query_lower)
        if index == -1:
            # If exact query not found, try first word
            first_word = query_lower.split()[0] if query_lower.split() else ""
            index = content_lower.find(first_word) if first_word else 0
            
        # Extract snippet around the match
        start = max(0, index - snippet_length // 2)
        end = min(len(content), start + snippet_length)
        
        snippet = content[start:end].strip()
        
        # Clean up snippet
        if start > 0:
            snippet = "..." + snippet
        if end < len(content):
            snippet = snippet + "..."
            
        return snippet
        
    async def get_task_context(
        self, 
        task_name: str, 
        include_related: bool = True
    ) -> List[Dict[str, Any]]:
        """Get context for continuing a specific task.
        
        Args:
            task_name: Name or partial name of the task
            include_related: Include related files and context
            
        Returns:
            List of task context items
        """
        logger.debug(f"Getting task context for '{task_name}'")
        
        # Search for tasks with the given name
        task_results = await self.search(task_name, category="tasks", max_results=50)
        
        # If include_related, also search specs and other content
        related_results = []
        if include_related:
            # Search for related specs
            spec_results = await self.search(task_name, category="specs", max_results=20)
            related_results.extend(spec_results)
            
            # Search for related dictations
            dictation_results = await self.search(task_name, category="dictations", max_results=10)
            related_results.extend(dictation_results)
            
        # Combine results
        all_results = task_results + related_results
        
        # Deduplicate by path
        seen_paths = set()
        unique_results = []
        for result in all_results:
            if result['path'] not in seen_paths:
                seen_paths.add(result['path'])
                
                # Add full content for context
                item = self._get_item_by_path(result['path'])
                if item and item.content:
                    result['content'] = item.content
                    
                unique_results.append(result)
                
        return unique_results
        
    async def find_specs(
        self, 
        spec_name: str, 
        date_filter: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Find specification files by name.
        
        Args:
            spec_name: Name or partial name of the specification
            date_filter: Optional date filter
            
        Returns:
            List of specification files
        """
        logger.debug(f"Finding specs for '{spec_name}'")
        
        results = await self.search(
            query=spec_name,
            category="specs",
            date_filter=date_filter,
            max_results=20
        )
        
        # Add full content for specs
        for result in results:
            item = self._get_item_by_path(result['path'])
            if item and item.content:
                result['content'] = item.content
                
        return results
        
    async def get_summaries(
        self, 
        date_filter: Optional[str] = None,
        max_results: int = 5
    ) -> List[Dict[str, Any]]:
        """Get summary files for quick overview.
        
        Args:
            date_filter: Optional date filter
            max_results: Maximum number of summaries
            
        Returns:
            List of summary files
        """
        logger.debug("Getting summary files")
        
        summary_items = self.indexer.get_summary_files()
        
        # Apply date filter
        if date_filter:
            summary_items = [item for item in summary_items if item.date == date_filter]
            
        # Limit results
        summary_items = summary_items[:max_results]
        
        # Format results
        results = []
        for item in summary_items:
            result = {
                'filename': item.filename,
                'path': str(item.path),
                'category': item.category,
                'date': item.date,
                'content': item.content
            }
            results.append(result)
            
        return results
        
    async def extract_todos(
        self, 
        category: str = "all",
        date_filter: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Extract TODO items from files.
        
        Args:
            category: Category to search in
            date_filter: Optional date filter
            
        Returns:
            List of files with their TODO items
        """
        logger.debug(f"Extracting TODOs from category '{category}'")
        
        # Get files in category
        files = self.indexer.get_files_by_category(category)
        
        # Apply date filter
        if date_filter:
            files = [f for f in files if f.date == date_filter]
            
        # Extract TODOs from each file
        results = []
        for item in files:
            if not item.content:
                continue
                
            todos = self.indexer.extract_todos_from_content(item.content)
            if todos:
                result = {
                    'filename': item.filename,
                    'path': str(item.path),
                    'category': item.category,
                    'date': item.date,
                    'todos': todos
                }
                results.append(result)
                
        # Sort by date (newest first)
        results.sort(key=lambda x: x['date'], reverse=True)
        
        return results
        
    def _get_item_by_path(self, path_str: str) -> Optional[ContentItem]:
        """Get a content item by its path string.
        
        Args:
            path_str: Path string
            
        Returns:
            Content item if found
        """
        # Convert absolute path to relative key
        try:
            from pathlib import Path
            path = Path(path_str)
            relative_path = str(path.relative_to(self.indexer.base_path))
            return self.indexer.index.get(relative_path)
        except (ValueError, KeyError):
            return None
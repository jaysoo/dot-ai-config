"""Search engine for AI-generated content with semantic and keyword search."""

import json
import logging
import re
from datetime import datetime
from typing import Dict, List, Optional, Any, Union
from dataclasses import asdict

from .content_indexer import ContentIndexer, ContentItem
from .semantic_search import SemanticSearchEngine

logger = logging.getLogger(__name__)


class SearchEngine:
    """Search engine for AI-generated content."""
    
    # Category aliases for normalization
    CATEGORY_ALIASES = {
        'dictation': 'dictations',
        'dictations': 'dictations',
        'task': 'tasks', 
        'tasks': 'tasks',
        'spec': 'specs',
        'specs': 'specs',
        'all': 'all',
        'other': 'other'
    }
    
    def __init__(self, content_indexer: ContentIndexer):
        """Initialize the search engine.
        
        Args:
            content_indexer: Content indexer instance
        """
        self.indexer = content_indexer
        self.semantic_engine = SemanticSearchEngine()
        
    def _normalize_category(self, category: str) -> str:
        """Normalize category to handle singular/plural forms.
        
        Args:
            category: User-provided category string
            
        Returns:
            Normalized category name
        """
        return self.CATEGORY_ALIASES.get(category.lower(), 'all')
        
    def _parse_date_filter(self, date_input: str) -> Dict[str, Any]:
        """Parse date input supporting both exact dates and ranges.
        
        Args:
            date_input: Date string in format YYYY-MM-DD or YYYY-MM-DD..YYYY-MM-DD
            
        Returns:
            Dict with 'type' ('exact' or 'range') and date info
            
        Raises:
            ValueError: If date format is invalid
        """
        if '..' in date_input:
            # Date range format
            parts = date_input.split('..', 1)
            if len(parts) != 2:
                raise ValueError("Invalid date range format. Use YYYY-MM-DD..YYYY-MM-DD")
                
            start_str, end_str = parts
            try:
                start_date = datetime.strptime(start_str.strip(), '%Y-%m-%d').date()
                end_date = datetime.strptime(end_str.strip(), '%Y-%m-%d').date()
            except ValueError as e:
                raise ValueError(f"Invalid date format in range: {e}")
                
            if start_date > end_date:
                raise ValueError("Start date must be before or equal to end date")
                
            return {'type': 'range', 'start': start_date, 'end': end_date}
        else:
            # Exact date format
            try:
                exact_date = datetime.strptime(date_input.strip(), '%Y-%m-%d').date()
                return {'type': 'exact', 'date': exact_date}
            except ValueError as e:
                raise ValueError(f"Invalid date format. Use YYYY-MM-DD: {e}")
                
    def _is_date_in_filter(self, item_date: str, date_filter: Dict[str, Any]) -> bool:
        """Check if an item's date matches the date filter.
        
        Args:
            item_date: Date string from the item (YYYY-MM-DD)
            date_filter: Parsed date filter dict
            
        Returns:
            True if date matches filter
        """
        try:
            date = datetime.strptime(item_date, '%Y-%m-%d').date()
        except ValueError:
            return False
            
        if date_filter['type'] == 'exact':
            return date == date_filter['date']
        else:  # range
            return date_filter['start'] <= date <= date_filter['end']
        
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
            date_filter: Optional date filter (YYYY-MM-DD or YYYY-MM-DD..YYYY-MM-DD)
            max_results: Maximum number of results
            
        Returns:
            List of search results with metadata
        """
        # Normalize category
        normalized_category = self._normalize_category(category)
        logger.debug(f"Searching for '{query}' in category '{normalized_category}' (original: '{category}')")
        
        # Get base results from filename search
        filename_results = self.indexer.search_by_filename(query, normalized_category)
        
        # Get content search results
        content_results = self.indexer.search_content(query, normalized_category)
        
        # Parse date filter if provided
        parsed_date_filter = None
        if date_filter:
            try:
                parsed_date_filter = self._parse_date_filter(date_filter)
            except ValueError as e:
                logger.error(f"Invalid date filter: {e}")
                return []
        
        # Get semantic search results if available
        semantic_results = []
        if self.semantic_engine.is_available():
            available_items = self.indexer.get_files_by_category(normalized_category)
            if parsed_date_filter:
                available_items = [
                    item for item in available_items 
                    if self._is_date_in_filter(item.date, parsed_date_filter)
                ]
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
        if parsed_date_filter:
            all_results = {
                k: v for k, v in all_results.items()
                if self._is_date_in_filter(v['item'].date, parsed_date_filter)
            }

        # Apply recency boost to scores
        for result in all_results.values():
            recency_boost = self._calculate_recency_boost(result['item'].date)
            result['score'] += recency_boost

        # Sort by score (with recency boost applied) and limit results
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

    def _calculate_recency_boost(self, item_date: str) -> float:
        """Calculate a recency boost based on how recent the file is.

        Args:
            item_date: Date string in YYYY-MM-DD format

        Returns:
            Recency boost score (0.0 to 3.0)
        """
        try:
            file_date = datetime.strptime(item_date, '%Y-%m-%d').date()
            today = datetime.now().date()
            days_old = (today - file_date).days

            # Boost recent files more heavily
            if days_old <= 1:
                return 3.0  # Today or yesterday
            elif days_old <= 7:
                return 2.0  # Within a week
            elif days_old <= 30:
                return 1.0  # Within a month
            elif days_old <= 90:
                return 0.5  # Within 3 months
            else:
                return 0.0  # Older than 3 months
        except ValueError:
            return 0.0

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
            try:
                parsed_filter = self._parse_date_filter(date_filter)
                summary_items = [
                    item for item in summary_items 
                    if self._is_date_in_filter(item.date, parsed_filter)
                ]
            except ValueError as e:
                logger.error(f"Invalid date filter: {e}")
                return []
            
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
        date_filter: Optional[str] = None,
        verbosity: str = "minimal",
        status_filter: str = "pending",
        max_tokens: int = 20000
    ) -> Dict[str, Any]:
        """Extract TODO items from files with optimized token usage.
        
        Args:
            category: Category to search in
            date_filter: Optional date filter
            verbosity: Output verbosity ('minimal', 'standard', 'detailed')
            status_filter: Filter by status ('pending', 'completed', 'all')
            max_tokens: Maximum token limit (default: 20000 to stay well under 25000)
            
        Returns:
            Optimized dictionary with TODO summary and items
        """
        # Normalize category
        normalized_category = self._normalize_category(category)
        logger.debug(f"Extracting TODOs from category '{normalized_category}' with verbosity '{verbosity}'")
        
        # Get files in category
        files = self.indexer.get_files_by_category(normalized_category)
        
        # Apply date filter
        if date_filter:
            try:
                parsed_filter = self._parse_date_filter(date_filter)
                files = [
                    f for f in files 
                    if self._is_date_in_filter(f.date, parsed_filter)
                ]
            except ValueError as e:
                logger.error(f"Invalid date filter: {e}")
                return {"error": str(e)}
        
        # Initialize result structure
        result = {
            "summary": {
                "total": 0,
                "pending": 0,
                "completed": 0,
                "files": 0
            },
            "todos": {},
            "meta": {
                "verbosity": verbosity,
                "status_filter": status_filter,
                "category": normalized_category,
                "date_filter": date_filter,
                "truncated": False
            }
        }
        
        # Process files and extract TODOs
        todos_by_file = {}
        
        for item in files:
            if not item.content:
                continue
            
            # Extract TODO items with status
            file_todos = self._extract_todos_with_status(item.content, status_filter)
            
            if file_todos['items']:
                # Use abbreviated path
                path = self._abbreviate_path(str(item.path), self.indexer.base_path)
                
                todos_by_file[path] = {
                    'date': item.date,
                    'category': item.category,
                    'todos': file_todos
                }
                
                result['summary']['files'] += 1
                result['summary']['total'] += file_todos['stats']['total']
                result['summary']['pending'] += file_todos['stats']['pending']
                result['summary']['completed'] += file_todos['stats']['completed']
        
        # Apply verbosity formatting and token limits
        result['todos'] = self._format_todos_by_verbosity(
            todos_by_file, 
            verbosity, 
            max_tokens,
            result['summary']
        )
        
        # Check token usage
        import json
        result_json = json.dumps(result, separators=(',', ':'))
        estimated_tokens = len(result_json) // 4
        result['meta']['estimated_tokens'] = estimated_tokens
        
        if estimated_tokens > max_tokens:
            result = self._truncate_todos_to_limit(result, max_tokens)
            result['meta']['truncated'] = True
        
        return result
        
    def _extract_todos_with_status(self, content: str, status_filter: str) -> Dict[str, Any]:
        """Extract TODO items with status information.
        
        Args:
            content: File content
            status_filter: Status filter ('pending', 'completed', 'all')
            
        Returns:
            Dict with items and statistics
        """
        result = {
            "items": [],
            "stats": {
                "total": 0,
                "pending": 0,
                "completed": 0
            }
        }
        
        lines = content.split('\n')
        
        for i, line in enumerate(lines):
            line_stripped = line.strip()
            
            # Match checkbox TODOs
            match = re.match(r'^- \[([ x])\]\s*(.+)$', line_stripped)
            if match:
                status = 'completed' if match.group(1).lower() == 'x' else 'pending'
                todo_text = match.group(2).strip()
                
                if status_filter == 'all' or status_filter == status:
                    result['items'].append({
                        "line": i + 1,
                        "text": self._truncate_text(todo_text, 100),
                        "status": status
                    })
                
                result['stats']['total'] += 1
                if status == 'pending':
                    result['stats']['pending'] += 1
                else:
                    result['stats']['completed'] += 1
                    
            # Match TODO: format
            else:
                match = re.match(r'^TODO[:\s]+(.+)$', line_stripped, re.IGNORECASE)
                if match and status_filter in ['all', 'pending']:
                    result['items'].append({
                        "line": i + 1,
                        "text": self._truncate_text(match.group(1).strip(), 100),
                        "status": "pending"
                    })
                    result['stats']['total'] += 1
                    result['stats']['pending'] += 1
                    
        return result
    
    def _abbreviate_path(self, full_path: str, base_path) -> str:
        """Create abbreviated path representation.
        
        Args:
            full_path: Full file path
            base_path: Base path to remove
            
        Returns:
            Abbreviated path
        """
        try:
            from pathlib import Path
            path = Path(full_path)
            # Get relative path from base
            rel_path = path.relative_to(base_path)
            parts = str(rel_path).split('/')
            
            # Find date folder (YYYY-MM-DD pattern)
            for i, part in enumerate(parts):
                if len(part) == 10 and part.count('-') == 2:
                    # Return from date folder onwards
                    return '/'.join(parts[i:])
            
            # If no date folder, return last 2 parts
            return '/'.join(parts[-2:]) if len(parts) > 1 else str(rel_path)
        except:
            return full_path
    
    def _truncate_text(self, text: str, max_length: int) -> str:
        """Truncate text to maximum length.
        
        Args:
            text: Text to truncate
            max_length: Maximum length
            
        Returns:
            Truncated text
        """
        if len(text) <= max_length:
            return text
        return text[:max_length - 3] + "..."
    
    def _format_todos_by_verbosity(
        self,
        todos_by_file: Dict[str, Dict],
        verbosity: str,
        max_tokens: int,
        summary: Dict[str, int]
    ) -> Dict[str, Any]:
        """Format TODOs based on verbosity level.
        
        Args:
            todos_by_file: TODOs grouped by file
            verbosity: Verbosity level
            max_tokens: Token limit
            summary: Summary statistics
            
        Returns:
            Formatted TODOs
        """
        result = {}
        
        # Sort by date (newest first)
        sorted_files = sorted(
            todos_by_file.items(), 
            key=lambda x: x[1]['date'], 
            reverse=True
        )
        
        for path, file_data in sorted_files:
            todos = file_data['todos']
            
            if verbosity == "minimal":
                # Ultra-compact format
                file_result = {}
                
                # Only show pending items (up to 5)
                pending = [item['text'] for item in todos['items'] if item['status'] == 'pending'][:5]
                if pending:
                    file_result["p"] = pending
                
                # Show completed count if any
                if todos['stats']['completed'] > 0:
                    file_result["c"] = todos['stats']['completed']
                    
                if file_result:
                    result[path] = file_result
                    
            elif verbosity == "standard":
                # Balanced format with line numbers
                file_result = {}
                
                # Pending items with line numbers (up to 10)
                pending = [
                    {"l": item['line'], "t": item['text']}
                    for item in todos['items'] 
                    if item['status'] == 'pending'
                ][:10]
                
                if pending:
                    file_result["pending"] = pending
                    
                # Completed count
                if todos['stats']['completed'] > 0:
                    file_result["completed_count"] = todos['stats']['completed']
                    
                if file_result:
                    result[path] = file_result
                    
            else:  # detailed
                # Full information
                result[path] = {
                    "pending": [
                        item for item in todos['items'] 
                        if item['status'] == 'pending'
                    ][:20],  # Limit even in detailed mode
                    "completed": [
                        item for item in todos['items'] 
                        if item['status'] == 'completed'
                    ][:5],  # Show some completed items
                    "stats": todos['stats']
                }
                
        return result
    
    def _truncate_todos_to_limit(self, result: Dict[str, Any], max_tokens: int) -> Dict[str, Any]:
        """Truncate result to fit within token limit.
        
        Args:
            result: Current result
            max_tokens: Maximum tokens
            
        Returns:
            Truncated result
        """
        import json
        
        # Start with just summary
        truncated = {
            "summary": result['summary'],
            "todos": {},
            "meta": result['meta']
        }
        
        # Add files until we approach the limit
        for path, todos in result['todos'].items():
            test_result = truncated.copy()
            test_result['todos'][path] = todos
            test_json = json.dumps(test_result, separators=(',', ':'))
            
            if len(test_json) // 4 > max_tokens * 0.9:  # Leave 10% buffer
                break
                
            truncated['todos'][path] = todos
            
        truncated['meta']['files_shown'] = len(truncated['todos'])
        truncated['meta']['files_total'] = result['summary']['files']
        
        return truncated
    
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
"""Optimized extract_todos implementation with token-efficient output."""

import json
from typing import Dict, List, Any, Optional
from pathlib import Path


class OptimizedTodoExtractor:
    """Optimized TODO extraction with token-efficient output."""
    
    def extract_todos_optimized(
        self,
        files: List[Any],
        verbosity: str = "minimal",
        status_filter: str = "all",
        max_tokens: int = 25000
    ) -> Dict[str, Any]:
        """Extract TODOs with optimized token usage.
        
        Args:
            files: List of ContentItem objects with TODOs
            verbosity: Output verbosity ('minimal', 'standard', 'detailed')
            status_filter: Filter by status ('pending', 'completed', 'all')
            max_tokens: Maximum token limit
            
        Returns:
            Optimized TODO output
        """
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
                "truncated": False
            }
        }
        
        # Group TODOs by file path
        todos_by_file = {}
        
        for file_data in files:
            if not file_data.get('todos'):
                continue
                
            # Use abbreviated path (remove common prefix)
            path = file_data['path']
            abbreviated_path = self._abbreviate_path(path)
            
            # Extract TODO items based on content
            todos = self._extract_todo_items(
                file_data.get('content', ''),
                file_data['todos'],
                status_filter
            )
            
            if todos['items']:
                todos_by_file[abbreviated_path] = todos
                result['summary']['files'] += 1
                result['summary']['total'] += todos['stats']['total']
                result['summary']['pending'] += todos['stats']['pending']
                result['summary']['completed'] += todos['stats']['completed']
        
        # Apply verbosity and token limits
        result['todos'] = self._apply_verbosity_and_limits(
            todos_by_file, 
            verbosity, 
            max_tokens
        )
        
        # Calculate token usage
        result_json = json.dumps(result, separators=(',', ':'))
        result['meta']['tokens'] = len(result_json) // 4  # Rough estimate
        
        if result['meta']['tokens'] > max_tokens:
            result = self._truncate_to_limit(result, max_tokens)
            result['meta']['truncated'] = True
            
        return result
    
    def _abbreviate_path(self, path: str) -> str:
        """Create abbreviated path representation.
        
        Args:
            path: Full file path
            
        Returns:
            Abbreviated path
        """
        # Extract date and relative path
        parts = path.split('/')
        
        # Find the date folder (YYYY-MM-DD pattern)
        date_idx = -1
        for i, part in enumerate(parts):
            if len(part) == 10 and part.count('-') == 2:
                try:
                    # Validate date format
                    year, month, day = part.split('-')
                    if len(year) == 4 and len(month) == 2 and len(day) == 2:
                        date_idx = i
                        break
                except:
                    pass
        
        if date_idx >= 0:
            # Return from date folder onwards
            return '/'.join(parts[date_idx:])
        else:
            # Return last 3 parts
            return '/'.join(parts[-3:])
    
    def _extract_todo_items(
        self, 
        content: str, 
        extracted_todos: List[str],
        status_filter: str
    ) -> Dict[str, Any]:
        """Extract TODO items with status information.
        
        Args:
            content: File content
            extracted_todos: Pre-extracted TODO texts
            status_filter: Status filter
            
        Returns:
            Dict with items and statistics
        """
        import re
        
        result = {
            "items": [],
            "stats": {
                "total": 0,
                "pending": 0,
                "completed": 0
            }
        }
        
        if not content:
            # Use extracted todos if no content available
            for todo_text in extracted_todos:
                if status_filter in ['all', 'pending']:
                    result['items'].append({
                        "text": self._truncate_text(todo_text, 100),
                        "status": "pending"
                    })
                    result['stats']['total'] += 1
                    result['stats']['pending'] += 1
            return result
        
        # Parse content for TODO items with status
        lines = content.split('\n')
        
        for i, line in enumerate(lines):
            line_stripped = line.strip()
            
            # Match checkbox TODOs
            if match := re.match(r'^- \[([ x])\]\s*(.+)$', line_stripped):
                status = 'completed' if match.group(1) == 'x' else 'pending'
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
            elif match := re.match(r'^TODO[:\s]+(.+)$', line_stripped, re.IGNORECASE):
                if status_filter in ['all', 'pending']:
                    result['items'].append({
                        "line": i + 1,
                        "text": self._truncate_text(match.group(1).strip(), 100),
                        "status": "pending"
                    })
                    result['stats']['total'] += 1
                    result['stats']['pending'] += 1
                    
        return result
    
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
    
    def _apply_verbosity_and_limits(
        self,
        todos_by_file: Dict[str, Dict],
        verbosity: str,
        max_tokens: int
    ) -> Dict[str, Any]:
        """Apply verbosity settings and token limits.
        
        Args:
            todos_by_file: TODOs grouped by file
            verbosity: Verbosity level
            max_tokens: Token limit
            
        Returns:
            Formatted TODOs
        """
        result = {}
        
        for path, todos in todos_by_file.items():
            if verbosity == "minimal":
                # Only counts for completed, full items for pending
                if todos['stats']['pending'] > 0:
                    result[path] = {
                        "p": [  # 'p' for pending
                            item['text'] for item in todos['items'] 
                            if item['status'] == 'pending'
                        ][:10]  # Limit to 10 items
                    }
                if todos['stats']['completed'] > 0:
                    result[path] = result.get(path, {})
                    result[path]["c"] = todos['stats']['completed']  # 'c' for completed count
                    
            elif verbosity == "standard":
                # Include line numbers for pending, count for completed
                file_result = {}
                
                pending_items = [
                    {"l": item.get('line', 0), "t": item['text']}
                    for item in todos['items'] 
                    if item['status'] == 'pending'
                ][:20]  # Limit to 20 items
                
                if pending_items:
                    file_result["pending"] = pending_items
                    
                if todos['stats']['completed'] > 0:
                    file_result["completed"] = todos['stats']['completed']
                    
                if file_result:
                    result[path] = file_result
                    
            else:  # detailed
                # Include all information
                result[path] = {
                    "pending": [
                        item for item in todos['items'] 
                        if item['status'] == 'pending'
                    ],
                    "completed": [
                        item for item in todos['items'] 
                        if item['status'] == 'completed'
                    ][:5],  # Limit completed items even in detailed mode
                    "stats": todos['stats']
                }
                
        return result
    
    def _truncate_to_limit(self, result: Dict[str, Any], max_tokens: int) -> Dict[str, Any]:
        """Truncate result to fit within token limit.
        
        Args:
            result: Current result
            max_tokens: Maximum tokens
            
        Returns:
            Truncated result
        """
        # Start with summary only
        truncated = {
            "summary": result['summary'],
            "todos": {},
            "meta": result['meta']
        }
        
        # Add files until we hit the limit
        current_size = len(json.dumps(truncated, separators=(',', ':')))
        
        for path, todos in result['todos'].items():
            test_result = truncated.copy()
            test_result['todos'][path] = todos
            test_size = len(json.dumps(test_result, separators=(',', ':')))
            
            if test_size // 4 > max_tokens:
                break
                
            truncated['todos'][path] = todos
            current_size = test_size
            
        truncated['meta']['files_included'] = len(truncated['todos'])
        truncated['meta']['files_total'] = len(result['todos'])
        
        return truncated


# Example usage for testing
if __name__ == "__main__":
    # Sample data structure
    sample_files = [
        {
            "path": "/Users/jack/projects/dot-ai-config/dot_ai/2025-06-09/tasks/task1.md",
            "todos": ["Implement feature X", "Write tests"],
            "content": """# Task 1
            
## TODOs
- [ ] Implement feature X
- [ ] Write tests
- [x] Design completed
"""
        }
    ]
    
    extractor = OptimizedTodoExtractor()
    result = extractor.extract_todos_optimized(sample_files, verbosity="minimal")
    print(json.dumps(result, indent=2))
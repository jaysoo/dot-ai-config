"""Content indexer for AI-generated files with filename-based categorization."""

import logging
import re
from pathlib import Path
from typing import Dict, List, Optional, Set, Tuple
from dataclasses import dataclass
from datetime import datetime

from .directory_monitor import DirectoryMonitor

logger = logging.getLogger(__name__)


@dataclass
class ContentItem:
    """Represents an indexed content item."""
    path: Path
    filename: str
    category: str
    date: str
    content: Optional[str] = None
    metadata: Optional[Dict] = None


class ContentIndexer:
    """Indexes AI-generated content with filename-based categorization."""
    
    def __init__(self, base_path: Path):
        """Initialize the content indexer.
        
        Args:
            base_path: Base path to search for dot_ai directories.
        """
        self.base_path = base_path
        self.index: Dict[str, ContentItem] = {}
        self.categories = {
            "specs": self._is_spec_file,
            "tasks": self._is_task_file,
            "dictations": self._is_dictation_file,
        }
        self.directory_monitor = DirectoryMonitor()
        self.last_hash: Optional[str] = None
        self.dot_ai_path = self.base_path / "dot_ai"
        
    async def initialize(self):
        """Initialize the indexer by scanning and categorizing files."""
        logger.info("Initializing content indexer...")
        await self._scan_directories()
        # Store initial hash after scanning
        if self.dot_ai_path.exists():
            self.last_hash = self.directory_monitor.calculate_directory_hash(self.dot_ai_path)
        logger.info(f"Indexed {len(self.index)} files")
        
    async def _scan_directories(self):
        """Scan dot_ai directories for content."""
        dot_ai_path = self.base_path / "dot_ai"
        
        if not dot_ai_path.exists():
            logger.warning(f"dot_ai directory not found at {dot_ai_path}")
            return
            
        # Pattern for date directories (YYYY-MM-DD)
        date_pattern = re.compile(r"^\d{4}-\d{2}-\d{2}$")
        
        for date_dir in dot_ai_path.iterdir():
            if date_dir.is_dir() and date_pattern.match(date_dir.name):
                await self._scan_date_directory(date_dir)
                
    async def _scan_date_directory(self, date_dir: Path):
        """Scan a specific date directory for content.
        
        Args:
            date_dir: Path to the date directory (e.g., 2025-06-09)
        """
        logger.debug(f"Scanning directory: {date_dir}")
        
        for file_path in date_dir.rglob("*"):
            if file_path.is_file() and self._should_index_file(file_path):
                await self._index_file(file_path, date_dir.name)
                
    def _should_index_file(self, file_path: Path) -> bool:
        """Determine if a file should be indexed.
        
        Args:
            file_path: Path to the file
            
        Returns:
            True if the file should be indexed
        """
        # Skip binary files and common non-content files
        skip_extensions = {'.pyc', '.pyo', '.pyd', '.so', '.dll', '.exe', 
                          '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.ico',
                          '.zip', '.tar', '.gz', '.rar', '.7z', '.json'}
        
        if file_path.suffix.lower() in skip_extensions:
            return False
            
        # Skip hidden files and directories
        if any(part.startswith('.') for part in file_path.parts):
            return False
            
        # Skip very large files (>10MB)
        try:
            if file_path.stat().st_size > 10 * 1024 * 1024:
                return False
        except OSError:
            return False
            
        return True
        
    async def _index_file(self, file_path: Path, date: str):
        """Index a single file.
        
        Args:
            file_path: Path to the file
            date: Date string from the directory name
        """
        try:
            # Determine category based on filename
            category = self._categorize_file(file_path)
            
            # Read content for text files
            content = None
            if self._is_text_file(file_path):
                try:
                    content = file_path.read_text(encoding='utf-8', errors='ignore')
                except (UnicodeDecodeError, OSError) as e:
                    logger.warning(f"Could not read content from {file_path}: {e}")
            
            # Create content item
            item = ContentItem(
                path=file_path,
                filename=file_path.name,
                category=category,
                date=date,
                content=content,
                metadata={
                    'size': file_path.stat().st_size,
                    'modified': datetime.fromtimestamp(file_path.stat().st_mtime).isoformat(),
                    'relative_path': str(file_path.relative_to(self.base_path))
                }
            )
            
            # Use relative path as key for uniqueness
            key = str(file_path.relative_to(self.base_path))
            self.index[key] = item
            
            logger.debug(f"Indexed {file_path.name} as {category}")
            
        except Exception as e:
            logger.error(f"Error indexing file {file_path}: {e}")
            
    def _categorize_file(self, file_path: Path) -> str:
        """Categorize a file based on its folder structure.
        
        Args:
            file_path: Path to the file
            
        Returns:
            Category string: 'specs', 'tasks', 'dictations', or 'other'
        """
        path_parts = [part.lower() for part in file_path.parts]
        
        # Check for category folders in path
        if 'dictations' in path_parts:
            return 'dictations'
        elif 'tasks' in path_parts:
            return 'tasks'  
        elif 'specs' in path_parts:
            return 'specs'
        else:
            # Fallback to filename-based detection for backward compatibility
            filename = file_path.name.lower()
            for category, check_func in self.categories.items():
                if check_func(filename, path_parts):
                    return category
                    
            return "other"
        
    def _is_spec_file(self, filename: str, path_parts: List[str]) -> bool:
        """Check if file is a specification.
        
        Args:
            filename: Lowercase filename
            path_parts: Lowercase path components
            
        Returns:
            True if file is a specification
        """
        return (filename.startswith("spec") or 
                filename.endswith("spec.md") or 
                filename.endswith("spec.txt") or
                "spec" in filename)
                
    def _is_task_file(self, filename: str, path_parts: List[str]) -> bool:
        """Check if file is a task or implementation.
        
        Args:
            filename: Lowercase filename
            path_parts: Lowercase path components
            
        Returns:
            True if file is a task or implementation
        """
        task_indicators = ["task", "implementation", "plan"]
        
        return any(
            filename.startswith(indicator) or 
            filename.endswith(f"{indicator}.md") or
            filename.endswith(f"{indicator}.txt") or
            indicator in filename
            for indicator in task_indicators
        )
        
    def _is_dictation_file(self, filename: str, path_parts: List[str]) -> bool:
        """Check if file is a dictation.
        
        Args:
            filename: Lowercase filename
            path_parts: Lowercase path components
            
        Returns:
            True if file is a dictation
        """
        return "dictations" in path_parts
        
    def _is_text_file(self, file_path: Path) -> bool:
        """Check if file is a text file that should have content read.
        
        Args:
            file_path: Path to the file
            
        Returns:
            True if file is a text file
        """
        text_extensions = {'.md', '.txt', '.json', '.js', '.mjs', '.py', 
                          '.sh', '.yaml', '.yml', '.html', '.css', '.xml'}
        
        return file_path.suffix.lower() in text_extensions
        
    def get_files_by_category(self, category: str) -> List[ContentItem]:
        """Get all files in a specific category.
        
        Args:
            category: Category to filter by ('specs', 'tasks', 'dictations', 'all', 'other')
            
        Returns:
            List of content items
        """
        if category == "all":
            return list(self.index.values())
        
        return [item for item in self.index.values() if item.category == category]
        
    def get_files_by_date(self, date: str) -> List[ContentItem]:
        """Get all files from a specific date.
        
        Args:
            date: Date string in YYYY-MM-DD format
            
        Returns:
            List of content items
        """
        return [item for item in self.index.values() if item.date == date]
        
    def search_by_filename(self, pattern: str, category: Optional[str] = None) -> List[ContentItem]:
        """Search files by filename pattern.
        
        Args:
            pattern: Search pattern (supports partial matches)
            category: Optional category filter
            
        Returns:
            List of matching content items
        """
        pattern_lower = pattern.lower()
        results = []
        
        for item in self.index.values():
            if category and category != "all" and item.category != category:
                continue
                
            if pattern_lower in item.filename.lower():
                results.append(item)
                
        # Sort by relevance (exact matches first, then by filename length)
        def sort_key(item):
            filename_lower = item.filename.lower()
            if filename_lower == pattern_lower:
                return (0, len(filename_lower))
            elif filename_lower.startswith(pattern_lower):
                return (1, len(filename_lower))
            else:
                return (2, len(filename_lower))
                
        return sorted(results, key=sort_key)
        
    def search_content(self, query: str, category: Optional[str] = None) -> List[Tuple[ContentItem, float]]:
        """Search file contents for a query.
        
        Args:
            query: Search query
            category: Optional category filter
            
        Returns:
            List of tuples (content_item, relevance_score)
        """
        query_lower = query.lower()
        results = []
        
        for item in self.index.values():
            if category and category != "all" and item.category != category:
                continue
                
            if not item.content:
                continue
                
            content_lower = item.content.lower()
            
            # Simple relevance scoring based on term frequency
            score = 0.0
            
            # Filename match bonus
            if query_lower in item.filename.lower():
                score += 2.0
                
            # Content matches
            query_terms = query_lower.split()
            for term in query_terms:
                count = content_lower.count(term)
                score += count * 0.1
                
            if score > 0:
                results.append((item, score))
                
        # Sort by score (descending)
        return sorted(results, key=lambda x: x[1], reverse=True)
        
    def get_summary_files(self) -> List[ContentItem]:
        """Get files that appear to be summaries.
        
        Returns:
            List of summary content items
        """
        summary_indicators = ["summary", "readme", "overview"]
        results = []
        
        for item in self.index.values():
            filename_lower = item.filename.lower()
            if any(indicator in filename_lower for indicator in summary_indicators):
                results.append(item)
                
        # Sort by date (newest first)
        return sorted(results, key=lambda x: x.date, reverse=True)
        
    def extract_todos_from_content(self, content: str) -> List[str]:
        """Extract TODO items from content.
        
        Args:
            content: File content to search
            
        Returns:
            List of TODO items
        """
        todos = []
        
        # Patterns for TODO items
        patterns = [
            r"- \[ \] (.+)",  # Markdown checkboxes
            r"TODO[:\s]+(.+)",  # TODO: format
            r"- (.+)",  # Simple list items (in TODO sections)
        ]
        
        lines = content.split('\n')
        in_todo_section = False
        
        for line in lines:
            line = line.strip()
            
            # Check if we're entering a TODO section
            if line.lower().startswith('## todo') or line.lower().startswith('# todo'):
                in_todo_section = True
                continue
            elif line.startswith('#') and in_todo_section:
                in_todo_section = False
                
            # Extract TODOs
            for pattern in patterns:
                match = re.search(pattern, line, re.IGNORECASE)
                if match:
                    todo_text = match.group(1).strip()
                    if todo_text and len(todo_text) > 3:  # Filter out very short items
                        todos.append(todo_text)
                    break
                    
        return todos
    
    def needs_reindex(self) -> bool:
        """Check if the content needs to be reindexed.
        
        Returns:
            True if reindexing is needed
        """
        if not self.dot_ai_path.exists():
            return False
            
        if self.last_hash is None:
            return True
            
        return self.directory_monitor.has_changes(self.dot_ai_path, self.last_hash)
    
    async def refresh(self) -> int:
        """Refresh the index if needed.
        
        Returns:
            Number of files indexed (0 if no refresh needed)
        """
        if not self.needs_reindex():
            logger.debug("No reindexing needed")
            return 0
            
        logger.info("Refreshing content index...")
        
        # Clear existing index
        old_count = len(self.index)
        self.index.clear()
        
        # Rescan directories
        await self._scan_directories()
        
        # Update hash
        if self.dot_ai_path.exists():
            self.last_hash = self.directory_monitor.calculate_directory_hash(self.dot_ai_path)
            
        new_count = len(self.index)
        logger.info(f"Reindexed: {old_count} -> {new_count} files")
        
        return new_count

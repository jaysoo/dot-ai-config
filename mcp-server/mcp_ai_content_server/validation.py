"""Input validation and sanitization for the MCP server."""

import re
import os
from pathlib import Path
from typing import Optional, List, Any, Dict
import logging

logger = logging.getLogger(__name__)


class ValidationError(ValueError):
    """Raised when input validation fails."""
    pass


class InputValidator:
    """Validates and sanitizes user inputs."""
    
    # Regex patterns for validation
    DATE_PATTERN = re.compile(r'^\d{4}-\d{2}-\d{2}$')
    DATE_RANGE_PATTERN = re.compile(r'^\d{4}-\d{2}-\d{2}\.\.\d{4}-\d{2}-\d{2}$')
    
    # Security patterns to detect potential exploits
    PATH_TRAVERSAL_PATTERN = re.compile(r'\.\.[/\\]')
    COMMAND_INJECTION_CHARS = set(['&', '|', ';', '$', '`', '\n', '\r'])
    
    # Maximum lengths for inputs
    MAX_QUERY_LENGTH = 500
    MAX_PATH_LENGTH = 1000
    MAX_CATEGORY_LENGTH = 50
    
    @staticmethod
    def validate_query(query: str) -> str:
        """Validate and sanitize a search query.
        
        Args:
            query: The search query
            
        Returns:
            Sanitized query
            
        Raises:
            ValidationError: If query is invalid
        """
        if not query:
            raise ValidationError("Query cannot be empty")
            
        if len(query) > InputValidator.MAX_QUERY_LENGTH:
            raise ValidationError(f"Query too long (max {InputValidator.MAX_QUERY_LENGTH} chars)")
            
        # Check for command injection attempts
        if any(char in query for char in InputValidator.COMMAND_INJECTION_CHARS):
            raise ValidationError("Query contains invalid characters")
            
        # Strip and normalize whitespace
        query = ' '.join(query.strip().split())
        
        return query
        
    @staticmethod
    def validate_category(category: str, valid_categories: List[str]) -> str:
        """Validate category input.
        
        Args:
            category: The category string
            valid_categories: List of valid categories
            
        Returns:
            Validated category
            
        Raises:
            ValidationError: If category is invalid
        """
        if not category:
            return "all"
            
        if len(category) > InputValidator.MAX_CATEGORY_LENGTH:
            raise ValidationError(f"Category too long (max {InputValidator.MAX_CATEGORY_LENGTH} chars)")
            
        category = category.lower().strip()
        
        if category not in valid_categories:
            raise ValidationError(f"Invalid category. Must be one of: {', '.join(valid_categories)}")
            
        return category
        
    @staticmethod
    def validate_date_filter(date_filter: Optional[str]) -> Optional[str]:
        """Validate date filter input.
        
        Args:
            date_filter: Date or date range string
            
        Returns:
            Validated date filter
            
        Raises:
            ValidationError: If date format is invalid
        """
        if not date_filter:
            return None
            
        date_filter = date_filter.strip()
        
        # Check single date format
        if InputValidator.DATE_PATTERN.match(date_filter):
            return date_filter
            
        # Check date range format
        if InputValidator.DATE_RANGE_PATTERN.match(date_filter):
            start_date, end_date = date_filter.split('..')
            if start_date > end_date:
                raise ValidationError("Start date must be before end date")
            return date_filter
            
        raise ValidationError("Invalid date format. Use YYYY-MM-DD or YYYY-MM-DD..YYYY-MM-DD")
        
    @staticmethod
    def validate_max_results(max_results: int, min_val: int = 1, max_val: int = 50) -> int:
        """Validate max_results parameter.
        
        Args:
            max_results: Number of results to return
            min_val: Minimum allowed value
            max_val: Maximum allowed value
            
        Returns:
            Validated max_results
            
        Raises:
            ValidationError: If value is out of range
        """
        try:
            max_results = int(max_results)
        except (ValueError, TypeError):
            raise ValidationError("max_results must be an integer")
            
        if max_results < min_val or max_results > max_val:
            raise ValidationError(f"max_results must be between {min_val} and {max_val}")
            
        return max_results
        
    @staticmethod
    def validate_path(path: str, base_path: Path) -> Path:
        """Validate a file path for security.
        
        Args:
            path: The path to validate
            base_path: The allowed base path
            
        Returns:
            Validated Path object
            
        Raises:
            ValidationError: If path is invalid or unsafe
        """
        if not path:
            raise ValidationError("Path cannot be empty")
            
        if len(path) > InputValidator.MAX_PATH_LENGTH:
            raise ValidationError(f"Path too long (max {InputValidator.MAX_PATH_LENGTH} chars)")
            
        # Check for path traversal attempts
        if InputValidator.PATH_TRAVERSAL_PATTERN.search(path):
            raise ValidationError("Path traversal detected")
            
        # Resolve to absolute path and check if it's within base_path
        try:
            resolved_path = Path(path).resolve()
            base_resolved = base_path.resolve()
            
            # Ensure the path is within the allowed base path
            if not str(resolved_path).startswith(str(base_resolved)):
                raise ValidationError("Path is outside allowed directory")
                
        except Exception as e:
            raise ValidationError(f"Invalid path: {e}")
            
        return resolved_path
        
    @staticmethod
    def sanitize_filename(filename: str) -> str:
        """Sanitize a filename for safe usage.
        
        Args:
            filename: The filename to sanitize
            
        Returns:
            Sanitized filename
        """
        # Remove any path components
        filename = os.path.basename(filename)
        
        # Replace problematic characters
        filename = re.sub(r'[<>:"/\\|?*]', '_', filename)
        
        # Limit length
        if len(filename) > 255:
            name, ext = os.path.splitext(filename)
            filename = name[:255-len(ext)] + ext
            
        return filename


class RequestValidator:
    """Validates complete request objects."""
    
    @staticmethod
    def validate_search_request(
        query: str,
        category: str = "all",
        date_filter: Optional[str] = None,
        max_results: int = 10
    ) -> Dict[str, Any]:
        """Validate a search request.
        
        Returns:
            Dictionary of validated parameters
        """
        valid_categories = ["spec", "specs", "task", "tasks", "dictation", "dictations", "all"]
        
        return {
            'query': InputValidator.validate_query(query),
            'category': InputValidator.validate_category(category, valid_categories),
            'date_filter': InputValidator.validate_date_filter(date_filter),
            'max_results': InputValidator.validate_max_results(max_results)
        }
        
    @staticmethod
    def validate_task_context_request(
        task_name: str,
        include_related: bool = True
    ) -> Dict[str, Any]:
        """Validate a task context request."""
        return {
            'task_name': InputValidator.validate_query(task_name),
            'include_related': bool(include_related)
        }
        
    @staticmethod
    def validate_todo_request(
        category: str = "all",
        date_filter: Optional[str] = None,
        verbosity: str = "minimal",
        status_filter: str = "pending"
    ) -> Dict[str, Any]:
        """Validate a TODO extraction request."""
        valid_categories = ["spec", "specs", "task", "tasks", "dictation", "dictations", "all"]
        valid_verbosities = ["minimal", "standard", "detailed"]
        valid_status_filters = ["pending", "completed", "all"]
        
        return {
            'category': InputValidator.validate_category(category, valid_categories),
            'date_filter': InputValidator.validate_date_filter(date_filter),
            'verbosity': InputValidator.validate_category(verbosity, valid_verbosities),
            'status_filter': InputValidator.validate_category(status_filter, valid_status_filters)
        }
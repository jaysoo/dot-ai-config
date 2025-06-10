"""Directory monitoring utilities for detecting content changes."""

import hashlib
import logging
import os
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, Optional, Tuple

logger = logging.getLogger(__name__)


class DirectoryMonitor:
    """Monitors directory changes using lightweight hashing."""
    
    def __init__(self, cache_duration_seconds: int = 5):
        """Initialize the directory monitor.
        
        Args:
            cache_duration_seconds: How long to cache hash values
        """
        self.cache_duration = timedelta(seconds=cache_duration_seconds)
        self._hash_cache: Dict[str, Tuple[str, datetime]] = {}
        
    def calculate_directory_hash(self, directory: Path) -> str:
        """Calculate a hash representing the directory structure.
        
        Uses modification times and file counts for speed.
        Only considers the directory structure, not file contents.
        
        Args:
            directory: Path to the directory to hash
            
        Returns:
            Hash string representing the directory state
        """
        if not directory.exists():
            return "non-existent"
            
        # Check cache first
        cache_key = str(directory)
        if cache_key in self._hash_cache:
            cached_hash, cache_time = self._hash_cache[cache_key]
            if datetime.now() - cache_time < self.cache_duration:
                logger.debug(f"Using cached hash for {directory}")
                return cached_hash
        
        # Calculate new hash
        hasher = hashlib.sha256()
        
        # Walk the directory tree
        file_count = 0
        total_size = 0
        latest_mtime = 0.0
        
        try:
            for root, dirs, files in os.walk(directory):
                # Sort for consistent ordering
                dirs.sort()
                files.sort()
                
                # Hash directory structure
                rel_path = os.path.relpath(root, directory)
                hasher.update(rel_path.encode('utf-8'))
                
                # Process files
                for filename in files:
                    # Skip hidden files and certain extensions
                    if filename.startswith('.'):
                        continue
                        
                    file_path = os.path.join(root, filename)
                    try:
                        stat = os.stat(file_path)
                        
                        # Include filename, size, and modification time
                        hasher.update(filename.encode('utf-8'))
                        hasher.update(str(stat.st_size).encode('utf-8'))
                        hasher.update(str(int(stat.st_mtime)).encode('utf-8'))
                        
                        file_count += 1
                        total_size += stat.st_size
                        latest_mtime = max(latest_mtime, stat.st_mtime)
                        
                    except (OSError, IOError) as e:
                        logger.warning(f"Could not stat file {file_path}: {e}")
                        continue
                        
        except (OSError, IOError) as e:
            logger.error(f"Error walking directory {directory}: {e}")
            return "error"
            
        # Include summary statistics
        hasher.update(f"files:{file_count}".encode('utf-8'))
        hasher.update(f"size:{total_size}".encode('utf-8'))
        hasher.update(f"latest:{int(latest_mtime)}".encode('utf-8'))
        
        final_hash = hasher.hexdigest()[:16]  # Use first 16 chars for brevity
        
        # Cache the result
        self._hash_cache[cache_key] = (final_hash, datetime.now())
        
        logger.debug(f"Calculated hash for {directory}: {final_hash} "
                    f"(files: {file_count}, size: {total_size})")
        
        return final_hash
        
    def has_changes(self, directory: Path, previous_hash: str) -> bool:
        """Check if a directory has changed since the previous hash.
        
        Args:
            directory: Path to check
            previous_hash: Previously calculated hash
            
        Returns:
            True if the directory has changed
        """
        current_hash = self.calculate_directory_hash(directory)
        return current_hash != previous_hash
        
    def clear_cache(self, directory: Optional[Path] = None):
        """Clear the hash cache.
        
        Args:
            directory: Specific directory to clear, or None for all
        """
        if directory:
            cache_key = str(directory)
            if cache_key in self._hash_cache:
                del self._hash_cache[cache_key]
        else:
            self._hash_cache.clear()
            
    def get_cache_stats(self) -> Dict[str, int]:
        """Get cache statistics.
        
        Returns:
            Dictionary with cache statistics
        """
        now = datetime.now()
        valid_entries = sum(
            1 for _, (_, cache_time) in self._hash_cache.items()
            if now - cache_time < self.cache_duration
        )
        
        return {
            'total_entries': len(self._hash_cache),
            'valid_entries': valid_entries,
            'expired_entries': len(self._hash_cache) - valid_entries
        }
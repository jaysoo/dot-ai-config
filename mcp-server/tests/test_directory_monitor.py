"""Tests for directory monitoring functionality."""

import os
import tempfile
import time
from pathlib import Path
from datetime import datetime, timedelta

import pytest

from mcp_ai_content_server.directory_monitor import DirectoryMonitor


class TestDirectoryMonitor:
    """Test cases for DirectoryMonitor."""
    
    @pytest.fixture
    def temp_dir(self):
        """Create a temporary directory for testing."""
        with tempfile.TemporaryDirectory() as tmpdir:
            yield Path(tmpdir)
            
    @pytest.fixture
    def monitor(self):
        """Create a DirectoryMonitor instance."""
        return DirectoryMonitor(cache_duration_seconds=1)
        
    def test_calculate_hash_empty_directory(self, monitor, temp_dir):
        """Test hashing an empty directory."""
        hash1 = monitor.calculate_directory_hash(temp_dir)
        assert hash1 is not None
        assert len(hash1) == 16  # We use first 16 chars
        
        # Same directory should give same hash
        hash2 = monitor.calculate_directory_hash(temp_dir)
        assert hash1 == hash2
        
    def test_calculate_hash_with_files(self, monitor, temp_dir):
        """Test hashing a directory with files."""
        # Create some files
        (temp_dir / "file1.txt").write_text("content1")
        (temp_dir / "file2.md").write_text("content2")
        
        hash1 = monitor.calculate_directory_hash(temp_dir)
        
        # Add another file
        (temp_dir / "file3.txt").write_text("content3")
        
        # Clear cache to get fresh hash
        monitor.clear_cache()
        
        hash2 = monitor.calculate_directory_hash(temp_dir)
        assert hash1 != hash2  # Hash should change
        
    def test_calculate_hash_with_subdirectories(self, monitor, temp_dir):
        """Test hashing with subdirectories."""
        # Create subdirectory structure
        subdir = temp_dir / "subdir"
        subdir.mkdir()
        (subdir / "file.txt").write_text("content")
        
        hash1 = monitor.calculate_directory_hash(temp_dir)
        
        # Create another subdirectory
        subdir2 = temp_dir / "subdir2"
        subdir2.mkdir()
        (subdir2 / "file.txt").write_text("content")
        
        # Clear cache to get fresh hash
        monitor.clear_cache()
        
        hash2 = monitor.calculate_directory_hash(temp_dir)
        assert hash1 != hash2
        
    def test_hash_ignores_hidden_files(self, monitor, temp_dir):
        """Test that hidden files are ignored."""
        (temp_dir / "visible.txt").write_text("content")
        hash1 = monitor.calculate_directory_hash(temp_dir)
        
        # Add hidden file
        (temp_dir / ".hidden").write_text("secret")
        hash2 = monitor.calculate_directory_hash(temp_dir)
        
        assert hash1 == hash2  # Hash should not change
        
    def test_hash_detects_file_modifications(self, monitor, temp_dir):
        """Test that file modifications are detected."""
        file_path = temp_dir / "file.txt"
        file_path.write_text("original content")
        
        hash1 = monitor.calculate_directory_hash(temp_dir)
        
        # Modify file (need to ensure mtime changes)
        time.sleep(0.01)
        file_path.write_text("modified content")
        
        # Clear cache to force recalculation
        monitor.clear_cache()
        
        hash2 = monitor.calculate_directory_hash(temp_dir)
        assert hash1 != hash2
        
    def test_hash_caching(self, monitor, temp_dir):
        """Test hash caching functionality."""
        (temp_dir / "file.txt").write_text("content")
        
        # First call calculates hash
        hash1 = monitor.calculate_directory_hash(temp_dir)
        
        # Add file but hash should be cached
        (temp_dir / "file2.txt").write_text("content2")
        
        hash2 = monitor.calculate_directory_hash(temp_dir)
        assert hash1 == hash2  # Should return cached value
        
        # Wait for cache to expire
        time.sleep(1.1)
        
        hash3 = monitor.calculate_directory_hash(temp_dir)
        assert hash1 != hash3  # Should detect the new file now
        
    def test_has_changes(self, monitor, temp_dir):
        """Test the has_changes method."""
        (temp_dir / "file.txt").write_text("content")
        
        initial_hash = monitor.calculate_directory_hash(temp_dir)
        
        # No changes yet
        assert not monitor.has_changes(temp_dir, initial_hash)
        
        # Add file and clear cache
        (temp_dir / "new_file.txt").write_text("new content")
        monitor.clear_cache()
        
        # Should detect changes
        assert monitor.has_changes(temp_dir, initial_hash)
        
    def test_clear_cache(self, monitor, temp_dir):
        """Test cache clearing functionality."""
        # Create two directories
        dir1 = temp_dir / "dir1"
        dir2 = temp_dir / "dir2"
        dir1.mkdir()
        dir2.mkdir()
        
        # Calculate hashes to populate cache
        monitor.calculate_directory_hash(dir1)
        monitor.calculate_directory_hash(dir2)
        
        stats = monitor.get_cache_stats()
        assert stats['total_entries'] == 2
        
        # Clear specific directory
        monitor.clear_cache(dir1)
        stats = monitor.get_cache_stats()
        assert stats['total_entries'] == 1
        
        # Clear all
        monitor.clear_cache()
        stats = monitor.get_cache_stats()
        assert stats['total_entries'] == 0
        
    def test_nonexistent_directory(self, monitor):
        """Test handling of non-existent directory."""
        fake_dir = Path("/nonexistent/directory")
        hash_val = monitor.calculate_directory_hash(fake_dir)
        assert hash_val == "non-existent"
        
    def test_cache_stats(self, monitor, temp_dir):
        """Test cache statistics."""
        # Initially empty
        stats = monitor.get_cache_stats()
        assert stats['total_entries'] == 0
        assert stats['valid_entries'] == 0
        
        # Add some entries
        monitor.calculate_directory_hash(temp_dir)
        
        stats = monitor.get_cache_stats()
        assert stats['total_entries'] == 1
        assert stats['valid_entries'] == 1
        assert stats['expired_entries'] == 0
        
        # Wait for expiration
        time.sleep(1.1)
        
        stats = monitor.get_cache_stats()
        assert stats['total_entries'] == 1
        assert stats['valid_entries'] == 0
        assert stats['expired_entries'] == 1
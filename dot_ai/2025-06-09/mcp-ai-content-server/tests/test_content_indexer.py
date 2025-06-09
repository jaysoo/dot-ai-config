"""Tests for content indexer."""

import pytest
import tempfile
from pathlib import Path

from mcp_ai_content_server.content_indexer import ContentIndexer, ContentItem


@pytest.fixture
def temp_content_dir():
    """Create a temporary directory with test content."""
    with tempfile.TemporaryDirectory() as temp_dir:
        base_path = Path(temp_dir)
        dot_ai_path = base_path / "dot_ai"
        
        # Create test directory structure
        date_dir = dot_ai_path / "2025-06-09"
        date_dir.mkdir(parents=True)
        
        # Create test files
        spec_file = date_dir / "test-spec.md"
        spec_file.write_text("# Test Specification\n\nThis is a test spec.")
        
        task_file = date_dir / "implementation-task.md"
        task_file.write_text("# Implementation Task\n\n- [ ] Step 1\n- [x] Step 2")
        
        dictation_dir = date_dir / "dictations"
        dictation_dir.mkdir()
        dictation_file = dictation_dir / "notes.md"
        dictation_file.write_text("# Dictation Notes\n\nSome thoughts...")
        
        other_file = date_dir / "analysis.json"
        other_file.write_text('{"results": "test"}')
        
        yield base_path


class TestContentIndexer:
    """Test cases for ContentIndexer."""
    
    def test_initialization(self, temp_content_dir):
        """Test indexer initialization."""
        indexer = ContentIndexer(temp_content_dir)
        assert indexer.base_path == temp_content_dir
        assert len(indexer.index) == 0
        
    @pytest.mark.asyncio
    async def test_file_categorization(self, temp_content_dir):
        """Test filename-based categorization."""
        indexer = ContentIndexer(temp_content_dir)
        await indexer.initialize()
        
        # Check that files were indexed
        assert len(indexer.index) == 4
        
        # Check categorization
        categories = {item.category for item in indexer.index.values()}
        assert "specs" in categories
        assert "tasks" in categories
        assert "dictations" in categories
        assert "other" in categories
        
    @pytest.mark.asyncio
    async def test_spec_file_detection(self, temp_content_dir):
        """Test specification file detection."""
        indexer = ContentIndexer(temp_content_dir)
        await indexer.initialize()
        
        spec_items = indexer.get_files_by_category("specs")
        assert len(spec_items) == 1
        assert spec_items[0].filename == "test-spec.md"
        
    @pytest.mark.asyncio
    async def test_task_file_detection(self, temp_content_dir):
        """Test task file detection."""
        indexer = ContentIndexer(temp_content_dir)
        await indexer.initialize()
        
        task_items = indexer.get_files_by_category("tasks")
        assert len(task_items) == 1
        assert task_items[0].filename == "implementation-task.md"
        
    @pytest.mark.asyncio
    async def test_dictation_file_detection(self, temp_content_dir):
        """Test dictation file detection."""
        indexer = ContentIndexer(temp_content_dir)
        await indexer.initialize()
        
        dictation_items = indexer.get_files_by_category("dictations")
        assert len(dictation_items) == 1
        assert dictation_items[0].filename == "notes.md"
        
    @pytest.mark.asyncio
    async def test_content_reading(self, temp_content_dir):
        """Test content reading for text files."""
        indexer = ContentIndexer(temp_content_dir)
        await indexer.initialize()
        
        spec_items = indexer.get_files_by_category("specs")
        assert spec_items[0].content is not None
        assert "Test Specification" in spec_items[0].content
        
    def test_filename_search(self, temp_content_dir):
        """Test filename-based search."""
        indexer = ContentIndexer(temp_content_dir)
        # Manually add test items
        item = ContentItem(
            path=temp_content_dir / "test.md",
            filename="test-spec.md",
            category="specs",
            date="2025-06-09",
            content="test content"
        )
        indexer.index["test.md"] = item
        
        results = indexer.search_by_filename("spec")
        assert len(results) == 1
        assert results[0].filename == "test-spec.md"
        
    def test_content_search(self, temp_content_dir):
        """Test content-based search."""
        indexer = ContentIndexer(temp_content_dir)
        # Manually add test items
        item = ContentItem(
            path=temp_content_dir / "test.md",
            filename="test.md",
            category="other",
            date="2025-06-09",
            content="This is a test document with important keywords."
        )
        indexer.index["test.md"] = item
        
        results = indexer.search_content("important keywords")
        assert len(results) == 1
        assert results[0][0].filename == "test.md"
        assert results[0][1] > 0  # Score should be positive
        
    def test_todo_extraction(self, temp_content_dir):
        """Test TODO extraction from content."""
        indexer = ContentIndexer(temp_content_dir)
        
        content = """
        # TODO Section
        
        - [ ] First task
        - [x] Completed task
        - [ ] Another task
        
        TODO: Something else
        """
        
        todos = indexer.extract_todos_from_content(content)
        assert len(todos) >= 3
        assert "First task" in todos
        assert "Another task" in todos
        assert "Something else" in todos
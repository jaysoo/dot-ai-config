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
        
        # Create folder-based structure
        specs_dir = date_dir / "specs"
        specs_dir.mkdir()
        tasks_dir = date_dir / "tasks"
        tasks_dir.mkdir()
        dictations_dir = date_dir / "dictations"
        dictations_dir.mkdir()
        
        # Create test files in folders
        spec_file = specs_dir / "api-spec.md"
        spec_file.write_text("# Test Specification\n\nThis is a test spec.")
        
        task_file = tasks_dir / "implementation.md"
        task_file.write_text("# Implementation Task\n\n- [ ] Step 1\n- [x] Step 2")
        
        dictation_file = dictations_dir / "notes.md"
        dictation_file.write_text("# Dictation Notes\n\nSome thoughts...")
        
        # Create files with old filename patterns for backward compatibility
        old_spec = date_dir / "test-spec-old.md"
        old_spec.write_text("# Old Style Spec")
        
        old_task = date_dir / "implementation-task-old.md"
        old_task.write_text("# Old Style Task")
        
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
        """Test folder-based categorization."""
        indexer = ContentIndexer(temp_content_dir)
        await indexer.initialize()
        
        # Check that files were indexed
        assert len(indexer.index) == 6  # 3 in folders + 2 old style + 1 other
        
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
        assert len(spec_items) == 2  # One in folder, one old style
        filenames = {item.filename for item in spec_items}
        assert "api-spec.md" in filenames
        assert "test-spec-old.md" in filenames
        
    @pytest.mark.asyncio
    async def test_task_file_detection(self, temp_content_dir):
        """Test task file detection."""
        indexer = ContentIndexer(temp_content_dir)
        await indexer.initialize()
        
        task_items = indexer.get_files_by_category("tasks")
        assert len(task_items) == 2  # One in folder, one old style
        filenames = {item.filename for item in task_items}
        assert "implementation.md" in filenames
        assert "implementation-task-old.md" in filenames
        
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
        # Find the spec file in the specs folder
        api_spec = next((item for item in spec_items if item.filename == "api-spec.md"), None)
        assert api_spec is not None
        assert api_spec.content is not None
        assert "Test Specification" in api_spec.content
        
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
        
    @pytest.mark.asyncio
    async def test_folder_based_categorization(self, temp_content_dir):
        """Test that files in category folders are correctly categorized."""
        indexer = ContentIndexer(temp_content_dir)
        await indexer.initialize()
        
        # Check files in specs folder
        spec_items = [item for item in indexer.index.values() 
                     if "specs/" in str(item.path)]
        assert all(item.category == "specs" for item in spec_items)
        
        # Check files in tasks folder
        task_items = [item for item in indexer.index.values() 
                     if "tasks/" in str(item.path)]
        assert all(item.category == "tasks" for item in task_items)
        
        # Check files in dictations folder
        dictation_items = [item for item in indexer.index.values() 
                          if "dictations/" in str(item.path)]
        assert all(item.category == "dictations" for item in dictation_items)
        
    @pytest.mark.asyncio
    async def test_backward_compatibility(self, temp_content_dir):
        """Test that old filename-based detection still works."""
        indexer = ContentIndexer(temp_content_dir)
        await indexer.initialize()
        
        # Check that old-style files are still categorized correctly
        old_spec = next((item for item in indexer.index.values() 
                        if item.filename == "test-spec-old.md"), None)
        assert old_spec is not None
        assert old_spec.category == "specs"
        
        old_task = next((item for item in indexer.index.values() 
                        if item.filename == "implementation-task-old.md"), None)
        assert old_task is not None
        assert old_task.category == "tasks"
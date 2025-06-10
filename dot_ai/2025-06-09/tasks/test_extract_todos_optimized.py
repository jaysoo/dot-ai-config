"""Tests for optimized extract_todos functionality."""

import pytest
import json
from pathlib import Path
from datetime import datetime

# Test data representing typical TODO content
SAMPLE_TODO_CONTENT = """# Task Implementation Plan

## Overview
This is a sample task file with various TODO items.

## Implementation Steps

### Step 1: Setup
- [ ] Initialize project structure
- [ ] Configure development environment
- [x] Create initial documentation

### Step 2: Core Features
- [ ] Implement authentication module
- [ ] Add database connections
- [x] Setup logging framework

TODO: Review security best practices
TODO: Add comprehensive error handling

## Notes
Remember to update documentation after implementation.
"""


class TestExtractTodosOptimized:
    """Test cases for optimized TODO extraction."""
    
    @pytest.mark.asyncio
    async def test_extract_todos_minimal_verbosity(self, search_engine):
        """Test minimal verbosity output."""
        # Create mock data
        search_engine.indexer.index = {
            "2025-06-09/tasks/test-task.md": MockContentItem(
                path=Path("2025-06-09/tasks/test-task.md"),
                filename="test-task.md",
                category="tasks",
                date="2025-06-09",
                content=SAMPLE_TODO_CONTENT
            )
        }
        
        result = await search_engine.extract_todos(
            category="tasks",
            verbosity="minimal",
            status_filter="pending"
        )
        
        assert "summary" in result
        assert result["summary"]["total"] == 6
        assert result["summary"]["pending"] == 4
        assert result["summary"]["completed"] == 2
        
        assert "todos" in result
        assert "2025-06-09/tasks/test-task.md" in result["todos"]
        
        file_todos = result["todos"]["2025-06-09/tasks/test-task.md"]
        assert "p" in file_todos
        assert len(file_todos["p"]) == 4
        assert "Initialize project structure" in file_todos["p"][0]
        
    @pytest.mark.asyncio
    async def test_extract_todos_standard_verbosity(self, search_engine):
        """Test standard verbosity with line numbers."""
        search_engine.indexer.index = {
            "2025-06-09/tasks/test-task.md": MockContentItem(
                path=Path("2025-06-09/tasks/test-task.md"),
                filename="test-task.md",
                category="tasks",
                date="2025-06-09",
                content=SAMPLE_TODO_CONTENT
            )
        }
        
        result = await search_engine.extract_todos(
            category="tasks",
            verbosity="standard",
            status_filter="all"
        )
        
        assert "todos" in result
        file_todos = result["todos"]["2025-06-09/tasks/test-task.md"]
        
        assert "pending" in file_todos
        assert len(file_todos["pending"]) == 4
        
        # Check line number format
        first_todo = file_todos["pending"][0]
        assert "l" in first_todo
        assert "t" in first_todo
        assert isinstance(first_todo["l"], int)
        
        assert "completed_count" in file_todos
        assert file_todos["completed_count"] == 2
        
    @pytest.mark.asyncio
    async def test_extract_todos_token_limit(self, search_engine):
        """Test token limit enforcement."""
        # Create many files to exceed token limit
        large_index = {}
        for i in range(100):
            large_index[f"2025-06-09/tasks/task-{i}.md"] = MockContentItem(
                path=Path(f"2025-06-09/tasks/task-{i}.md"),
                filename=f"task-{i}.md",
                category="tasks",
                date="2025-06-09",
                content=SAMPLE_TODO_CONTENT
            )
        
        search_engine.indexer.index = large_index
        
        result = await search_engine.extract_todos(
            category="tasks",
            verbosity="detailed",
            max_tokens=1000  # Very low limit
        )
        
        assert result["meta"]["truncated"] is True
        assert result["meta"]["estimated_tokens"] <= 1000
        
        # Should have fewer files than total
        assert len(result["todos"]) < 100
        assert "files_shown" in result["meta"]
        assert "files_total" in result["meta"]
        
    @pytest.mark.asyncio
    async def test_extract_todos_date_filter(self, search_engine):
        """Test date filtering."""
        search_engine.indexer.index = {
            "2025-06-08/tasks/old-task.md": MockContentItem(
                path=Path("2025-06-08/tasks/old-task.md"),
                filename="old-task.md",
                category="tasks",
                date="2025-06-08",
                content="- [ ] Old TODO"
            ),
            "2025-06-09/tasks/new-task.md": MockContentItem(
                path=Path("2025-06-09/tasks/new-task.md"),
                filename="new-task.md",
                category="tasks",
                date="2025-06-09",
                content="- [ ] New TODO"
            )
        }
        
        # Test exact date
        result = await search_engine.extract_todos(
            category="tasks",
            date_filter="2025-06-09"
        )
        
        assert len(result["todos"]) == 1
        assert "2025-06-09/tasks/new-task.md" in result["todos"]
        
        # Test date range
        result = await search_engine.extract_todos(
            category="tasks",
            date_filter="2025-06-08..2025-06-09"
        )
        
        assert len(result["todos"]) == 2
        
    @pytest.mark.asyncio
    async def test_extract_todos_status_filter(self, search_engine):
        """Test status filtering."""
        search_engine.indexer.index = {
            "2025-06-09/tasks/test-task.md": MockContentItem(
                path=Path("2025-06-09/tasks/test-task.md"),
                filename="test-task.md",
                category="tasks",
                date="2025-06-09",
                content=SAMPLE_TODO_CONTENT
            )
        }
        
        # Test pending only
        result = await search_engine.extract_todos(
            status_filter="pending"
        )
        
        file_todos = result["todos"]["2025-06-09/tasks/test-task.md"]
        assert "p" in file_todos
        assert len(file_todos["p"]) == 4
        
        # Test completed only
        result = await search_engine.extract_todos(
            status_filter="completed",
            verbosity="standard"
        )
        
        # In standard verbosity, completed items show as count
        file_todos = result["todos"]["2025-06-09/tasks/test-task.md"]
        assert file_todos["completed_count"] == 2
        assert "pending" not in file_todos
        
    @pytest.mark.asyncio
    async def test_extract_todos_error_handling(self, search_engine):
        """Test error handling for invalid parameters."""
        # Invalid category
        result = await search_engine.extract_todos(
            category="invalid"
        )
        assert "error" in result
        
        # Invalid date format
        result = await search_engine.extract_todos(
            date_filter="invalid-date"
        )
        assert "error" in result
        
    def test_path_abbreviation(self, search_engine):
        """Test path abbreviation logic."""
        base_path = Path("/Users/test/projects")
        
        # Test with date folder
        full_path = "/Users/test/projects/dot_ai/2025-06-09/tasks/file.md"
        abbreviated = search_engine._abbreviate_path(full_path, base_path)
        assert abbreviated == "2025-06-09/tasks/file.md"
        
        # Test without date folder
        full_path = "/Users/test/projects/other/file.md"
        abbreviated = search_engine._abbreviate_path(full_path, base_path)
        assert abbreviated == "other/file.md"


class MockContentItem:
    """Mock ContentItem for testing."""
    def __init__(self, path, filename, category, date, content):
        self.path = path
        self.filename = filename
        self.category = category
        self.date = date
        self.content = content


@pytest.fixture
async def search_engine(tmp_path):
    """Create a test search engine instance."""
    from mcp_ai_content_server.content_indexer import ContentIndexer
    from mcp_ai_content_server.search_engine import SearchEngine
    
    indexer = ContentIndexer(tmp_path)
    await indexer.initialize()
    return SearchEngine(indexer)
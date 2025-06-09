"""Tests for search engine."""

import pytest
import tempfile
from pathlib import Path

from mcp_ai_content_server.content_indexer import ContentIndexer, ContentItem
from mcp_ai_content_server.search_engine import SearchEngine


@pytest.fixture
def mock_indexer():
    """Create a mock content indexer with test data."""
    with tempfile.TemporaryDirectory() as temp_dir:
        base_path = Path(temp_dir)
        indexer = ContentIndexer(base_path)
        
        # Add test items
        items = [
            ContentItem(
                path=base_path / "spec1.md",
                filename="api-spec.md",
                category="specs",
                date="2025-06-09",
                content="# API Specification\n\nThis document describes the API endpoints."
            ),
            ContentItem(
                path=base_path / "task1.md",
                filename="api-implementation.md",
                category="tasks",
                date="2025-06-09",
                content="# API Implementation\n\n- [ ] Create endpoints\n- [ ] Add authentication"
            ),
            ContentItem(
                path=base_path / "notes.md",
                filename="meeting-notes.md",
                category="dictations",
                date="2025-06-08",
                content="# Meeting Notes\n\nDiscussed API design and implementation strategy."
            )
        ]
        
        for i, item in enumerate(items):
            indexer.index[f"item_{i}"] = item
            
        yield indexer


class TestSearchEngine:
    """Test cases for SearchEngine."""
    
    def test_initialization(self, mock_indexer):
        """Test search engine initialization."""
        engine = SearchEngine(mock_indexer)
        assert engine.indexer == mock_indexer
        assert engine.semantic_engine is not None
        
    @pytest.mark.asyncio
    async def test_basic_search(self, mock_indexer):
        """Test basic search functionality."""
        engine = SearchEngine(mock_indexer)
        
        results = await engine.search("API", category="all", max_results=10)
        
        # Should find files containing "API"
        assert len(results) > 0
        
        # Check result structure
        result = results[0]
        assert "filename" in result
        assert "path" in result
        assert "category" in result
        assert "score" in result
        
    @pytest.mark.asyncio
    async def test_category_filtering(self, mock_indexer):
        """Test search with category filtering."""
        engine = SearchEngine(mock_indexer)
        
        # Search only in specs
        spec_results = await engine.search("API", category="specs")
        
        # Should only return spec files
        for result in spec_results:
            assert result["category"] == "specs"
            
    @pytest.mark.asyncio
    async def test_date_filtering(self, mock_indexer):
        """Test search with date filtering."""
        engine = SearchEngine(mock_indexer)
        
        # Search with specific date
        results = await engine.search("meeting", date_filter="2025-06-08")
        
        # Should only return files from that date
        for result in results:
            assert result["date"] == "2025-06-08"
            
    @pytest.mark.asyncio
    async def test_task_context_retrieval(self, mock_indexer):
        """Test task context retrieval."""
        engine = SearchEngine(mock_indexer)
        
        results = await engine.get_task_context("API")
        
        # Should find related tasks and specs
        assert len(results) > 0
        
        # Should include content for context
        for result in results:
            if "content" in result:
                assert len(result["content"]) > 0
                
    @pytest.mark.asyncio
    async def test_spec_finding(self, mock_indexer):
        """Test specification finding."""
        engine = SearchEngine(mock_indexer)
        
        results = await engine.find_specs("API")
        
        # Should find API spec
        assert len(results) > 0
        assert any("api-spec.md" in result["filename"] for result in results)
        
    @pytest.mark.asyncio
    async def test_todo_extraction(self, mock_indexer):
        """Test TODO extraction across categories."""
        engine = SearchEngine(mock_indexer)
        
        results = await engine.extract_todos(category="tasks")
        
        # Should find TODOs in task files
        assert len(results) > 0
        
        todo_result = results[0]
        assert "todos" in todo_result
        assert len(todo_result["todos"]) > 0
        
    def test_filename_scoring(self, mock_indexer):
        """Test filename relevance scoring."""
        engine = SearchEngine(mock_indexer)
        
        # Exact match should score highest
        exact_score = engine._calculate_filename_score("api-spec.md", "api-spec.md")
        
        # Partial match should score lower
        partial_score = engine._calculate_filename_score("api", "api-spec.md")
        
        # No match should score lowest
        no_match_score = engine._calculate_filename_score("xyz", "api-spec.md")
        
        assert exact_score > partial_score > no_match_score
        
    def test_snippet_extraction(self, mock_indexer):
        """Test snippet extraction from content."""
        engine = SearchEngine(mock_indexer)
        
        content = "This is a long document with API information in the middle section that should be extracted as a snippet when searching for API."
        
        snippet = engine._extract_snippet("API", content, snippet_length=50)
        
        assert "API" in snippet
        assert len(snippet) <= 60  # Should include "..." markers
        assert "..." in snippet  # Should have truncation markers
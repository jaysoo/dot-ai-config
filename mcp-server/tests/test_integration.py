"""Integration tests for the MCP AI Content Server."""

import pytest
import tempfile
import asyncio
from pathlib import Path

from mcp_ai_content_server.server import AIContentServer


@pytest.fixture
def sample_content_structure():
    """Create a sample content structure for testing."""
    with tempfile.TemporaryDirectory() as temp_dir:
        base_path = Path(temp_dir)
        dot_ai = base_path / "dot_ai"
        
        # Create multiple date directories
        dates = ["2025-06-07", "2025-06-08", "2025-06-09"]
        
        for date in dates:
            date_dir = dot_ai / date
            date_dir.mkdir(parents=True)
            
            # Create spec file
            spec_file = date_dir / f"project-spec-{date}.md"
            spec_file.write_text(f"""
# Project Specification {date}

## Overview
This specification defines the project requirements for {date}.

## Requirements
- User authentication
- Data management
- API endpoints

## Architecture
Microservices architecture with REST APIs.

## TODO
- [ ] Complete implementation
- [ ] Write tests
""")
            
            # Create task file
            task_file = date_dir / f"implementation-task-{date}.md"
            task_file.write_text(f"""
# Implementation Task {date}

## Step 1: Setup
Initialize project structure

## Step 2: Development
- [ ] Create user service
- [x] Setup database
- [ ] Implement API

## Step 3: Testing
Write comprehensive tests
""")
            
            # Create dictations
            dict_dir = date_dir / "dictations"
            dict_dir.mkdir()
            
            dict_file = dict_dir / f"notes-{date}.md"
            dict_file.write_text(f"""
# Meeting Notes {date}

Discussed project progress and next steps.

Key decisions:
- Use PostgreSQL database
- Implement OAuth authentication
""")
            
            # Create other files
            analysis_file = date_dir / f"analysis-{date}.json"
            analysis_file.write_text('{"status": "in_progress", "progress": 60}')
            
        yield base_path


class TestAIContentServerIntegration:
    """Integration tests for AIContentServer."""
    
    @pytest.mark.asyncio
    async def test_server_initialization(self, sample_content_structure):
        """Test server initialization with real content."""
        server = AIContentServer(sample_content_structure)
        
        # Initialize the content indexer
        await server.content_indexer.initialize()
        
        # Check that content was indexed
        assert len(server.content_indexer.index) > 0
        
        # Verify categories
        categories = {item.category for item in server.content_indexer.index.values()}
        assert "specs" in categories
        assert "tasks" in categories
        assert "dictations" in categories
        
    @pytest.mark.asyncio
    async def test_search_across_dates(self, sample_content_structure):
        """Test searching across multiple dates."""
        server = AIContentServer(sample_content_structure)
        await server.content_indexer.initialize()
        
        # Search for specifications across all dates
        results = await server.search_engine.search("specification", category="specs")
        
        # Should find specs from multiple dates
        assert len(results) >= 3
        
        dates_found = {result["date"] for result in results}
        assert len(dates_found) >= 3
        
    @pytest.mark.asyncio
    async def test_task_context_with_relationships(self, sample_content_structure):
        """Test task context retrieval with file relationships."""
        server = AIContentServer(sample_content_structure)
        await server.content_indexer.initialize()
        
        # Get context for project implementation
        context = await server.search_engine.get_task_context("project")
        
        # Should find related tasks, specs, and dictations
        assert len(context) > 0
        
        categories_found = {result["category"] for result in context}
        # Should find multiple categories for comprehensive context
        assert len(categories_found) >= 2
        
    @pytest.mark.asyncio
    async def test_todo_extraction_comprehensive(self, sample_content_structure):
        """Test comprehensive TODO extraction."""
        server = AIContentServer(sample_content_structure)
        await server.content_indexer.initialize()
        
        # Extract TODOs from all categories
        todos = await server.search_engine.extract_todos(category="all")
        
        # Should find TODOs from multiple files
        assert len(todos) > 0
        
        # Check that TODOs were found
        total_todos = sum(len(file_todos["todos"]) for file_todos in todos)
        assert total_todos > 0
        
    @pytest.mark.asyncio
    async def test_date_filtering_functionality(self, sample_content_structure):
        """Test date filtering across all operations."""
        server = AIContentServer(sample_content_structure)
        await server.content_indexer.initialize()
        
        test_date = "2025-06-09"
        
        # Test search with date filter
        results = await server.search_engine.search(
            "project", 
            category="all", 
            date_filter=test_date
        )
        
        # All results should be from the specified date
        for result in results:
            assert result["date"] == test_date
            
    @pytest.mark.asyncio
    async def test_content_evolution_tracking(self, sample_content_structure):
        """Test tracking content evolution across dates."""
        server = AIContentServer(sample_content_structure)
        await server.content_indexer.initialize()
        
        # Search for project-related content
        results = await server.search_engine.search("project", category="all")
        
        # Group by category and check evolution
        by_category = {}
        for result in results:
            category = result["category"]
            if category not in by_category:
                by_category[category] = []
            by_category[category].append(result)
            
        # Should have evolution in specs and tasks
        for category in ["specs", "tasks"]:
            if category in by_category:
                dates = {item["date"] for item in by_category[category]}
                # Should span multiple dates showing evolution
                assert len(dates) >= 2
                
    @pytest.mark.asyncio
    async def test_summary_retrieval(self, sample_content_structure):
        """Test summary file retrieval."""
        server = AIContentServer(sample_content_structure)
        await server.content_indexer.initialize()
        
        # Add a summary file
        summary_path = sample_content_structure / "dot_ai" / "2025-06-09" / "SUMMARY.md"
        summary_path.write_text("# Summary\n\nProject completed successfully with all features implemented.")
        
        # Re-initialize to pick up the new file
        await server.content_indexer.initialize()
        
        summaries = await server.search_engine.get_summaries()
        
        # Should find the summary file
        assert len(summaries) > 0
        summary_files = [s for s in summaries if "SUMMARY" in s["filename"]]
        assert len(summary_files) > 0
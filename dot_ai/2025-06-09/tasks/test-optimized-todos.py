#!/usr/bin/env python3
"""Test script for optimized TODO extraction."""

import asyncio
import json
from pathlib import Path
import sys

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent.parent.parent / "mcp-server"))

from mcp_ai_content_server.content_indexer import ContentIndexer
from mcp_ai_content_server.search_engine import SearchEngine


async def test_optimized_todos():
    """Test the optimized extract_todos function."""
    
    # Initialize components
    base_path = Path(__file__).parent.parent.parent.parent
    indexer = ContentIndexer(base_path)
    await indexer.initialize()
    
    search_engine = SearchEngine(indexer)
    
    print("Testing optimized extract_todos function...\n")
    
    # Test cases
    test_cases = [
        {
            "name": "Minimal verbosity - pending only",
            "params": {
                "category": "tasks",
                "verbosity": "minimal",
                "status_filter": "pending"
            }
        },
        {
            "name": "Standard verbosity - all TODOs",
            "params": {
                "category": "all",
                "verbosity": "standard", 
                "status_filter": "all",
                "date_filter": "2025-06-09"
            }
        },
        {
            "name": "Detailed verbosity - date range",
            "params": {
                "category": "all",
                "verbosity": "detailed",
                "status_filter": "all",
                "date_filter": "2025-06-01..2025-06-09",
                "max_tokens": 10000
            }
        }
    ]
    
    for test in test_cases:
        print(f"\n{'='*60}")
        print(f"Test: {test['name']}")
        print(f"Params: {test['params']}")
        print('='*60)
        
        try:
            result = await search_engine.extract_todos(**test['params'])
            
            # Pretty print result
            result_json = json.dumps(result, indent=2)
            
            # Calculate token usage
            tokens = len(result_json) // 4
            
            print(f"\nResult summary:")
            if 'summary' in result:
                print(f"  Total TODOs: {result['summary']['total']}")
                print(f"  Pending: {result['summary']['pending']}")
                print(f"  Completed: {result['summary']['completed']}")
                print(f"  Files: {result['summary']['files']}")
            
            print(f"\nToken usage:")
            print(f"  Characters: {len(result_json):,}")
            print(f"  Estimated tokens: {tokens:,}")
            
            if 'meta' in result:
                print(f"\nMetadata:")
                for key, value in result['meta'].items():
                    print(f"  {key}: {value}")
            
            # Save sample output
            output_file = f"test-output-{test['name'].replace(' ', '-').lower()}.json"
            with open(output_file, 'w') as f:
                json.dump(result, f, indent=2)
            print(f"\nFull output saved to: {output_file}")
            
            # Show a snippet of the todos
            if 'todos' in result and result['todos']:
                print("\nFirst few TODOs:")
                todo_items = list(result['todos'].items())[:3]
                for path, todos in todo_items:
                    print(f"\n  {path}:")
                    if isinstance(todos, dict):
                        if 'p' in todos:  # minimal format
                            for todo in todos['p'][:2]:
                                print(f"    - {todo}")
                        elif 'pending' in todos:  # standard/detailed format
                            for todo in todos['pending'][:2]:
                                if isinstance(todo, dict):
                                    print(f"    - [{todo.get('l', '?')}] {todo.get('t', todo.get('text', ''))}")
                                else:
                                    print(f"    - {todo}")
                    
        except Exception as e:
            print(f"ERROR: {e}")
            import traceback
            traceback.print_exc()


if __name__ == "__main__":
    asyncio.run(test_optimized_todos())
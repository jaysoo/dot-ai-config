# Enhance Search Engine: Date Ranges and Categories

## Task Overview

Enhance the MCP AI content server's search engine to support:
1. **Date range filtering** with inclusive start..end syntax (e.g., `2025-01-01..2025-01-31`)
2. **Flexible category matching** for singular/plural forms (`dictation`/`dictations`, `task`/`tasks`, `spec`/`specs`)
3. **Folder-based category filtering** instead of filename-based matching

## Current State Analysis

Based on code analysis:
- Date filtering currently supports exact date matches only (`search_engine.py:105-110`)
- Categories are determined by filename patterns (`content_indexer.py:146-163`)
- File searching scans all files under `yyyy-mm-dd/` directories recursively

## Detailed Implementation Plan

### Step 1: Implement Date Range Parsing and Filtering
**Files to modify**: `search_engine.py`, `server.py`

**Changes needed**:
- Add date range parsing logic to handle `start..end` syntax
- Modify date filtering in `search()` method to support ranges
- Update MCP tool parameter validation to accept range format
- Add comprehensive date parsing with error handling

**Expected commits**:
- `feat: add date range parsing with start..end syntax`
- `feat: implement inclusive date range filtering in search engine`

### Step 2: Implement Flexible Category Matching
**Files to modify**: `content_indexer.py`, `search_engine.py`

**Changes needed**:
- Create category normalization function to handle singular/plural
- Update category filtering logic to use normalized categories
- Map user input (`dictation`, `dictations`) to canonical form (`dictations`)
- Ensure backward compatibility with existing category names

**Expected commits**:
- `feat: add category normalization for singular/plural forms`
- `feat: update search filtering to use normalized categories`

### Step 3: Implement Folder-Based Category Filtering
**Files to modify**: `content_indexer.py`, `search_engine.py`

**Changes needed**:
- Modify `_categorize_file()` to use folder structure instead of filename patterns
- Update category logic:
  - `dictations`: Only files under `yyyy-mm-dd/dictations/` folders
  - `tasks`: Only files under `yyyy-mm-dd/tasks/` folders
  - `specs`: Only files under `yyyy-mm-dd/specs/` folders
  - `all`: Files from any location (default behavior)
- Remove filename-based category detection for these specific categories
- Update search filtering to respect new folder-based categorization

**Expected commits**:
- `refactor: change category detection from filename to folder-based`
- `feat: implement folder-specific search for dictations, tasks, specs`

### Step 4: Update Tests and Documentation
**Files to modify**: `tests/test_search_engine.py`, `tests/test_content_indexer.py`, `README.md`

**Changes needed**:
- Add test cases for date range parsing and filtering
- Add test cases for category normalization
- Add test cases for folder-based category filtering
- Update existing tests that rely on filename-based categorization
- Update documentation with new search syntax examples

**Expected commits**:
- `test: add comprehensive tests for date range functionality`
- `test: add tests for flexible category matching and folder-based filtering`
- `docs: update README with new search syntax examples`

## Technical Implementation Details

### Date Range Implementation
```python
def parse_date_filter(date_input):
    """Parse date input supporting both exact dates and ranges"""
    if '..' in date_input:
        start_str, end_str = date_input.split('..', 1)
        start_date = datetime.strptime(start_str.strip(), '%Y-%m-%d').date()
        end_date = datetime.strptime(end_str.strip(), '%Y-%m-%d').date()
        return {'type': 'range', 'start': start_date, 'end': end_date}
    else:
        exact_date = datetime.strptime(date_input.strip(), '%Y-%m-%d').date()
        return {'type': 'exact', 'date': exact_date}
```

### Category Normalization Map
```python
CATEGORY_ALIASES = {
    'dictation': 'dictations',
    'dictations': 'dictations',
    'task': 'tasks', 
    'tasks': 'tasks',
    'spec': 'specs',
    'specs': 'specs'
}
```

### Folder-Based Category Logic
```python
def _categorize_file(self, file_path: Path) -> str:
    """Categorize file based on folder structure"""
    path_parts = file_path.parts
    
    # Look for category folders in path
    if 'dictations' in path_parts:
        return 'dictations'
    elif 'tasks' in path_parts:
        return 'tasks'  
    elif 'specs' in path_parts:
        return 'specs'
    else:
        return 'other'
```

## Potential Challenges and Alternatives

### Challenge 1: Backward Compatibility
- **Risk**: Existing clients might rely on current filename-based categorization
- **Mitigation**: Add feature flag or maintain both approaches initially
- **Alternative**: Gradual migration with deprecation warnings

### Challenge 2: Date Range Performance
- **Risk**: Range queries might be slower than exact matches
- **Mitigation**: Index dates for efficient range queries
- **Alternative**: Pre-filter by date directories before content scanning

### Challenge 3: Category Ambiguity
- **Risk**: Files might exist in multiple category folders
- **Mitigation**: Use first match in folder hierarchy or most specific path
- **Alternative**: Support multiple categories per file

## Expected Outcome

After completion, the search engine will support:

1. **Flexible date queries**:
   - `2025-01-15` (exact date, current behavior)
   - `2025-01-01..2025-01-31` (inclusive range, new feature)
   - `2025-01-01..2025-12-31` (year-long ranges)

2. **Intuitive category searches**:
   - `dictation` and `dictations` both work
   - `task` and `tasks` both work  
   - `spec` and `specs` both work
   - Backward compatible with existing usage

3. **Precise folder-based filtering**:
   - `dictations` category only searches `yyyy-mm-dd/dictations/` folders
   - `tasks` category only searches `yyyy-mm-dd/tasks/` folders
   - `specs` category only searches `yyyy-mm-dd/specs/` folders
   - `all` category searches everywhere (default behavior)

The changes will be fully backward compatible while providing more intuitive and powerful search capabilities.
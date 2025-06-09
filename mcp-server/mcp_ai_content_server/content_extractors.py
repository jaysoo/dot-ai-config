"""Specialized content extractors for different types of AI-generated content."""

import re
import json
import logging
from typing import Dict, List, Any, Optional, Tuple
from pathlib import Path

from .content_indexer import ContentItem

logger = logging.getLogger(__name__)


class ContentExtractors:
    """Collection of specialized content extractors."""
    
    @staticmethod
    def extract_implementation_steps(content: str) -> List[Dict[str, Any]]:
        """Extract implementation steps from task/implementation files.
        
        Args:
            content: File content
            
        Returns:
            List of implementation steps with metadata
        """
        steps = []
        
        # Patterns for step indicators
        step_patterns = [
            r"^## Step \d+[:\s]*(.+)$",  # ## Step 1: Description
            r"^### Step \d+[:\s]*(.+)$", # ### Step 1: Description
            r"^\d+\.\s*(.+)$",          # 1. Description
            r"^- \[ \]\s*(.+)$",        # - [ ] Task item
        ]
        
        lines = content.split('\n')
        current_step = None
        step_content = []
        
        for i, line in enumerate(lines):
            line = line.strip()
            
            # Check if this line starts a new step
            step_match = None
            for pattern in step_patterns:
                match = re.match(pattern, line, re.IGNORECASE)
                if match:
                    step_match = match
                    break
                    
            if step_match:
                # Save previous step if exists
                if current_step:
                    current_step['content'] = '\n'.join(step_content).strip()
                    steps.append(current_step)
                    
                # Start new step
                current_step = {
                    'title': step_match.group(1).strip(),
                    'line_number': i + 1,
                    'content': '',
                    'completed': '[ ]' not in line  # Assume completed if not checkbox
                }
                step_content = []
            elif current_step:
                # Add content to current step
                step_content.append(line)
                
        # Add final step
        if current_step:
            current_step['content'] = '\n'.join(step_content).strip()
            steps.append(current_step)
            
        return steps
        
    @staticmethod
    def extract_specifications(content: str) -> Dict[str, Any]:
        """Extract specification details from spec files.
        
        Args:
            content: File content
            
        Returns:
            Dictionary with specification details
        """
        spec_data = {
            'title': '',
            'overview': '',
            'requirements': [],
            'architecture': '',
            'components': [],
            'apis': [],
            'todos': []
        }
        
        lines = content.split('\n')
        current_section = None
        section_content = []
        
        for line in lines:
            line = line.strip()
            
            # Detect sections
            if line.startswith('# '):
                if not spec_data['title']:
                    spec_data['title'] = line[2:].strip()
                current_section = 'title'
            elif line.startswith('## '):
                # Save previous section
                if current_section and section_content:
                    ContentExtractors._save_spec_section(
                        spec_data, current_section, '\n'.join(section_content)
                    )
                    
                section_name = line[3:].lower().strip()
                current_section = ContentExtractors._map_spec_section(section_name)
                section_content = []
            elif current_section:
                section_content.append(line)
                
        # Save final section
        if current_section and section_content:
            ContentExtractors._save_spec_section(
                spec_data, current_section, '\n'.join(section_content)
            )
            
        return spec_data
        
    @staticmethod
    def _map_spec_section(section_name: str) -> str:
        """Map section names to specification fields.
        
        Args:
            section_name: Raw section name
            
        Returns:
            Mapped field name
        """
        mapping = {
            'overview': 'overview',
            'summary': 'overview',
            'description': 'overview',
            'requirements': 'requirements',
            'architecture': 'architecture',
            'design': 'architecture',
            'components': 'components',
            'api': 'apis',
            'apis': 'apis',
            'endpoints': 'apis',
            'todo': 'todos',
            'todos': 'todos',
            'tasks': 'todos'
        }
        
        for key, value in mapping.items():
            if key in section_name:
                return value
                
        return 'other'
        
    @staticmethod
    def _save_spec_section(spec_data: Dict[str, Any], section: str, content: str):
        """Save content to appropriate specification section.
        
        Args:
            spec_data: Specification data dictionary
            section: Section name
            content: Section content
        """
        content = content.strip()
        if not content:
            return
            
        if section in ['overview', 'architecture']:
            spec_data[section] = content
        elif section in ['requirements', 'components', 'apis', 'todos']:
            # Extract list items
            items = ContentExtractors._extract_list_items(content)
            spec_data[section].extend(items)
            
    @staticmethod
    def _extract_list_items(content: str) -> List[str]:
        """Extract list items from content.
        
        Args:
            content: Content with list items
            
        Returns:
            List of extracted items
        """
        items = []
        
        # Patterns for list items
        patterns = [
            r"^[-*+]\s+(.+)$",      # - item, * item, + item
            r"^\d+\.\s+(.+)$",      # 1. item
            r"^- \[ \]\s*(.+)$",    # - [ ] checkbox
            r"^- \[x\]\s*(.+)$",    # - [x] checked
        ]
        
        for line in content.split('\n'):
            line = line.strip()
            for pattern in patterns:
                match = re.match(pattern, line, re.IGNORECASE)
                if match:
                    items.append(match.group(1).strip())
                    break
                    
        return items
        
    @staticmethod
    def extract_code_snippets(content: str) -> List[Dict[str, str]]:
        """Extract code snippets from content.
        
        Args:
            content: File content
            
        Returns:
            List of code snippets with metadata
        """
        snippets = []
        
        # Pattern for code blocks
        code_block_pattern = r"```(\w+)?\n(.*?)\n```"
        
        for match in re.finditer(code_block_pattern, content, re.DOTALL):
            language = match.group(1) or 'text'
            code = match.group(2).strip()
            
            if code:
                snippets.append({
                    'language': language,
                    'code': code,
                    'lines': len(code.split('\n'))
                })
                
        return snippets
        
    @staticmethod
    def extract_file_references(content: str) -> List[Dict[str, str]]:
        """Extract file path references from content.
        
        Args:
            content: File content
            
        Returns:
            List of file references with context
        """
        references = []
        
        # Patterns for file paths
        patterns = [
            r"`([^`]+\.(py|js|ts|md|json|yaml|yml|sh|mjs))`",  # `file.ext`
            r'"([^"]+\.(py|js|ts|md|json|yaml|yml|sh|mjs))"',  # "file.ext"
            r"'([^']+\.(py|js|ts|md|json|yaml|yml|sh|mjs))'",  # 'file.ext'
            r"(\S+\.(py|js|ts|md|json|yaml|yml|sh|mjs))",      # file.ext
        ]
        
        for pattern in patterns:
            for match in re.finditer(pattern, content):
                file_path = match.group(1)
                
                # Extract context around the match
                start = max(0, match.start() - 50)
                end = min(len(content), match.end() + 50)
                context = content[start:end].strip()
                
                references.append({
                    'path': file_path,
                    'context': context
                })
                
        return references
        
    @staticmethod
    def extract_decisions(content: str) -> List[Dict[str, str]]:
        """Extract decisions and reasoning from content.
        
        Args:
            content: File content
            
        Returns:
            List of decisions with reasoning
        """
        decisions = []
        
        # Look for decision patterns
        decision_patterns = [
            r"## Decision[:\s]*(.+)",
            r"### Decision[:\s]*(.+)",
            r"**Decision[:\s]*(.+)**",
            r"Decision[:\s]*(.+)",
        ]
        
        reasoning_indicators = [
            'reasoning', 'rationale', 'justification', 'because', 'pros', 'cons'
        ]
        
        lines = content.split('\n')
        current_decision = None
        decision_content = []
        
        for line in lines:
            line = line.strip()
            
            # Check for decision markers
            for pattern in decision_patterns:
                match = re.search(pattern, line, re.IGNORECASE)
                if match:
                    # Save previous decision
                    if current_decision:
                        current_decision['reasoning'] = '\n'.join(decision_content).strip()
                        decisions.append(current_decision)
                        
                    current_decision = {
                        'decision': match.group(1).strip(),
                        'reasoning': ''
                    }
                    decision_content = []
                    break
            else:
                # Check for reasoning section
                if current_decision:
                    line_lower = line.lower()
                    if any(indicator in line_lower for indicator in reasoning_indicators):
                        decision_content.append(line)
                    elif line and not line.startswith('#'):
                        decision_content.append(line)
                        
        # Add final decision
        if current_decision:
            current_decision['reasoning'] = '\n'.join(decision_content).strip()
            decisions.append(current_decision)
            
        return decisions
        
    @staticmethod
    def extract_metadata(item: ContentItem) -> Dict[str, Any]:
        """Extract comprehensive metadata from a content item.
        
        Args:
            item: Content item to analyze
            
        Returns:
            Dictionary with extracted metadata
        """
        if not item.content:
            return {}
            
        metadata = {
            'word_count': len(item.content.split()),
            'line_count': len(item.content.split('\n')),
            'has_code': '```' in item.content,
            'has_todos': bool(re.search(r'todo|TODO|\[ \]', item.content, re.IGNORECASE)),
            'has_links': bool(re.search(r'http[s]?://|www\.', item.content)),
        }
        
        # Extract specific content based on category
        if item.category == 'specs':
            metadata['spec_details'] = ContentExtractors.extract_specifications(item.content)
        elif item.category == 'tasks':
            metadata['implementation_steps'] = ContentExtractors.extract_implementation_steps(item.content)
            
        # Common extractions
        metadata['code_snippets'] = ContentExtractors.extract_code_snippets(item.content)
        metadata['file_references'] = ContentExtractors.extract_file_references(item.content)
        metadata['decisions'] = ContentExtractors.extract_decisions(item.content)
        
        return metadata
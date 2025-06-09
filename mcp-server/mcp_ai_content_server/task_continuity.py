"""Task continuation support for AI-generated content."""

import logging
import re
from typing import Dict, List, Any, Optional, Set, Tuple
from dataclasses import dataclass
from datetime import datetime, timedelta

from .content_indexer import ContentIndexer, ContentItem
from .content_extractors import ContentExtractors

logger = logging.getLogger(__name__)


@dataclass
class TaskDependency:
    """Represents a dependency between tasks/files."""
    source_file: str
    target_file: str
    dependency_type: str  # 'references', 'implements', 'continues', 'related'
    confidence: float


@dataclass
class TaskProgress:
    """Represents the progress of a task."""
    task_name: str
    file_path: str
    total_steps: int
    completed_steps: int
    remaining_todos: List[str]
    last_updated: str
    status: str  # 'not_started', 'in_progress', 'completed', 'blocked'


class TaskContinuityEngine:
    """Engine for analyzing and supporting task continuation."""
    
    def __init__(self, content_indexer: ContentIndexer):
        """Initialize the task continuity engine.
        
        Args:
            content_indexer: Content indexer instance
        """
        self.indexer = content_indexer
        self.dependencies: List[TaskDependency] = []
        self.task_progress: Dict[str, TaskProgress] = {}
        
    async def analyze_task_relationships(self):
        """Analyze relationships between tasks and files."""
        logger.info("Analyzing task relationships...")
        
        self.dependencies.clear()
        
        # Get all content items
        all_items = list(self.indexer.index.values())
        
        # Find dependencies between files
        for item in all_items:
            if not item.content:
                continue
                
            # Extract file references
            file_refs = ContentExtractors.extract_file_references(item.content)
            
            for ref in file_refs:
                # Find matching files in the index
                matching_items = self._find_matching_files(ref['path'])
                
                for match in matching_items:
                    dependency = TaskDependency(
                        source_file=str(item.path),
                        target_file=str(match.path),
                        dependency_type='references',
                        confidence=0.8
                    )
                    self.dependencies.append(dependency)
                    
        # Find implementation relationships
        await self._find_implementation_relationships(all_items)
        
        # Find continuation relationships
        await self._find_continuation_relationships(all_items)
        
        logger.info(f"Found {len(self.dependencies)} task dependencies")
        
    def _find_matching_files(self, file_path: str) -> List[ContentItem]:
        """Find files that match a given path pattern.
        
        Args:
            file_path: File path to match
            
        Returns:
            List of matching content items
        """
        matches = []
        file_path_lower = file_path.lower()
        
        for item in self.indexer.index.values():
            # Check exact filename match
            if item.filename.lower() == file_path_lower:
                matches.append(item)
            # Check if the path ends with the filename
            elif str(item.path).lower().endswith(file_path_lower):
                matches.append(item)
                
        return matches
        
    async def _find_implementation_relationships(self, items: List[ContentItem]):
        """Find relationships between specs and their implementations.
        
        Args:
            items: All content items
        """
        specs = [item for item in items if item.category == 'specs']
        tasks = [item for item in items if item.category == 'tasks']
        
        for spec in specs:
            spec_name_base = self._extract_base_name(spec.filename)
            
            for task in tasks:
                task_name_base = self._extract_base_name(task.filename)
                
                # Check for name similarity
                similarity = self._calculate_name_similarity(spec_name_base, task_name_base)
                
                if similarity > 0.6:
                    dependency = TaskDependency(
                        source_file=str(task.path),
                        target_file=str(spec.path),
                        dependency_type='implements',
                        confidence=similarity
                    )
                    self.dependencies.append(dependency)
                    
    async def _find_continuation_relationships(self, items: List[ContentItem]):
        """Find continuation relationships between tasks across dates.
        
        Args:
            items: All content items
        """
        # Group items by base name
        name_groups: Dict[str, List[ContentItem]] = {}
        
        for item in items:
            base_name = self._extract_base_name(item.filename)
            if base_name not in name_groups:
                name_groups[base_name] = []
            name_groups[base_name].append(item)
            
        # Find continuation relationships within groups
        for base_name, group_items in name_groups.items():
            if len(group_items) < 2:
                continue
                
            # Sort by date
            group_items.sort(key=lambda x: x.date)
            
            # Create continuation relationships
            for i in range(len(group_items) - 1):
                current = group_items[i]
                next_item = group_items[i + 1]
                
                dependency = TaskDependency(
                    source_file=str(next_item.path),
                    target_file=str(current.path),
                    dependency_type='continues',
                    confidence=0.9
                )
                self.dependencies.append(dependency)
                
    def _extract_base_name(self, filename: str) -> str:
        """Extract base name from filename by removing common suffixes.
        
        Args:
            filename: Original filename
            
        Returns:
            Base name
        """
        # Remove extension
        base = filename.lower()
        if '.' in base:
            base = base.rsplit('.', 1)[0]
            
        # Remove common suffixes
        suffixes = ['-spec', '-task', '-implementation', '-plan', '-v1', '-v2', '-final']
        for suffix in suffixes:
            if base.endswith(suffix):
                base = base[:-len(suffix)]
                
        return base
        
    def _calculate_name_similarity(self, name1: str, name2: str) -> float:
        """Calculate similarity between two names.
        
        Args:
            name1: First name
            name2: Second name
            
        Returns:
            Similarity score (0-1)
        """
        # Simple token-based similarity
        tokens1 = set(re.split(r'[-_\s]+', name1.lower()))
        tokens2 = set(re.split(r'[-_\s]+', name2.lower()))
        
        if not tokens1 or not tokens2:
            return 0.0
            
        intersection = tokens1.intersection(tokens2)
        union = tokens1.union(tokens2)
        
        return len(intersection) / len(union)
        
    async def analyze_task_progress(self):
        """Analyze progress of tasks."""
        logger.info("Analyzing task progress...")
        
        self.task_progress.clear()
        
        # Get all task files
        task_items = self.indexer.get_files_by_category('tasks')
        
        for item in task_items:
            if not item.content:
                continue
                
            # Extract implementation steps
            steps = ContentExtractors.extract_implementation_steps(item.content)
            
            # Extract TODOs
            todos = self.indexer.extract_todos_from_content(item.content)
            
            # Calculate progress
            total_steps = len(steps)
            completed_steps = sum(1 for step in steps if step.get('completed', False))
            
            # Determine status
            if total_steps == 0:
                status = 'not_started'
            elif completed_steps == 0:
                status = 'not_started'
            elif completed_steps == total_steps:
                status = 'completed'
            else:
                status = 'in_progress'
                
            # Check for blocking indicators
            if any('blocked' in todo.lower() or 'waiting' in todo.lower() for todo in todos):
                status = 'blocked'
                
            progress = TaskProgress(
                task_name=self._extract_base_name(item.filename),
                file_path=str(item.path),
                total_steps=total_steps,
                completed_steps=completed_steps,
                remaining_todos=todos,
                last_updated=item.date,
                status=status
            )
            
            self.task_progress[progress.task_name] = progress
            
        logger.info(f"Analyzed progress for {len(self.task_progress)} tasks")
        
    async def get_continuation_context(self, task_name: str) -> Dict[str, Any]:
        """Get comprehensive context for continuing a task.
        
        Args:
            task_name: Name of the task to continue
            
        Returns:
            Dictionary with continuation context
        """
        context = {
            'task_name': task_name,
            'current_progress': None,
            'dependencies': [],
            'related_files': [],
            'next_steps': [],
            'blockers': []
        }
        
        # Get current progress
        if task_name in self.task_progress:
            context['current_progress'] = self.task_progress[task_name]
            
        # Find dependencies
        task_dependencies = [
            dep for dep in self.dependencies 
            if self._extract_base_name(dep.source_file) == task_name or
               self._extract_base_name(dep.target_file) == task_name
        ]
        context['dependencies'] = task_dependencies
        
        # Get related files
        related_paths = set()
        for dep in task_dependencies:
            related_paths.add(dep.source_file)
            related_paths.add(dep.target_file)
            
        context['related_files'] = list(related_paths)
        
        # Determine next steps
        if context['current_progress']:
            progress = context['current_progress']
            
            if progress.status == 'not_started':
                context['next_steps'] = ['Begin implementation', 'Review specifications']
            elif progress.status == 'in_progress':
                context['next_steps'] = progress.remaining_todos[:3]  # Top 3 TODOs
            elif progress.status == 'completed':
                context['next_steps'] = ['Task completed', 'Consider follow-up tasks']
            elif progress.status == 'blocked':
                context['blockers'] = [
                    todo for todo in progress.remaining_todos 
                    if 'blocked' in todo.lower() or 'waiting' in todo.lower()
                ]
                
        return context
        
    async def find_stale_tasks(self, days_threshold: int = 7) -> List[Dict[str, Any]]:
        """Find tasks that haven't been updated recently.
        
        Args:
            days_threshold: Number of days to consider a task stale
            
        Returns:
            List of stale tasks with context
        """
        stale_tasks = []
        cutoff_date = (datetime.now() - timedelta(days=days_threshold)).strftime('%Y-%m-%d')
        
        for task_name, progress in self.task_progress.items():
            if progress.last_updated < cutoff_date and progress.status == 'in_progress':
                stale_context = await self.get_continuation_context(task_name)
                stale_context['days_since_update'] = (
                    datetime.now() - datetime.strptime(progress.last_updated, '%Y-%m-%d')
                ).days
                
                stale_tasks.append(stale_context)
                
        # Sort by days since update (most stale first)
        stale_tasks.sort(key=lambda x: x['days_since_update'], reverse=True)
        
        return stale_tasks
        
    async def suggest_next_tasks(self, completed_task: str) -> List[Dict[str, Any]]:
        """Suggest next tasks based on a completed task.
        
        Args:
            completed_task: Name of the completed task
            
        Returns:
            List of suggested next tasks
        """
        suggestions = []
        
        # Find tasks that depend on the completed task
        dependent_tasks = [
            dep for dep in self.dependencies
            if (self._extract_base_name(dep.target_file) == completed_task and
                dep.dependency_type in ['implements', 'continues'])
        ]
        
        for dep in dependent_tasks:
            source_task = self._extract_base_name(dep.source_file)
            
            if source_task in self.task_progress:
                progress = self.task_progress[source_task]
                
                suggestion = {
                    'task_name': source_task,
                    'reason': f"Depends on completed task: {completed_task}",
                    'current_status': progress.status,
                    'file_path': progress.file_path,
                    'confidence': dep.confidence
                }
                
                suggestions.append(suggestion)
                
        # Sort by confidence
        suggestions.sort(key=lambda x: x['confidence'], reverse=True)
        
        return suggestions
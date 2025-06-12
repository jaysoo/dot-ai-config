"""Thread-safe synchronization utilities for the MCP server."""

import asyncio
import threading
from typing import Dict, Any, Optional
from contextlib import asynccontextmanager, contextmanager
import logging

logger = logging.getLogger(__name__)


class ThreadSafeCache:
    """Thread-safe cache implementation with TTL support."""
    
    def __init__(self):
        self._cache: Dict[str, Any] = {}
        self._lock = threading.RLock()
        
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache."""
        with self._lock:
            return self._cache.get(key)
            
    def set(self, key: str, value: Any) -> None:
        """Set value in cache."""
        with self._lock:
            self._cache[key] = value
            
    def delete(self, key: str) -> None:
        """Delete value from cache."""
        with self._lock:
            self._cache.pop(key, None)
            
    def clear(self) -> None:
        """Clear all cache entries."""
        with self._lock:
            self._cache.clear()
            
    def __contains__(self, key: str) -> bool:
        """Check if key exists in cache."""
        with self._lock:
            return key in self._cache


class AsyncLock:
    """Async-aware lock that can be used in both sync and async contexts."""
    
    def __init__(self):
        self._async_lock = asyncio.Lock()
        self._thread_lock = threading.RLock()
        
    @asynccontextmanager
    async def async_acquire(self):
        """Acquire lock in async context."""
        async with self._async_lock:
            yield
            
    @contextmanager
    def sync_acquire(self):
        """Acquire lock in sync context."""
        with self._thread_lock:
            yield


class IndexingLock:
    """Specialized lock for preventing concurrent indexing operations."""
    
    def __init__(self):
        self._lock = AsyncLock()
        self._indexing = False
        self._waiters = 0
        
    async def acquire_for_indexing(self) -> bool:
        """Acquire lock for indexing. Returns True if indexing should proceed."""
        async with self._lock.async_acquire():
            if self._indexing:
                # Another indexing operation is in progress
                self._waiters += 1
                return False
            self._indexing = True
            return True
            
    async def release_indexing(self):
        """Release indexing lock."""
        async with self._lock.async_acquire():
            self._indexing = False
            if self._waiters > 0:
                # Clear waiters - the next acquire will handle re-indexing
                self._waiters = 0
                
    @property
    def is_indexing(self) -> bool:
        """Check if indexing is currently in progress."""
        with self._lock.sync_acquire():
            return self._indexing


class RefreshCoordinator:
    """Coordinates refresh operations to prevent race conditions."""
    
    def __init__(self):
        self._refresh_lock = IndexingLock()
        self._last_refresh_time: Optional[float] = None
        self._refresh_in_progress = False
        
    async def coordinate_refresh(self, refresh_func):
        """Coordinate a refresh operation to prevent concurrent refreshes.
        
        Args:
            refresh_func: Async function that performs the actual refresh
            
        Returns:
            Tuple of (refreshed, result) where refreshed indicates if refresh happened
        """
        # Try to acquire the indexing lock
        should_index = await self._refresh_lock.acquire_for_indexing()
        
        if not should_index:
            # Another refresh is in progress, wait for it to complete
            logger.debug("Refresh already in progress, skipping")
            return False, None
            
        try:
            # Perform the refresh
            logger.debug("Starting coordinated refresh")
            result = await refresh_func()
            return True, result
        finally:
            # Always release the lock
            await self._refresh_lock.release_indexing()


class SearchOperationGuard:
    """Guards search operations to ensure index consistency."""
    
    def __init__(self, refresh_coordinator: RefreshCoordinator):
        self._coordinator = refresh_coordinator
        self._operation_lock = asyncio.Lock()
        
    @asynccontextmanager
    async def guard_operation(self):
        """Guard a search operation.
        
        Ensures that the operation doesn't run concurrently with indexing.
        """
        async with self._operation_lock:
            # Wait if indexing is in progress
            while self._coordinator._refresh_lock.is_indexing:
                await asyncio.sleep(0.1)
            yield
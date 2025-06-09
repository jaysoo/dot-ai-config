"""Semantic search capabilities using sentence transformers."""

import logging
import numpy as np
from typing import List, Dict, Any, Optional, Tuple
from pathlib import Path

try:
    from sentence_transformers import SentenceTransformer
    HAS_TRANSFORMERS = True
except ImportError:
    HAS_TRANSFORMERS = False
    logging.warning("sentence-transformers not available. Semantic search will be disabled.")

from .content_indexer import ContentItem

logger = logging.getLogger(__name__)


class SemanticSearchEngine:
    """Semantic search engine using sentence transformers."""
    
    def __init__(self, model_name: str = "all-MiniLM-L6-v2"):
        """Initialize the semantic search engine.
        
        Args:
            model_name: Name of the sentence transformer model to use
        """
        self.model_name = model_name
        self.model = None
        self.embeddings_cache: Dict[str, np.ndarray] = {}
        self.text_cache: Dict[str, str] = {}
        
        if HAS_TRANSFORMERS:
            try:
                self.model = SentenceTransformer(model_name)
                logger.info(f"Loaded semantic search model: {model_name}")
            except Exception as e:
                logger.error(f"Failed to load semantic search model: {e}")
                self.model = None
        else:
            logger.warning("Semantic search not available - sentence-transformers not installed")
            
    def is_available(self) -> bool:
        """Check if semantic search is available.
        
        Returns:
            True if semantic search can be used
        """
        return self.model is not None
        
    async def build_embeddings(self, items: List[ContentItem]) -> None:
        """Build embeddings for content items.
        
        Args:
            items: List of content items to process
        """
        if not self.is_available():
            logger.warning("Semantic search not available")
            return
            
        logger.info(f"Building embeddings for {len(items)} items")
        
        # Prepare texts for embedding
        texts_to_embed = []
        item_keys = []
        
        for item in items:
            if not item.content:
                continue
                
            # Create a key for this item
            key = str(item.path.relative_to(item.path.parent.parent.parent))
            
            # Skip if already cached
            if key in self.embeddings_cache:
                continue
                
            # Prepare text for embedding (filename + content snippet)
            text = self._prepare_text_for_embedding(item)
            if text:
                texts_to_embed.append(text)
                item_keys.append(key)
                self.text_cache[key] = text
                
        if not texts_to_embed:
            logger.info("No new texts to embed")
            return
            
        try:
            # Generate embeddings in batches
            batch_size = 32
            for i in range(0, len(texts_to_embed), batch_size):
                batch_texts = texts_to_embed[i:i + batch_size]
                batch_keys = item_keys[i:i + batch_size]
                
                embeddings = self.model.encode(batch_texts, convert_to_numpy=True)
                
                for key, embedding in zip(batch_keys, embeddings):
                    self.embeddings_cache[key] = embedding
                    
                logger.debug(f"Processed batch {i//batch_size + 1}/{(len(texts_to_embed) + batch_size - 1)//batch_size}")
                
            logger.info(f"Generated embeddings for {len(texts_to_embed)} new items")
            
        except Exception as e:
            logger.error(f"Error generating embeddings: {e}")
            
    def _prepare_text_for_embedding(self, item: ContentItem) -> str:
        """Prepare text for embedding by combining filename and content.
        
        Args:
            item: Content item to process
            
        Returns:
            Prepared text for embedding
        """
        if not item.content:
            return ""
            
        # Start with filename (important for semantic matching)
        text_parts = [item.filename.replace('-', ' ').replace('_', ' ')]
        
        # Add category context
        text_parts.append(f"category: {item.category}")
        
        # Add content (truncated for performance)
        content = item.content.strip()
        
        # Extract key sections from markdown
        if item.path.suffix.lower() == '.md':
            content = self._extract_markdown_summary(content)
        
        # Truncate content to reasonable length for embedding
        max_content_length = 1000
        if len(content) > max_content_length:
            content = content[:max_content_length] + "..."
            
        text_parts.append(content)
        
        return " ".join(text_parts)
        
    def _extract_markdown_summary(self, content: str) -> str:
        """Extract key sections from markdown content.
        
        Args:
            content: Markdown content
            
        Returns:
            Summarized content
        """
        lines = content.split('\n')
        summary_parts = []
        
        current_section = []
        in_code_block = False
        
        for line in lines:
            line = line.strip()
            
            # Track code blocks
            if line.startswith('```'):
                in_code_block = not in_code_block
                continue
                
            if in_code_block:
                continue
                
            # Headers are important
            if line.startswith('#'):
                if current_section:
                    summary_parts.extend(current_section[:3])  # First 3 lines of previous section
                current_section = [line]
            elif line and not line.startswith('*') and not line.startswith('-'):
                # Regular content lines (skip list items for brevity)
                current_section.append(line)
                
        # Add remaining section
        if current_section:
            summary_parts.extend(current_section[:3])
            
        return " ".join(summary_parts)
        
    async def semantic_search(
        self, 
        query: str, 
        items: List[ContentItem],
        max_results: int = 10,
        similarity_threshold: float = 0.3
    ) -> List[Tuple[ContentItem, float]]:
        """Perform semantic search on content items.
        
        Args:
            query: Search query
            items: List of content items to search
            max_results: Maximum number of results
            similarity_threshold: Minimum similarity score
            
        Returns:
            List of tuples (content_item, similarity_score)
        """
        if not self.is_available():
            logger.warning("Semantic search not available, falling back to keyword search")
            return []
            
        try:
            # Ensure embeddings are built
            await self.build_embeddings(items)
            
            # Encode the query
            query_embedding = self.model.encode([query], convert_to_numpy=True)[0]
            
            # Calculate similarities
            results = []
            
            for item in items:
                key = str(item.path.relative_to(item.path.parent.parent.parent))
                
                if key not in self.embeddings_cache:
                    continue
                    
                item_embedding = self.embeddings_cache[key]
                
                # Calculate cosine similarity
                similarity = np.dot(query_embedding, item_embedding) / (
                    np.linalg.norm(query_embedding) * np.linalg.norm(item_embedding)
                )
                
                if similarity >= similarity_threshold:
                    results.append((item, float(similarity)))
                    
            # Sort by similarity (descending)
            results.sort(key=lambda x: x[1], reverse=True)
            
            return results[:max_results]
            
        except Exception as e:
            logger.error(f"Error in semantic search: {e}")
            return []
            
    async def find_similar_content(
        self, 
        reference_item: ContentItem, 
        all_items: List[ContentItem],
        max_results: int = 5,
        similarity_threshold: float = 0.4
    ) -> List[Tuple[ContentItem, float]]:
        """Find content similar to a reference item.
        
        Args:
            reference_item: Reference content item
            all_items: All available content items
            max_results: Maximum number of results
            similarity_threshold: Minimum similarity score
            
        Returns:
            List of similar content items with similarity scores
        """
        if not self.is_available():
            return []
            
        try:
            # Ensure embeddings are built
            await self.build_embeddings(all_items)
            
            reference_key = str(reference_item.path.relative_to(reference_item.path.parent.parent.parent))
            
            if reference_key not in self.embeddings_cache:
                return []
                
            reference_embedding = self.embeddings_cache[reference_key]
            
            # Calculate similarities
            results = []
            
            for item in all_items:
                # Skip the reference item itself
                if item.path == reference_item.path:
                    continue
                    
                key = str(item.path.relative_to(item.path.parent.parent.parent))
                
                if key not in self.embeddings_cache:
                    continue
                    
                item_embedding = self.embeddings_cache[key]
                
                # Calculate cosine similarity
                similarity = np.dot(reference_embedding, item_embedding) / (
                    np.linalg.norm(reference_embedding) * np.linalg.norm(item_embedding)
                )
                
                if similarity >= similarity_threshold:
                    results.append((item, float(similarity)))
                    
            # Sort by similarity (descending)
            results.sort(key=lambda x: x[1], reverse=True)
            
            return results[:max_results]
            
        except Exception as e:
            logger.error(f"Error finding similar content: {e}")
            return []
            
    def get_cache_stats(self) -> Dict[str, Any]:
        """Get statistics about the embedding cache.
        
        Returns:
            Dictionary with cache statistics
        """
        return {
            "embeddings_cached": len(self.embeddings_cache),
            "texts_cached": len(self.text_cache),
            "model_available": self.is_available(),
            "model_name": self.model_name if self.is_available() else None
        }
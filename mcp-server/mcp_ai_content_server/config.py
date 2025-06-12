"""Configuration management using pydantic."""

import os
from pathlib import Path
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, validator
from pydantic_settings import BaseSettings


class IndexingConfig(BaseModel):
    """Configuration for content indexing."""
    
    skip_extensions: List[str] = Field(
        default=[
            '.pyc', '.pyo', '.pyd', '.so', '.dll', '.exe',
            '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.ico',
            '.zip', '.tar', '.gz', '.rar', '.7z', '.json'
        ],
        description="File extensions to skip during indexing"
    )
    
    max_file_size_mb: float = Field(
        default=10.0,
        description="Maximum file size in MB to index",
        ge=0.1,
        le=100.0
    )
    
    text_extensions: List[str] = Field(
        default=[
            '.md', '.txt', '.json', '.js', '.mjs', '.py',
            '.sh', '.yaml', '.yml', '.html', '.css', '.xml'
        ],
        description="File extensions to treat as text files"
    )
    
    cache_duration_seconds: int = Field(
        default=5,
        description="How long to cache directory hashes",
        ge=1,
        le=300
    )


class SearchConfig(BaseModel):
    """Configuration for search functionality."""
    
    max_results_default: int = Field(
        default=10,
        description="Default maximum number of search results",
        ge=1,
        le=100
    )
    
    max_results_limit: int = Field(
        default=50,
        description="Maximum allowed results per search",
        ge=10,
        le=200
    )
    
    snippet_length: int = Field(
        default=200,
        description="Length of content snippets in search results",
        ge=50,
        le=500
    )
    
    semantic_search_enabled: bool = Field(
        default=True,
        description="Enable semantic search using sentence transformers"
    )
    
    semantic_model: str = Field(
        default="all-MiniLM-L6-v2",
        description="Sentence transformer model to use"
    )


class SecurityConfig(BaseModel):
    """Configuration for security settings."""
    
    max_query_length: int = Field(
        default=500,
        description="Maximum allowed query length",
        ge=50,
        le=2000
    )
    
    max_path_length: int = Field(
        default=1000,
        description="Maximum allowed path length",
        ge=100,
        le=4096
    )
    
    rate_limit_enabled: bool = Field(
        default=True,
        description="Enable rate limiting"
    )
    
    rate_limit_requests: int = Field(
        default=100,
        description="Maximum requests per minute",
        ge=10,
        le=1000
    )
    
    allowed_base_paths: List[str] = Field(
        default=[],
        description="Additional allowed base paths for indexing"
    )


class ServerConfig(BaseModel):
    """Configuration for server settings."""
    
    host: str = Field(
        default="127.0.0.1",
        description="Server host address"
    )
    
    port: int = Field(
        default=8888,
        description="Server port",
        ge=1024,
        le=65535
    )
    
    transport: str = Field(
        default="sse",
        description="MCP transport type",
        pattern="^(sse|stdio)$"
    )
    
    log_level: str = Field(
        default="INFO",
        description="Logging level",
        pattern="^(DEBUG|INFO|WARNING|ERROR|CRITICAL)$"
    )
    
    log_file: Optional[Path] = Field(
        default=None,
        description="Path to log file"
    )
    
    enable_color_logs: bool = Field(
        default=True,
        description="Enable colored console output"
    )


class MCPServerConfig(BaseSettings):
    """Main configuration for the MCP AI Content Server."""
    
    # Base configuration
    base_path: Path = Field(
        default_factory=lambda: Path.cwd(),
        description="Base path for searching dot_ai directories"
    )
    
    # Sub-configurations
    indexing: IndexingConfig = Field(
        default_factory=IndexingConfig,
        description="Indexing configuration"
    )
    
    search: SearchConfig = Field(
        default_factory=SearchConfig,
        description="Search configuration"
    )
    
    security: SecurityConfig = Field(
        default_factory=SecurityConfig,
        description="Security configuration"
    )
    
    server: ServerConfig = Field(
        default_factory=ServerConfig,
        description="Server configuration"
    )
    
    class Config:
        """Pydantic configuration."""
        env_prefix = "MCP_"
        env_nested_delimiter = "__"
        case_sensitive = False
        
    @validator('base_path')
    def validate_base_path(cls, v):
        """Ensure base path exists and is a directory."""
        if not v.exists():
            raise ValueError(f"Base path does not exist: {v}")
        if not v.is_dir():
            raise ValueError(f"Base path is not a directory: {v}")
        return v.resolve()
    
    @classmethod
    def from_env(cls) -> 'MCPServerConfig':
        """Create configuration from environment variables.
        
        Environment variables follow the pattern:
        MCP_<SECTION>__<SETTING>
        
        Examples:
        - MCP_BASE_PATH=/path/to/base
        - MCP_SERVER__PORT=9999
        - MCP_INDEXING__MAX_FILE_SIZE_MB=20.0
        """
        return cls()
    
    @classmethod
    def from_dict(cls, config_dict: Dict[str, Any]) -> 'MCPServerConfig':
        """Create configuration from a dictionary."""
        return cls(**config_dict)
    
    def to_dict(self) -> Dict[str, Any]:
        """Convert configuration to dictionary."""
        return self.model_dump()
    
    def save_to_file(self, path: Path) -> None:
        """Save configuration to a JSON file."""
        import json
        with open(path, 'w') as f:
            json.dump(self.to_dict(), f, indent=2, default=str)
    
    @classmethod
    def load_from_file(cls, path: Path) -> 'MCPServerConfig':
        """Load configuration from a JSON file."""
        import json
        with open(path, 'r') as f:
            config_dict = json.load(f)
        return cls.from_dict(config_dict)


# Singleton instance
_config: Optional[MCPServerConfig] = None


def get_config() -> MCPServerConfig:
    """Get the global configuration instance."""
    global _config
    if _config is None:
        _config = MCPServerConfig.from_env()
    return _config


def set_config(config: MCPServerConfig) -> None:
    """Set the global configuration instance."""
    global _config
    _config = config
"""Main entry point for MCP AI Content Server."""

import asyncio
from .server import main

if __name__ == "__main__":
    asyncio.run(main())
#!/usr/bin/env python3
"""Test runner script for the MCP AI Content Server."""

import subprocess
import sys
from pathlib import Path


def run_tests():
    """Run the test suite."""
    project_root = Path(__file__).parent
    
    print("Running MCP AI Content Server tests...")
    print(f"Project root: {project_root}")
    
    # Run pytest
    cmd = [
        sys.executable, "-m", "pytest",
        str(project_root / "tests"),
        "-v",
        "--tb=short"
    ]
    
    try:
        result = subprocess.run(cmd, cwd=project_root, check=True)
        print("\n✅ All tests passed!")
        return 0
    except subprocess.CalledProcessError as e:
        print(f"\n❌ Tests failed with exit code {e.returncode}")
        return e.returncode
    except FileNotFoundError:
        print("❌ pytest not found. Please install it with: pip install pytest")
        return 1


if __name__ == "__main__":
    sys.exit(run_tests())
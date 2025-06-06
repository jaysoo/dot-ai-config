#!/bin/bash
# NX wrapper script with Node.js version check

# Check Node.js version
NODE_VERSION=$(node -v 2>/dev/null | sed 's/v//')
REQUIRED_VERSION="20.0.0"

# Version comparison function
version_lt() {
    # Returns 0 (true) if $1 < $2
    test "$(printf '%s\n' "$1" "$2" | sort -V | head -n 1)" = "$1"
}

# Check if Node.js version is sufficient
if [ -n "$NODE_VERSION" ] && version_lt "$NODE_VERSION" "$REQUIRED_VERSION"; then
    echo "⚠️  Warning: NX requires Node.js 20 or higher. You have Node.js $NODE_VERSION." >&2
    echo "" >&2
    echo "To update Node.js on Ubuntu/Debian, we recommend using NodeSource:" >&2
    echo "  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -" >&2
    echo "  sudo apt-get install -y nodejs" >&2
    echo "" >&2
    echo "Alternative methods:" >&2
    echo "  - Using nvm: https://github.com/nvm-sh/nvm" >&2
    echo "  - Using fnm: https://github.com/Schniz/fnm" >&2
    echo "  - Using snap: sudo snap install node --classic --channel=20" >&2
    echo "" >&2
fi

# Run nx with proper NODE_PATH
NODE_PATH="/usr/lib/nx/node_modules" exec node /usr/lib/nx/node_modules/nx/bin/nx.js "$@"
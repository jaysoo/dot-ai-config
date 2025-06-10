# macOS LaunchAgent Setup

This directory contains scripts to install the MCP AI Content Server as a macOS LaunchAgent that automatically starts when you log in.

## Installation

```bash
cd mcp-server/setup/macos
./install.sh
```

This will:
- Install the MCP server as a LaunchAgent
- Configure it to start automatically at login
- Start the server immediately
- Set up logging to `~/Library/Logs/mcp-ai-content-server.log`

## Uninstallation

```bash
cd mcp-server/setup/macos
./uninstall.sh
```

## Manual Management

After installation, you can manage the service manually:

```bash
# Stop the server
launchctl unload ~/Library/LaunchAgents/ca.jaysoo.mcp-ai-content-server.plist

# Start the server
launchctl load ~/Library/LaunchAgents/ca.jaysoo.mcp-ai-content-server.plist

# Check status
launchctl list | grep ca.jaysoo.mcp-ai-content-server

# View logs
tail -f ~/Library/Logs/mcp-ai-content-server.log
```

## Configuration

The LaunchAgent is configured with:
- **Transport**: SSE (Server-Sent Events)
- **Port**: 8888
- **Auto-restart**: Yes (KeepAlive=true)
- **Start at login**: Yes (RunAtLoad=true)

To modify these settings, edit the plist file and reload:
```bash
nvim ~/Library/LaunchAgents/ca.jaysoo.mcp-ai-content-server.plist
launchctl unload ~/Library/LaunchAgents/ca.jaysoo.mcp-ai-content-server.plist
launchctl load ~/Library/LaunchAgents/ca.jaysoo.mcp-ai-content-server.plist
```

## Troubleshooting

If the server fails to start:

1. Check the error log:
   ```bash
   tail -50 ~/Library/Logs/mcp-ai-content-server.error.log
   ```

2. Verify Python is in PATH:
   ```bash
   which python3
   ```

3. Check service status:
   ```bash
   launchctl list | grep ca.jaysoo.mcp-ai-content-server
   ```
   
   The output shows: `PID Status Label`
   - If PID is `-`, the service is not running
   - If Status is non-zero, it exited with an error

4. Try running the server manually:
   ```bash
   cd /path/to/mcp-server
   ./start.sh
   ```

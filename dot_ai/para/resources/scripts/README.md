# Scripts

Utility scripts for common automation tasks.

## Purpose

- Reusable scripts for repetitive tasks
- Automation helpers
- Quick reference implementations

## Current Scripts

| Script | Description |
|--------|-------------|
| `netlify-pending-deploys.sh` | List pending Netlify deployments |
| `netlify-reject-deploys.sh` | Reject pending Netlify deployments |

## Usage

Scripts are designed to be run from any directory:

```bash
# List pending deploys
~/.ai/para/resources/scripts/netlify-pending-deploys.sh

# Or if symlinked
.ai/para/resources/scripts/netlify-pending-deploys.sh
```

## Adding New Scripts

1. Add script to this folder
2. Make executable: `chmod +x script-name.sh`
3. Update this README with description

---
name: cnw-stats-local-server
description: Run a local Go HTTP server that captures Nx Cloud API traffic from create-nx-workspace (CNW) and nx init. Use when testing CNW telemetry, recordStat payloads, init analytics, or any request CNW/init would send to NX_CLOUD_API. Triggers on "test CNW stats", "test CNW analytics locally", "test nx init stats", "capture recordStat", "local nx cloud api", "log CNW requests", "test telemetry locally".
---

# CNW / nx init Local Stats Server

Tiny Go HTTP server that intercepts every request CNW (`create-nx-workspace`) or `nx init` would send to `NX_CLOUD_API`. Logs method, URL, headers, and body to stdout **and** a log file (truncated on startup). Responds `200 {}` to everything so CNW/init proceed normally.

Source: `~/projects/dot-ai-config/tools/cnw-log-server/`

## When to use

- User wants to see what `recordStat` / analytics payloads CNW or `nx init` send.
- User is testing a new flow variant, prompt copy, or telemetry `code` value and needs ground truth.
- User says "point `NX_CLOUD_API` at a local server" / "log the requests CNW makes".

## Run it

```bash
cd ~/projects/dot-ai-config/tools/cnw-log-server
go run . -port 8765 -log cnw-log-server.log
```

Flags:

- `-port` — listen port (default `8765`)
- `-log` — log file path (default `./cnw-log-server.log`, truncated on each startup)

The server prints a ready line like:
```
cnw-log-server listening on http://localhost:8765  log=./cnw-log-server.log
usage: NX_CLOUD_API=http://localhost:8765 <your-command>
```

## Point CNW / init at it

In a **separate** terminal:

```bash
# create-nx-workspace
NX_CLOUD_API=http://localhost:8765 npx create-nx-workspace@latest myworkspace --preset=react-monorepo

# nx init (inside an existing repo)
NX_CLOUD_API=http://localhost:8765 npx nx@latest init
```

Every request is logged in both the terminal running the server and the log file.

## What each request looks like

```
=== req #3  2026-04-23T09:22:13.526-04:00  POST /nx-cloud/stats  from=[::1]:56536  ct=application/json  len=120 ===
  Accept: */*
  Content-Type: application/json
  User-Agent: axios/1.6.0
  body (json):
  {
    "command": "create-nx-workspace",
    "code": "setup-nx-cloud-v2-a",
    ...
  }
```

## Common flags for CNW/init testing

Combine with the server to exercise specific paths:

- `NX_CNW_FLOW_VARIANT=0|1|2` — force a flow/prompt variant (see GEMINI.md › CNW A/B Testing).
- `NX_CLOUD_API=http://localhost:8765` — route all stat/telemetry calls to the log server.
- `CI=true` — simulate CI environment, skips interactive prompts.

Example — confirm the `code` value a variant sends:

```bash
# terminal 1
cd ~/projects/dot-ai-config/tools/cnw-log-server && go run . -port 8765

# terminal 2
NX_CNW_FLOW_VARIANT=1 NX_CLOUD_API=http://localhost:8765 \
  npx create-nx-workspace@latest /tmp/scratch --preset=react-monorepo --nxCloud=skip
```

Then `grep '"code"' ~/projects/dot-ai-config/tools/cnw-log-server/cnw-log-server.log` to confirm the variant fired the expected payload.

## Notes

- The server is stdlib-only; no `go.sum` or deps to install.
- Responds `200` with `{}` to **every** path/method — CNW and init don't care about response shape beyond the status code.
- Log file is truncated on each startup. If you need to keep a prior run, copy it before restarting.
- Port `8765` is the default; change it if something else is bound (`lsof -i :8765`).

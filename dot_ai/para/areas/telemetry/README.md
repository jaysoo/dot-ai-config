# Telemetry

Ongoing area for tracking, improving, and correlating telemetry across the Nx product surface.

## Scope

Covers telemetry from:

- **Nx Cloud (web)** — authenticated app sessions, workspace events
- **Docs (nx.dev)** — Google Analytics, page views, AI referrer traffic
- **Nx CLI** — `commandStats` MongoDB, CNW funnel, nx commands
- **Other platforms** — Nx Console (IDE), MCP server, Cloud agents

## Open Questions / Notes

- **Cross-surface session correlation**: investigate how to correlate a single user's journey across web (Cloud) → docs (GA) → CLI → other platforms. Today each surface has its own identity model (Cloud user ID, GA client ID, CLI machine ID, Console install ID) and there is no unified correlation key. Need to explore what's feasible given privacy constraints and what would unlock (e.g. measuring docs→CLI→Cloud conversion, AI-referrer impact on activation).

## Related Resources

- `/cnw-stats-analyzer` skill — CLI/CNW telemetry queries
- `areas/cnw-stats/` — CNW funnel tracking
- `areas/metrics-review/` (if exists) — director-level metrics

# I/O Tracing Implementation - Follow Up Items

## Questions / Decisions Needed

1. **How will the CLI actually send I/O tracing data?**
   - The PoC in Phase 2 uses strace/bpftrace to capture file I/O
   - Need to confirm: Will CLI send raw trace data, or pre-analyzed results?
   - Current assumption: CLI sends pre-analyzed `AggregatedIoAnalysis` (like CPU/memory)

2. **Environment gating?**
   - Should there be an env var like `NX_CLOUD_IO_TRACING_ENABLED`?
   - Or rely on CLI sending/not sending the data?

3. **Storage limits?**
   - Plan says "top 10 issues" - is this sufficient?
   - Should we store full per-task analysis as artifact (like metrics)?

## TODOs

- [x] Verify local dev setup works with `npx nps nxCloud.serve.withApi`
  - **IMPORTANT**: Must set `OP_ACCOUNT=tuskteam.1password.com` to use correct 1Password vault
  - Command: `OP_ACCOUNT=tuskteam.1password.com npx nps nxCloud.serve.withApi`
  - Frontend runs on port **4202**
  - Kotlin API runs on port **4203**
- [ ] Test Kotlin API changes compile and run
- [ ] Add unit tests for IoTracingAggregator
- [ ] Verify UI alert styling matches existing alerts

## Local Development Setup

```bash
# Run frontend + API together (requires 1Password CLI access to Engineering vault)
OP_ACCOUNT=tuskteam.1password.com npx nps nxCloud.serve.withApi

# Services:
# - Frontend (Remix): http://localhost:4202
# - Kotlin API: http://localhost:4203
# - MongoDB: localhost:27017
```

## Implementation Notes

- Following pattern from Louie's CPU/memory tracking (PR reference needed)
- Key files: `process-metrics-aggregator.ts`, `agent-instance-metadata.model.ts`

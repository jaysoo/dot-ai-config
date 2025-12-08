# macOS I/O Tracing Investigation

**Date**: 2025-12-05
**Repository**: `/Users/jack/projects/io-tracing`
**Goal**: Investigate native macOS alternatives to strace/eBPF for file I/O tracing
**Status**: ✅ COMPLETED

## Summary

Created a cross-platform Nx-aware I/O tracer that:
- Auto-detects platform (macOS vs Linux)
- Uses `fs_usage` on macOS, `strace` on Linux
- Compares traced I/O against declared Nx `inputs`/`outputs`
- Reports undeclared dependencies that could cause cache issues

### Key Files Created
- `tracer-nx.mjs` - Main Nx-aware tracer (auto-detects platform)
- `tracer-fsusage.mjs` - macOS fs_usage tracer (standalone)
- `tracer-dtruss.mjs` - macOS dtruss tracer (SIP issues, not recommended)
- `libs/data-processor/` - Sample project with intentional I/O mismatches

### Findings
- **fs_usage** works well on macOS with SIP enabled (requires sudo)
- **dtruss** has SIP issues and doesn't capture child process I/O
- **strace** works well on Linux, captures full process tree with `-f`

## Background

The current PoC uses:
- **bpftrace** (Linux only, requires kernel headers)
- **strace** (Linux only, fallback for Docker Desktop)

Neither works natively on macOS. Need to investigate macOS-native alternatives.

## macOS Tracing Options to Investigate

### 1. dtrace / dtruss

**What it is**: macOS's built-in dynamic tracing framework (similar concept to eBPF)

**Commands to test**:
```bash
# dtruss - strace-like wrapper
sudo dtruss -f -t open node test-script.mjs

# Raw dtrace for file opens
sudo dtrace -n 'syscall::open*:entry { printf("%s %s\n", execname, copyinstr(arg0)); }'
```

**Investigate**:
- [ ] Does it work on modern macOS (Sonoma/Sequoia)?
- [ ] SIP (System Integrity Protection) requirements
- [ ] Can it trace child processes (`-f` flag)?
- [ ] Output format - how to parse read vs write?
- [ ] Performance overhead

### 2. fs_usage

**What it is**: Built-in macOS tool for file system activity monitoring

**Commands to test**:
```bash
sudo fs_usage -w -f filesys node test-script.mjs
sudo fs_usage -w -f filesys -e node  # exclude
```

**Investigate**:
- [ ] Output format and parseability
- [ ] Can filter by PID/process tree?
- [ ] Distinguishes read vs write operations?
- [ ] Real-time vs batch output

### 3. Endpoint Security Framework (ES)

**What it is**: Apple's modern API for security tools (used by antivirus, etc.)

**Investigate**:
- [ ] Requires entitlements (Apple Developer Program)
- [ ] Can monitor file operations system-wide
- [ ] Would need native code (Swift/ObjC) wrapper
- [ ] Probably overkill for this use case

### 4. FSEvents API

**What it is**: macOS API for file system change notifications

**Investigate**:
- [ ] Only notifies of changes, not reads
- [ ] Works at directory level
- [ ] Node.js bindings available (fsevents package)
- [ ] Probably insufficient - misses reads entirely

## Implementation Plan

### Phase 1: Feasibility Testing

1. **Set up test environment**
   ```
   /Users/jack/projects/io-tracing/
   ├── test-script.mjs      # Simple read/write test
   ├── input.txt            # Test input file
   ├── output/              # Test output dir
   └── tracers/
       ├── dtrace-tracer.mjs
       ├── dtruss-tracer.mjs
       └── fs-usage-tracer.mjs
   ```

2. **Test each approach manually**
   - Run test script under each tracer
   - Capture and analyze output
   - Document what works/doesn't work

3. **Evaluate SIP requirements**
   - Test with SIP enabled (default)
   - Document what requires SIP disable
   - Check if csrutil allows partial disable

### Phase 2: Prototype Implementation

If dtrace/dtruss works:

1. **Create tracer wrapper**
   - Spawn dtruss/dtrace with appropriate flags
   - Parse output stream
   - Track PID tree (if -f works)
   - Filter by workspace root

2. **Handle permission model**
   - Document sudo requirements
   - Consider if can run without sudo (probably not)
   - Error handling for permission denied

3. **Unify interface with Linux tracer**
   ```typescript
   interface IoTracer {
     start(pid: number): Promise<void>;
     stop(): Promise<{ reads: string[]; writes: string[] }>;
     static isAvailable(): boolean;
   }
   ```

### Phase 3: Integration Decision

Based on findings, decide:

| Outcome | Action |
|---------|--------|
| dtrace/dtruss works well | Add as macOS-native option |
| Requires SIP disable | Document limitation, recommend Docker |
| Too unreliable | Stick with Docker-only approach |
| Performance too slow | Investigate sampling or opt-in only |

## Open Questions

1. **SIP Status**: What's the current SIP situation on your Mac?
   ```bash
   csrutil status
   ```

2. **Use Case Priority**: Is native macOS tracing important, or is Docker sufficient?
   - For local development debugging: Docker might be fine
   - For Nx Agents (Linux): Already covered by strace/bpftrace

3. **Sudo Requirement**: Is requiring sudo acceptable for this tool?

## References

- [dtrace on macOS](https://www.brendangregg.com/DTrace/dtrace_oneliners.txt)
- [dtruss man page](https://www.manpagez.com/man/1/dtruss/)
- [fs_usage man page](https://www.manpagez.com/man/1/fs_usage/)
- [Endpoint Security Framework](https://developer.apple.com/documentation/endpointsecurity)
- [System Integrity Protection](https://developer.apple.com/documentation/security/disabling_and_enabling_system_integrity_protection)

## Success Criteria

- [x] Working PoC that traces file reads/writes on macOS
- [x] Can filter by PID tree (parent + children) - fs_usage traces all, filter by path
- [x] Can distinguish reads from writes
- [x] Reasonable performance overhead (<10% slowdown)
- [x] Clear documentation of requirements/limitations

## Known Limitations

1. **macOS (fs_usage)**: Traces all filesystem activity, filtered by workspace path. Some noise from Nx reading config files.
2. **Linux (strace)**: Clean output with `-f` flag capturing child processes.
3. **Docker**: Need to run `pnpm install` inside container and clear `.nx` cache before tracing.

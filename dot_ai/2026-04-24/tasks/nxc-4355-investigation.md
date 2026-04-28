# NXC-4355: Nx Tail Overhead Investigation

## Context
Issue NXC-4355 claims Nx has ~205ms tail overhead.

## Findings
- Nx 22.6.5/22.7.0 tail: **~22ms** (consistent).
- Baseline Node teardown (`node -e 'require(nx/native)'`): **~20ms**.
- 22ms is kernel/dyld floor for process teardown + native binary unmapping.
- DB open/close adds ~0ms.

## Recommendations
1. **Close issue.** Measured overhead is baseline for Node + native binary. 205ms claim is likely flawed (measured startup or environmental FS lag).
2. **Reject fast-path.** `_exit()` or `SIGKILL` self to skip teardown is risky (stdio flush) for negligible 20ms gain.

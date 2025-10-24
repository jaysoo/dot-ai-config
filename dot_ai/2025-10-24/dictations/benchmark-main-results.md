# Benchmark Results - Main Branch

Ran the hyperfine command manually on the main branch. The results are:

## Command
```bash
npx nx run-many -t typecheck --skip-nx-cache
```

## Results
- **Time (mean ± σ)**: 143.833 s ± 1.099 s
  - User: 361.692 s
  - System: 37.150 s
- **Range (min … max)**: 142.076 s … 145.646 s
- **Number of runs**: 10

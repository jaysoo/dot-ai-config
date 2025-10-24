# TypeScript Project References Benchmark Comparison

## Summary

Benchmarking the `npx nx run-many -t typecheck --skip-nx-cache` command across two branches to identify performance differences.

## Results

### main Branch
- **Time (mean ± σ)**: 143.833 s ± 1.099 s
  - User: 361.692 s
  - System: 37.150 s
- **Range (min … max)**: 142.076 s … 145.646 s
- **Number of runs**: 10

### tsconfig-fix Branch
- **Time (mean ± σ)**: 84.537 s ± 0.310 s
  - User: 228.384 s
  - System: 25.963 s
- **Range (min … max)**: 84.100 s … 84.938 s
- **Number of runs**: 10

## Analysis

### Performance Difference

**The tsconfig-fix branch is significantly faster:**

- **main**: 143.833 s (2 min 24 sec)
- **tsconfig-fix**: 84.537 s (1 min 25 sec)
- **Time saved**: 59.296 s (~59 seconds faster)
- **Speedup**: ~1.7x faster (41% reduction in execution time)

### Key Observations

1. **Significant Performance Improvement**: The tsconfig-fix branch shows a substantial reduction in typecheck execution time, nearly cutting the time in half.

2. **Consistency**: The tsconfig-fix branch also shows better consistency:
   - **main**: σ = 1.099s (standard deviation)
   - **tsconfig-fix**: σ = 0.310s (much more consistent runs)

3. **Resource Usage**: The tsconfig-fix branch uses fewer resources:
   - **User time**: 361.7s (main) vs 228.4s (tsconfig-fix) - 37% reduction
   - **System time**: 37.2s (main) vs 26.0s (tsconfig-fix) - 30% reduction

4. **Range Tightness**: The tsconfig-fix branch has a tighter range (0.838s spread vs 3.57s spread on main), indicating more predictable performance.

## Conclusion

**The tsconfig-fix branch delivers a measurable and significant performance improvement for typechecking.**

The benchmark demonstrates:
- ~41% faster execution time
- More consistent performance (lower variance)
- Reduced CPU usage (both user and system time)
- More predictable run times (tighter min/max range)

This suggests that the TypeScript configuration changes in the tsconfig-fix branch have successfully optimized the typecheck process, likely through better project reference configuration or more efficient dependency resolution.

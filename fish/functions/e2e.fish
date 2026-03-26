function e2e
  # e.g. e2e e2e/nx/src/run.test.ts
  set parts (string split -- "/" $argv)
  set proj "$parts[1]-$parts[2]"
  set target (string join "/" $parts[3..-1])
  npx nx run $proj:e2e-ci--$target
end

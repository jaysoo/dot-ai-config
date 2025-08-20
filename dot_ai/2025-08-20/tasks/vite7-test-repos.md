# Vite 7 Test Repositories and Scripts

## Overview
This document contains all test repository configurations and scripts for verifying the Vite 7 upgrade (PR #32422).

## Test Repository Scripts

### 1. React + Vite 7 Test Repository
```bash
#!/bin/bash
# test-react-vite7.sh
# Location: /tmp/vite7-tests/react-vite7

mkdir -p /tmp/vite7-tests
cd /tmp/vite7-tests

# Create React + Vite 7 workspace
npx create-nx-workspace@latest react-vite7 \
  --preset=react-monorepo \
  --bundler=vite \
  --style=css \
  --e2eTestRunner=playwright \
  --pm=pnpm \
  --ci \
  --nxCloud=skip

cd react-vite7

# Verify Vite version
echo "Installed Vite version:"
pnpm list vite --depth=0

# Test commands
pnpm nx serve react-vite7
pnpm nx build react-vite7
pnpm nx test react-vite7
pnpm nx lint react-vite7

# Create a component with Sass to test modern API
cat > apps/react-vite7/src/app/test-component.module.scss << 'EOF'
$primary-color: #007bff;
$secondary-color: #6c757d;

.container {
  display: flex;
  flex-direction: column;
  padding: 2rem;
  
  .header {
    color: $primary-color;
    font-size: 2rem;
    margin-bottom: 1rem;
    
    &:hover {
      color: darken($primary-color, 10%);
    }
  }
  
  .content {
    color: $secondary-color;
    line-height: 1.6;
  }
}

@mixin button-style($bg-color) {
  background-color: $bg-color;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  
  &:hover {
    background-color: darken($bg-color, 10%);
  }
}

.primary-button {
  @include button-style($primary-color);
}

.secondary-button {
  @include button-style($secondary-color);
}
EOF

# Test production build
pnpm nx build react-vite7 --prod
```

### 2. Vue + Vite 7 Test Repository
```bash
#!/bin/bash
# test-vue-vite7.sh
# Location: /tmp/vite7-tests/vue-vite7

mkdir -p /tmp/vite7-tests
cd /tmp/vite7-tests

# Create Vue + Vite 7 workspace
npx create-nx-workspace@latest vue-vite7 \
  --preset=vue-monorepo \
  --e2eTestRunner=playwright \
  --pm=pnpm \
  --ci \
  --nxCloud=skip

cd vue-vite7

# Verify versions
echo "Installed versions:"
pnpm list vite vitest vue --depth=0

# Test commands
pnpm nx serve vue-vite7
pnpm nx build vue-vite7
pnpm nx test vue-vite7
pnpm nx lint vue-vite7

# Create a Vue component with composition API
cat > apps/vue-vite7/src/components/TestComponent.vue << 'EOF'
<template>
  <div class="test-component">
    <h2>{{ title }}</h2>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
    <button @click="decrement">Decrement</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const count = ref(0);
const title = computed(() => `Vite 7 Test Component (${count.value})`);

const increment = () => count.value++;
const decrement = () => count.value--;
</script>

<style scoped lang="scss">
.test-component {
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  
  h2 {
    color: #42b883;
    margin-bottom: 1rem;
  }
  
  button {
    margin: 0 0.5rem;
    padding: 0.5rem 1rem;
    background: #42b883;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      background: darken(#42b883, 10%);
    }
  }
}
</style>
EOF

# Test with HMR
pnpm nx serve vue-vite7 --open
```

### 3. Angular + Vite 7 Test Repository
```bash
#!/bin/bash
# test-angular-vite7.sh
# Location: /tmp/vite7-tests/angular-vite7

mkdir -p /tmp/vite7-tests
cd /tmp/vite7-tests

# Create Angular workspace and add Vite
npx create-nx-workspace@latest angular-vite7 \
  --preset=angular-monorepo \
  --bundler=webpack \
  --style=scss \
  --e2eTestRunner=playwright \
  --pm=pnpm \
  --ci \
  --nxCloud=skip

cd angular-vite7

# Add Vite support to Angular project
pnpm nx g @nx/vite:configuration angular-vite7 \
  --uiFramework=none \
  --includeLib=false

# Verify Vite was added
echo "Vite configuration added. Version:"
pnpm list vite --depth=0

# Run tests
pnpm nx test angular-vite7
```

### 4. Web Components + Vite 7 Test Repository
```bash
#!/bin/bash
# test-web-vite7.sh
# Location: /tmp/vite7-tests/web-vite7

mkdir -p /tmp/vite7-tests
cd /tmp/vite7-tests

# Create Web Components workspace
npx create-nx-workspace@latest web-vite7 \
  --preset=web-components \
  --bundler=vite \
  --pm=pnpm \
  --ci \
  --nxCloud=skip

cd web-vite7

# Verify Vite version
pnpm list vite --depth=0

# Create a web component
cat > apps/web-vite7/src/app/my-element.ts << 'EOF'
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-element')
export class MyElement extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 16px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    
    h2 {
      color: var(--primary-color, #007bff);
    }
    
    button {
      padding: 8px 16px;
      margin: 4px;
      border: none;
      border-radius: 4px;
      background: var(--primary-color, #007bff);
      color: white;
      cursor: pointer;
    }
    
    button:hover {
      opacity: 0.9;
    }
  `;
  
  @property({ type: Number })
  count = 0;
  
  render() {
    return html`
      <h2>Vite 7 Web Component</h2>
      <p>Count: ${this.count}</p>
      <button @click=${this._increment}>+</button>
      <button @click=${this._decrement}>-</button>
    `;
  }
  
  private _increment() {
    this.count++;
  }
  
  private _decrement() {
    this.count--;
  }
}
EOF

# Test build and serve
pnpm nx build web-vite7
pnpm nx serve web-vite7
```

### 5. Backwards Compatibility Test Repository
```bash
#!/bin/bash
# test-backwards-compat.sh
# Location: /tmp/vite7-tests/backwards-compat

mkdir -p /tmp/vite7-tests/backwards-compat
cd /tmp/vite7-tests/backwards-compat

# Test 1: Vite 6 Compatibility
echo "Testing Vite 6 compatibility..."
npx create-nx-workspace@latest test-vite6 --pm=pnpm --ci --nxCloud=skip
cd test-vite6
pnpm nx g @nx/vite:init --useViteV6
pnpm nx g @nx/react:app app-v6 --bundler=vite
echo "Vite 6 version:"
pnpm list vite --depth=0
pnpm nx build app-v6
cd ..

# Test 2: Vite 5 Compatibility
echo "Testing Vite 5 compatibility..."
npx create-nx-workspace@latest test-vite5 --pm=pnpm --ci --nxCloud=skip
cd test-vite5
pnpm nx g @nx/vite:init --useViteV5
pnpm nx g @nx/react:app app-v5 --bundler=vite
echo "Vite 5 version:"
pnpm list vite --depth=0
pnpm nx build app-v5
cd ..

# Test 3: Default (Vite 7)
echo "Testing default Vite 7..."
npx create-nx-workspace@latest test-vite7 --pm=pnpm --ci --nxCloud=skip
cd test-vite7
pnpm nx g @nx/vite:init
pnpm nx g @nx/react:app app-v7 --bundler=vite
echo "Vite 7 version:"
pnpm list vite --depth=0
pnpm nx build app-v7
```

### 6. Migration Test Repository
```bash
#!/bin/bash
# test-migration.sh
# Location: /tmp/vite7-tests/migration

mkdir -p /tmp/vite7-tests/migration
cd /tmp/vite7-tests/migration

# Create workspace with Nx 21.4.0 (Vite 6)
echo "Creating workspace with Nx 21.4.0 (Vite 6)..."
npx create-nx-workspace@21.4.0 migration-test \
  --preset=react-monorepo \
  --bundler=vite \
  --style=scss \
  --e2eTestRunner=none \
  --pm=pnpm \
  --ci \
  --nxCloud=skip

cd migration-test

# Save initial state
echo "Initial Vite version (should be 6.x):"
pnpm list vite --depth=0 > ../initial-vite-version.txt
cat ../initial-vite-version.txt

# Build with Vite 6
pnpm nx build migration-test
cp -r dist/apps/migration-test ../build-vite6

# Perform migration
echo "Migrating to latest Nx (Vite 7)..."
pnpm nx migrate latest
pnpm install
pnpm nx migrate --run-migrations

# Verify migration
echo "Post-migration Vite version (should be 7.x):"
pnpm list vite --depth=0 > ../migrated-vite-version.txt
cat ../migrated-vite-version.txt

# Build with Vite 7
pnpm nx build migration-test
cp -r dist/apps/migration-test ../build-vite7

# Compare builds
echo "Comparing build outputs..."
diff -r ../build-vite6 ../build-vite7 > ../build-diff.txt || true
echo "Build differences saved to build-diff.txt"

# Test that app still works
pnpm nx serve migration-test --port 4200
```

### 7. Sass Modern API Test Repository
```bash
#!/bin/bash
# test-sass-modern.sh
# Location: /tmp/vite7-tests/sass-test

mkdir -p /tmp/vite7-tests
cd /tmp/vite7-tests

# Create workspace with Sass
npx create-nx-workspace@latest sass-test \
  --preset=react-monorepo \
  --bundler=vite \
  --style=scss \
  --pm=pnpm \
  --ci \
  --nxCloud=skip

cd sass-test

# Create complex Sass file to test modern API
cat > apps/sass-test/src/styles/test.scss << 'EOF'
// Test modern Sass features
@use "sass:color";
@use "sass:math";
@use "sass:list";
@use "sass:map";

// Variables
$colors: (
  primary: #007bff,
  secondary: #6c757d,
  success: #28a745,
  danger: #dc3545,
  warning: #ffc107,
  info: #17a2b8
);

// Functions
@function get-color($color-name) {
  @return map.get($colors, $color-name);
}

@function calculate-rem($pixels) {
  @return math.div($pixels, 16) * 1rem;
}

// Mixins with modern syntax
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}

@mixin responsive($breakpoint) {
  @if $breakpoint == "mobile" {
    @media (max-width: 768px) {
      @content;
    }
  } @else if $breakpoint == "tablet" {
    @media (min-width: 769px) and (max-width: 1024px) {
      @content;
    }
  } @else if $breakpoint == "desktop" {
    @media (min-width: 1025px) {
      @content;
    }
  }
}

// Component styles using modern features
.modern-component {
  @include flex-center;
  padding: calculate-rem(32);
  background: get-color(primary);
  
  @include responsive(mobile) {
    padding: calculate-rem(16);
  }
  
  @include responsive(tablet) {
    padding: calculate-rem(24);
  }
  
  .nested {
    color: color.adjust(get-color(primary), $lightness: 20%);
    
    &:hover {
      color: color.scale(get-color(primary), $lightness: -20%);
    }
  }
  
  // Modern @for syntax
  @for $i from 1 through 5 {
    .item-#{$i} {
      margin-left: calculate-rem($i * 8);
    }
  }
  
  // Modern @each syntax
  @each $name, $color in $colors {
    .text-#{$name} {
      color: $color;
    }
    
    .bg-#{$name} {
      background-color: $color;
    }
  }
}

// CSS Grid with Sass
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(calculate-rem(250), 1fr));
  gap: calculate-rem(16);
  
  @include responsive(mobile) {
    grid-template-columns: 1fr;
  }
}
EOF

# Build and verify Sass compilation works
pnpm nx build sass-test
echo "Sass compilation with modern API successful!"
```

### 8. Performance Comparison Test
```bash
#!/bin/bash
# test-performance.sh
# Location: /tmp/vite7-tests/performance

mkdir -p /tmp/vite7-tests/performance
cd /tmp/vite7-tests/performance

# Function to measure build time
measure_build() {
  local version=$1
  local flag=$2
  
  echo "Testing Vite $version build performance..."
  
  npx create-nx-workspace@latest perf-test-v$version \
    --preset=react-monorepo \
    --bundler=vite \
    --pm=pnpm \
    --ci \
    --nxCloud=skip
  
  cd perf-test-v$version
  
  if [ -n "$flag" ]; then
    pnpm nx g @nx/vite:init $flag
  fi
  
  # Measure build time
  echo "Starting build for Vite $version..."
  start=$(date +%s)
  pnpm nx build perf-test-v$version
  end=$(date +%s)
  
  build_time=$((end - start))
  echo "Vite $version build time: ${build_time}s"
  
  # Measure dev server startup
  echo "Starting dev server for Vite $version..."
  start=$(date +%s)
  timeout 5 pnpm nx serve perf-test-v$version > /dev/null 2>&1 || true
  end=$(date +%s)
  
  startup_time=$((end - start))
  echo "Vite $version dev server startup: ${startup_time}s"
  
  cd ..
  
  echo "$version,$build_time,$startup_time" >> performance-results.csv
}

# Create CSV header
echo "Version,Build Time (s),Dev Server Startup (s)" > performance-results.csv

# Test each version
measure_build "7" ""
measure_build "6" "--useViteV6"
measure_build "5" "--useViteV5"

# Display results
echo ""
echo "Performance Comparison Results:"
cat performance-results.csv
```

## Test Execution Commands

### Run All Tests
```bash
#!/bin/bash
# run-all-vite7-tests.sh

# Set base directory
TEST_DIR="/tmp/vite7-tests"
mkdir -p "$TEST_DIR"

# Array of test scripts
tests=(
  "test-react-vite7.sh"
  "test-vue-vite7.sh"
  "test-angular-vite7.sh"
  "test-web-vite7.sh"
  "test-backwards-compat.sh"
  "test-migration.sh"
  "test-sass-modern.sh"
  "test-performance.sh"
)

# Run each test
for test in "${tests[@]}"; do
  echo "================================"
  echo "Running: $test"
  echo "================================"
  
  # Execute test script
  bash "$TEST_DIR/$test"
  
  if [ $? -eq 0 ]; then
    echo "✅ $test completed successfully"
  else
    echo "❌ $test failed"
  fi
  
  echo ""
done

echo "All tests completed!"
```

### Clean Up Test Repositories
```bash
#!/bin/bash
# cleanup-tests.sh

echo "Cleaning up test repositories..."
rm -rf /tmp/vite7-tests
echo "Cleanup complete!"
```

## Expected Results

### Version Checks
- React + Vite 7: `vite@7.x.x`
- Vue + Vite 7: `vite@7.x.x`, `vitest@3.x.x`
- Backwards Compat V6: `vite@6.x.x`
- Backwards Compat V5: `vite@5.x.x`
- Migration: From `vite@6.x.x` to `vite@7.x.x`

### Build Results
All builds should complete successfully with:
- No errors
- Valid output in `dist/` directory
- Proper source maps
- Optimized bundle sizes

### Dev Server
- HMR should work
- Fast refresh for React
- Vue hot reload
- No console errors

### Sass Compilation
- Modern API features work
- No deprecation warnings
- Proper CSS output

## Test Repository Locations

All test repositories will be created in `/tmp/vite7-tests/`:
- `/tmp/vite7-tests/react-vite7/`
- `/tmp/vite7-tests/vue-vite7/`
- `/tmp/vite7-tests/angular-vite7/`
- `/tmp/vite7-tests/web-vite7/`
- `/tmp/vite7-tests/backwards-compat/`
- `/tmp/vite7-tests/migration/`
- `/tmp/vite7-tests/sass-test/`
- `/tmp/vite7-tests/performance/`

## Notes
- All scripts assume the PR is merged and packages are published
- Replace `@latest` with specific version when testing pre-release
- Local registry testing can be done by replacing npm registry URL
- Performance results may vary based on system specs
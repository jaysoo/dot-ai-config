#!/bin/bash
# Nx MCP Demo Setup Script
# Creates a fully configured demo workspace

set -e

DEMO_DIR="${1:-/tmp/nx-mcp-demo}"
WORKSPACE_NAME="nx-store-demo"

echo "========================================"
echo "Nx MCP Demo Setup"
echo "========================================"
echo "Creating demo workspace at: $DEMO_DIR/$WORKSPACE_NAME"
echo ""

# Clean up existing demo
if [ -d "$DEMO_DIR/$WORKSPACE_NAME" ]; then
  echo "Removing existing demo workspace..."
  rm -rf "$DEMO_DIR/$WORKSPACE_NAME"
fi

mkdir -p "$DEMO_DIR"
cd "$DEMO_DIR"

# Create workspace
echo ""
echo "Step 1/6: Creating Nx workspace..."
npx -y create-nx-workspace@latest "$WORKSPACE_NAME" \
  --preset=react-monorepo \
  --appName=shop \
  --bundler=vite \
  --e2eTestRunner=none \
  --style=css \
  --no-interactive \
  --nxCloud=skip

cd "$WORKSPACE_NAME"

# Add shared libraries
echo ""
echo "Step 2/6: Creating shared libraries..."
npx nx g @nx/react:library ui-order-detail \
  --directory=libs/shared/ui-order-detail \
  --tags="scope:shared,type:ui" \
  --no-interactive

npx nx g @nx/react:library data-access-order \
  --directory=libs/shared/data-access-order \
  --tags="scope:shared,type:data-access" \
  --no-interactive

npx nx g @nx/react:library ui-button \
  --directory=libs/shared/ui-button \
  --tags="scope:shared,type:ui" \
  --no-interactive

# Add feature libraries
echo ""
echo "Step 3/6: Creating feature libraries..."
npx nx g @nx/react:library feat-current-orders \
  --directory=libs/orders/feat-current-orders \
  --tags="scope:orders,type:feature" \
  --no-interactive

npx nx g @nx/react:library feat-product-list \
  --directory=libs/products/feat-product-list \
  --tags="scope:products,type:feature" \
  --no-interactive

# Wire up dependencies to establish patterns
echo ""
echo "Step 4/6: Wiring up dependencies..."

# feat-current-orders depends on shared libs
cat > libs/orders/feat-current-orders/src/lib/feat-current-orders.tsx << 'EOF'
import styles from './feat-current-orders.module.css';

// Dependencies this feature uses - AI will learn from this pattern
// import { OrderDetail } from '@nx-store-demo/ui-order-detail';
// import { fetchOrders } from '@nx-store-demo/data-access-order';

export function FeatCurrentOrders() {
  return (
    <div className={styles['container']}>
      <h2>Current Orders</h2>
      <p>View and manage your current orders</p>
    </div>
  );
}

export default FeatCurrentOrders;
EOF

# feat-product-list uses shared button
cat > libs/products/feat-product-list/src/lib/feat-product-list.tsx << 'EOF'
import styles from './feat-product-list.module.css';
// import { UiButton } from '@nx-store-demo/ui-button';

export function FeatProductList() {
  return (
    <div className={styles['container']}>
      <h2>Products</h2>
      <p>Browse our product catalog</p>
    </div>
  );
}

export default FeatProductList;
EOF

# Wire shop app to use features
cat > apps/shop/src/app/app.tsx << 'EOF'
import styles from './app.module.css';
import { FeatCurrentOrders } from '@nx-store-demo/feat-current-orders';
import { FeatProductList } from '@nx-store-demo/feat-product-list';

export function App() {
  return (
    <div className={styles['container']}>
      <header>
        <h1>Welcome to the Shop!</h1>
      </header>
      <main>
        <section>
          <FeatProductList />
        </section>
        <section>
          <FeatCurrentOrders />
        </section>
      </main>
    </div>
  );
}

export default App;
EOF

# Add a blog post for the CI failure demo scenario
echo ""
echo "Step 5/6: Adding demo content..."
mkdir -p docs/blog
cat > docs/blog/2024-announcement.md << 'EOF'
# Big Announcement: New Features Coming!

We're excited to announce new features for our e-commerce platform.

## What's New

- Cancel Orders feature
- Improved checkout flow
- Better order tracking

## Try Our Tools

Check out our extension in the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=nrwl.angular-console)!

## Coming Soon

Stay tuned for more updates!
EOF

# Create a simple module boundary rule in nx.json
echo ""
echo "Step 6/6: Configuring workspace rules..."
cat > nx.json << 'EOF'
{
  "$schema": "./node_modules/nx/schemas/nx-schema.json",
  "namedInputs": {
    "default": ["{projectRoot}/**/*", "sharedGlobals"],
    "production": [
      "default",
      "!{projectRoot}/.eslintrc.json",
      "!{projectRoot}/eslint.config.js",
      "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
      "!{projectRoot}/tsconfig.spec.json",
      "!{projectRoot}/jest.config.[jt]s",
      "!{projectRoot}/src/test-setup.[jt]s",
      "!{projectRoot}/test-setup.[jt]s"
    ],
    "sharedGlobals": []
  },
  "plugins": [
    {
      "plugin": "@nx/vite/plugin",
      "options": {
        "buildTargetName": "build",
        "testTargetName": "test",
        "serveTargetName": "serve",
        "previewTargetName": "preview",
        "serveStaticTargetName": "serve-static",
        "typecheckTargetName": "typecheck"
      }
    },
    {
      "plugin": "@nx/eslint/plugin",
      "options": {
        "targetName": "lint"
      }
    }
  ],
  "targetDefaults": {
    "build": {
      "cache": true,
      "dependsOn": ["^build"]
    },
    "lint": {
      "cache": true
    },
    "test": {
      "cache": true
    }
  },
  "generators": {
    "@nx/react": {
      "library": {
        "unitTestRunner": "vitest"
      }
    }
  }
}
EOF

echo ""
echo "========================================"
echo "Setup Complete!"
echo "========================================"
echo ""
echo "Workspace created at: $DEMO_DIR/$WORKSPACE_NAME"
echo ""
echo "Project Structure:"
echo "  apps/"
echo "    shop/              - Main e-commerce app"
echo "  libs/"
echo "    shared/"
echo "      ui-order-detail/ - Shared UI component (scope:shared, type:ui)"
echo "      ui-button/       - Shared button (scope:shared, type:ui)"
echo "      data-access-order/ - Order API client (scope:shared, type:data-access)"
echo "    orders/"
echo "      feat-current-orders/ - Current orders feature (scope:orders, type:feature)"
echo "    products/"
echo "      feat-product-list/   - Product listing (scope:products, type:feature)"
echo ""
echo "Next Steps:"
echo ""
echo "For Cursor:"
echo "  1. Open workspace: cursor $DEMO_DIR/$WORKSPACE_NAME"
echo "  2. Install Nx Console extension"
echo "  3. Accept 'Improve Copilot/AI agent' prompt (or Cmd+Shift+P > 'Nx: Configure MCP Server')"
echo ""
echo "For Claude Code:"
echo "  1. cd $DEMO_DIR/$WORKSPACE_NAME"
echo "  2. claude mcp add nx-mcp -- npx nx-mcp@latest"
echo "  3. Start Claude: claude"
echo ""

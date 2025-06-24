# CRITICAL - TypeScript Configuration Generator

Type: Configuration
Purpose: TypeScript project setup

## Required Files

### tsconfig.base.json (root level)
```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "rootDir": ".",
    "sourceMap": true,
    "declaration": false,
    "moduleResolution": "node",
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "importHelpers": true,
    "target": "es2015",
    "module": "esnext",
    "lib": ["es2020", "dom"],
    "skipLibCheck": true,
    "skipDefaultLibCheck": true,
    "baseUrl": ".",
    "paths": {}
  },
  "exclude": ["node_modules", "tmp"]
}
```

## Required Behavior

1. Must support path mappings for workspace libraries
2. Enable strict type checking if --strict flag is set
3. Configure for Node.js target if --node flag is set
4. Support JSX if React/Preact detected in workspace

## Additional Features

Based on workspace analysis:
- Add appropriate lib references (dom, webworker, node)
- Configure module resolution strategy
- Set up path aliases for existing libraries
- Enable source maps for debugging
- Configure decorator support if needed
- Add incremental compilation settings
- Set appropriate ECMAScript target based on browserslist

## Workspace Integration

- Update nx.json with TypeScript plugin settings if needed
- Configure VSCode settings for TypeScript
- Add recommended extensions to .vscode/extensions.json

## Validation

Ensure:
1. TypeScript compiles without errors
2. Path mappings work correctly
3. IDE integration functions properly
# CRITICAL - React Application Generator

Framework: React
Version: ^18.2.0
Bundler: Vite
Type: Application

## Required Structure

```
$DIRECTORY/
├── src/
│   ├── main.tsx         # Entry point with React 18 createRoot
│   ├── app/
│   │   ├── app.tsx      # Main App component
│   │   ├── app.spec.tsx # Tests for App component
│   │   └── app.module.css
│   └── styles.css       # Global styles
├── index.html           # Vite entry HTML
├── vite.config.ts       # Vite configuration
├── tsconfig.json        # TypeScript config extending base
├── tsconfig.app.json    # App-specific TS config
├── project.json         # Nx project configuration
└── README.md            # Project documentation
```

## Required Configuration

### project.json
- Must include targets: build, serve, test, lint
- Use @nx/vite executors
- Set proper outputPath in dist/

### tsconfig.json
- Extend from root tsconfig.base.json
- Set jsx: "react-jsx" for modern JSX transform
- Include proper paths configuration

### vite.config.ts
- Use @vitejs/plugin-react
- Configure for development and production
- Set base path correctly

## Required Output

The generated app must:
1. Display "Welcome to $NAME!" on the home page
2. Use React 18 with proper TypeScript types
3. Have working test setup with Vitest
4. Support hot module replacement in development

## Additional Features

- Use CSS modules for component styling
- Add basic routing with React Router if --routing flag is set
- Include example of fetching data with useEffect
- Add error boundary for better error handling
- Setup proper development/production configurations
- Include accessibility attributes (aria-labels, semantic HTML)
- Add basic responsive design with CSS Grid/Flexbox

## Post-Generation Validation

After generation, validate:
1. `nx serve $NAME` starts the development server
2. `nx build $NAME` creates production build
3. `nx test $NAME` runs and passes tests
4. `nx lint $NAME` passes without errors
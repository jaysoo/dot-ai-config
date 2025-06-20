# Create @nx/php/laravel Plugin

## Task Overview
Create a Laravel plugin for the @nx/php package that follows the same structure as the existing composer and phpunit plugins. The plugin should automatically detect Laravel projects and create appropriate Nx targets for common Laravel commands.

## CRITICAL: Implementation Tracking
Keep track of progress in this section as we implement:
- [x] Step 1: Create plugin structure
- [x] Step 2: Implement createNodes function
- [x] Step 3: Add Laravel detection logic
- [x] Step 4: Define Laravel targets
- [x] Step 5: Integrate with init generator
- [x] Step 6: Write tests
- [x] Step 7: Update documentation
- [x] Step 8: Test the plugin

## Phase 1: Analysis and Planning

### Existing Plugin Structure
Based on analysis of packages/php:
- Composer plugin: Detects composer.json and creates install/update targets
- PHPUnit plugin: Detects phpunit.xml and creates test targets
- Both use createNodesV2 pattern with proper caching

### Laravel-Specific Requirements
Laravel projects typically have:
- `artisan` file in root
- `bootstrap/app.php` file
- `config/app.php` file
- `routes/web.php` file
- Laravel-specific composer dependencies

### Target Commands to Support
Common Laravel commands to expose as Nx targets:
- `serve` - Run development server (php artisan serve)
- `migrate` - Run migrations (php artisan migrate)
- `migrate:fresh` - Fresh migration with seed (php artisan migrate:fresh --seed)
- `tinker` - Laravel REPL (php artisan tinker)
- `queue:work` - Start queue workers (php artisan queue:work)
- `cache:clear` - Clear all caches (php artisan cache:clear)
- `route:list` - List routes (php artisan route:list)

## Phase 2: Implementation Steps

### Step 1: Create Plugin Structure
Create the following files:
- `packages/php/src/laravel/index.ts` - Main exports
- `packages/php/src/laravel/plugin/create-nodes.ts` - Plugin logic
- `packages/php/src/laravel/plugin/create-nodes.spec.ts` - Tests

### Step 2: Implement createNodes Function
- Use createNodesFromFiles pattern
- Detect Laravel projects by checking for `artisan` file
- Verify Laravel structure (bootstrap, config, routes)
- Parse composer.json for Laravel framework dependency

### Step 3: Add Laravel Detection Logic
```typescript
function isLaravelProject(projectPath: string): boolean {
  // Check for artisan file
  // Check for bootstrap/app.php
  // Check for config/app.php
  // Check for routes/web.php
  // Optional: Check composer.json for laravel/framework
}
```

### Step 4: Define Laravel Targets
Create targets with proper configuration:
- Each target should have appropriate metadata
- Include help descriptions
- Set proper dependencies (e.g., migrate depends on composer install)
- Support custom artisan commands from composer.json scripts

### Step 5: Integrate with Init Generator
- Create `add-laravel-plugin.ts` helper
- Update init generator to include Laravel plugin
- Ensure plugin is added to nx.json when PHP is initialized

### Step 6: Write Tests
- Unit tests for createNodes function
- Test Laravel project detection
- Test target generation
- Test caching behavior

### Step 7: Update Documentation
- Add Laravel section to packages/php/README.md
- Document available targets
- Provide usage examples

### Step 8: Test the Plugin
- Create a sample Laravel project
- Run nx commands to verify targets work
- Test all Laravel-specific commands

## Expected Outcome

When complete, developers should be able to:
1. Add @nx/php to their Laravel project
2. Automatically get Nx targets for common Laravel commands
3. Run `nx serve my-app` to start Laravel dev server
4. Run `nx migrate my-app` to run migrations
5. See all available Laravel commands with `nx show project my-app`

The plugin will integrate seamlessly with existing PHP tooling and follow all Nx best practices for plugin development.
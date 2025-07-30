# Fix Node.js Docker Integration with @nx/docker Plugin

## Task Overview
Fix the Node.js app generator to properly handle Docker integration with the @nx/docker plugin. The current Dockerfile template uses workspace-relative paths which breaks when building from the project directory using the @nx/docker plugin.

## Problem Analysis
1. The current `setup-docker` generator creates a Dockerfile that references paths relative to the workspace root (e.g., `apps/api/dist`)
2. The @nx/docker plugin runs docker commands from the project root directory (`cwd: projectRoot`)
3. This causes build failures because the paths in the Dockerfile don't match the working directory
4. The `setup-docker` generator creates a custom docker-build target that duplicates functionality already provided by @nx/docker plugin

## Solution Plan

### Phase 0: Add skipDockerPlugin Option
**Goal**: Add a flag to maintain backward compatibility and allow users to opt-out of @nx/docker plugin integration

**Changes needed**:
1. Add `skipDockerPlugin` boolean option to application schema
2. Add `skipDockerPlugin` boolean option to setup-docker schema
3. Update documentation for the new option

**TODO**:
- [ ] Update `/packages/node/src/generators/application/schema.json` with skipDockerPlugin option
- [ ] Update `/packages/node/src/generators/application/schema.d.ts` with skipDockerPlugin option
- [ ] Update `/packages/node/src/generators/setup-docker/schema.json` with skipDockerPlugin option
- [ ] Update `/packages/node/src/generators/setup-docker/schema.d.ts` with skipDockerPlugin option

### Phase 1: Update Dockerfile Template
**Goal**: Make the Dockerfile work from project root instead of workspace root (when skipDockerPlugin is false)

**Changes needed**:
1. Create two Dockerfile templates: one for @nx/docker plugin (project-relative) and one for legacy (workspace-relative)
2. OR: Use conditional logic in template based on skipDockerPlugin flag
3. When skipDockerPlugin=false: paths should be relative to project root
4. When skipDockerPlugin=true: paths should be relative to workspace root (current behavior)

**TODO**:
- [ ] Modify `/packages/node/src/generators/setup-docker/files/Dockerfile__tmpl__` to support both modes
- [ ] Update the template variables passed to the Dockerfile generation
- [ ] Pass skipDockerPlugin flag to template context
- [ ] Test with nested projects (e.g., `apps/api`, `apps/backend/api`)

### Phase 2: Fix setup-docker Generator
**Goal**: Update the generator to work with @nx/docker plugin conventions

**Changes needed**:
1. Modify `buildLocation` calculation based on skipDockerPlugin flag:
   - When skipDockerPlugin=false: relative to project root (e.g., `dist`)
   - When skipDockerPlugin=true: relative to workspace root (e.g., `apps/api/dist`)
2. Conditionally create docker-build target:
   - When skipDockerPlugin=false: skip target creation (rely on @nx/docker plugin)
   - When skipDockerPlugin=true: create custom docker-build target (current behavior)
3. Update the generator to check skipDockerPlugin option

**TODO**:
- [ ] Update `/packages/node/src/generators/setup-docker/setup-docker.ts`
- [ ] Calculate `buildLocation` based on skipDockerPlugin flag
- [ ] Conditionally create docker-build target based on skipDockerPlugin
- [ ] Update normalizeOptions to handle skipDockerPlugin

### Phase 3: Update Application Generator Integration
**Goal**: Ensure proper @nx/docker plugin integration when `--docker` flag is used

**Changes needed**:
1. When `--docker` flag is provided AND skipDockerPlugin=false:
   - Initialize @nx/docker plugin by calling its init generator
   - Pass skipDockerPlugin=false to setup-docker generator
2. When `--docker` flag is provided AND skipDockerPlugin=true:
   - Skip @nx/docker plugin initialization
   - Pass skipDockerPlugin=true to setup-docker generator (legacy behavior)
3. Ensure proper sequencing of generators

**TODO**:
- [ ] Update `/packages/node/src/generators/application/application.ts`
- [ ] Add conditional @nx/docker init generator call based on skipDockerPlugin
- [ ] Pass skipDockerPlugin option to setup-docker generator
- [ ] Ensure proper task sequencing
- [ ] Test with various framework options (express, fastify, nest, none)

### Phase 4: Testing & Validation
**Goal**: Ensure the changes work correctly in various scenarios

**Test cases with skipDockerPlugin=false (default)**:
1. Generate app with `--docker` flag in root: `nx g @nx/node:app myapp --docker`
2. Generate app with `--docker` flag in subdirectory: `nx g @nx/node:app apps/api --docker`
3. Generate app with `--docker` flag in nested directory: `nx g @nx/node:app apps/backend/api --docker`
4. Verify docker build works: `nx docker:build <project>`
5. Test with different frameworks (express, fastify, nest)
6. Test when @nx/docker plugin is already in nx.json
7. Test when @nx/docker plugin is not in nx.json

**Test cases with skipDockerPlugin=true (legacy)**:
1. Generate app with `--docker --skipDockerPlugin` flags
2. Verify custom docker-build target is created
3. Verify Dockerfile uses workspace-relative paths
4. Verify @nx/docker plugin is NOT initialized
5. Verify docker build works from workspace root

**TODO**:
- [ ] Create test scripts to validate scenarios
- [ ] Update existing tests for the generators
- [ ] Add new tests for @nx/docker plugin integration
- [ ] Add tests for skipDockerPlugin flag

## Expected Outcome
After implementing these changes:

**When skipDockerPlugin=false (default)**:
1. Generated Dockerfiles will work correctly when built from project directory
2. The @nx/docker plugin will be automatically initialized when using `--docker` flag
3. No custom docker-build targets will be created (rely on @nx/docker plugin)
4. Docker builds will work seamlessly with: `nx docker:build <project>`
5. The solution will work for projects at any depth in the workspace

**When skipDockerPlugin=true**:
1. Generated Dockerfiles will maintain backward compatibility (workspace-relative paths)
2. Custom docker-build target will be created in project.json
3. @nx/docker plugin will NOT be initialized
4. Docker builds will work from workspace root with custom target
5. Legacy behavior is preserved for users who need it

## Implementation Notes
- **CRITICAL**: Keep track of implementation progress in this document
- Prefer modifying existing generators over creating new ones
- Ensure backward compatibility where possible
- Follow existing code patterns and conventions in the codebase
- Run tests after each phase to ensure nothing breaks

## Alternative Approaches (if needed)
1. If detecting @nx/docker plugin presence is complex, could add a new option to control behavior
2. If backward compatibility is a concern, could add a flag to use new behavior
3. Could consider deprecating the custom docker-build target in favor of @nx/docker plugin

## Implementation Progress
### Phase 0: Add skipDockerPlugin Option ✅
- [x] Updated `/packages/node/src/generators/application/schema.json` with skipDockerPlugin option
- [x] Updated `/packages/node/src/generators/application/schema.d.ts` with skipDockerPlugin option
- [x] Updated `/packages/node/src/generators/setup-docker/schema.json` with skipDockerPlugin option
- [x] Updated `/packages/node/src/generators/setup-docker/schema.d.ts` with skipDockerPlugin option

### Phase 1: Update Dockerfile Template ✅
- [x] Modified `/packages/node/src/generators/setup-docker/files/Dockerfile__tmpl__` to support both modes
- [x] Added conditional logic for skipDockerPlugin flag
- [x] Updated template variables passed to Dockerfile generation

### Phase 2: Fix setup-docker Generator ✅
- [x] Updated `/packages/node/src/generators/setup-docker/setup-docker.ts`
- [x] Calculated `buildLocation` based on skipDockerPlugin flag
- [x] Conditionally create docker-build target based on skipDockerPlugin
- [x] Updated normalizeOptions to handle skipDockerPlugin

### Phase 3: Update Application Generator Integration ✅
- [x] Updated `/packages/node/src/generators/application/application.ts`
- [x] Added conditional @nx/docker init generator call based on skipDockerPlugin
- [x] Passed skipDockerPlugin option to setup-docker generator
- [x] Ensured proper task sequencing

### Phase 4: Testing & Validation ✅
- [x] Created comprehensive test suite for skipDockerPlugin functionality
- [x] Updated existing tests for backward compatibility
- [x] Added mocking for @nx/docker package in tests
- [x] All tests passing (10/10 tests pass)
- [x] Formatted code with prettier
- [x] Ran lint, build, and test commands - all passing

## Summary
The implementation is complete. The Node.js app generator now properly integrates with the @nx/docker plugin by default, while maintaining backward compatibility through the `--skipDockerPlugin` flag. Users can now generate apps that work seamlessly with the @nx/docker plugin's docker:build target, or opt for the legacy behavior if needed.
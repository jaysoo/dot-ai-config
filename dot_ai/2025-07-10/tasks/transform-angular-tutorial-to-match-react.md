# Transform Angular Monorepo Tutorial to Match React Tutorial Structure

## Goal
Transform the Angular monorepo tutorial (`docs/shared/tutorials/angular-monorepo.md`) to match the exact structure and flow of the React monorepo tutorial (`docs/shared/tutorials/react-monorepo.md`) while preserving Angular-specific content.

## Plan

### Phase 1: Structural Transformation

#### 1.1 Title and Introduction
- [ ] Change title to "Building and Testing Angular Apps in Nx"
- [ ] Update description to match React's focus
- [ ] Simplify introduction paragraph

#### 1.2 Prerequisites Section
- [ ] Add callout about GitHub account requirement
- [ ] Update "What will you learn?" bullets to match React tutorial:
  - how to create a new Angular workspace with GitHub Actions preconfigured
  - how to run a single task (i.e. serve your app) or run multiple tasks in parallel
  - how to modularize your codebase with local libraries for better code organization
  - how to benefit from caching that works both locally and in CI
  - how to set up self-healing CI to apply fixes directly from your local editor

#### 1.3 Creating a new Angular Monorepo Section
- [ ] Replace CLI setup with cloud.nx.app approach
- [ ] Add call-to-action button component
- [ ] Simplify workspace structure display
- [ ] Add GitHub Actions CI configuration details
- [ ] Add "Checkpoint: Workspace Created and Connected" subsection

#### 1.4 Serving the App Section
- [ ] Simplify content to match React's concise approach
- [ ] Focus on `npx nx serve demo` syntax
- [ ] Add "Inferred Tasks" subsection
- [ ] Include project details view example

#### 1.5 Modularization with Local Libraries Section
- [ ] Change from multiple libraries to single `ui` library approach
- [ ] Create Angular Hero component example
- [ ] Update import instructions to match React flow
- [ ] Simplify library benefits explanation

#### 1.6 Visualize Project Structure Section
- [ ] Keep similar to React tutorial
- [ ] Update graph to show demo → ui dependency

#### 1.7 Testing and Linting Section
- [ ] Rename to "Testing and Linting - Running Multiple Tasks"
- [ ] Add "Local Task Cache" subsection
- [ ] Include cache hit examples

#### 1.8 Self-Healing CI Section (NEW)
- [ ] Add new section about Nx Cloud's fix-ci feature
- [ ] Include intentional typo example ("Welcmoe" → "Welcome")
- [ ] Show editor integration steps
- [ ] Add remote cache explanation

#### 1.9 Building Section
- [ ] Simplify to focus only on deployment builds
- [ ] Remove custom deploy task example

#### 1.10 Remove Fast CI Section
- [ ] This content is now covered in Self-Healing CI section

### Phase 2: Code Conversions

#### 2.1 Hero Component
Convert React Hero component to Angular:
```typescript
// Angular Component
@Component({
  selector: 'lib-hero',
  standalone: true,
  template: `
    <div [style]="containerStyle">
      <h1 [style]="titleStyle">{{ title }}</h1>
      <p [style]="subtitleStyle">{{ subtitle }}</p>
      <button (click)="handleCtaClick()" [style]="buttonStyle">
        {{ cta }}
      </button>
    </div>
  `
})
export class HeroComponent {
  @Input() title!: string;
  @Input() subtitle!: string;
  @Input() cta!: string;
  @Output() ctaClick = new EventEmitter<void>();
  
  containerStyle = {
    backgroundColor: '#1a1a2e',
    color: 'white',
    padding: '100px 20px',
    textAlign: 'center'
  };
  
  titleStyle = {
    fontSize: '48px',
    marginBottom: '16px'
  };
  
  subtitleStyle = {
    fontSize: '20px',
    marginBottom: '32px'
  };
  
  buttonStyle = {
    backgroundColor: '#0066ff',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    fontSize: '18px',
    borderRadius: '4px',
    cursor: 'pointer'
  };
  
  handleCtaClick() {
    this.ctaClick.emit();
  }
}
```

#### 2.2 App Component Updates
Update main app component to use Hero:
```typescript
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeroComponent } from '@acme/ui';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeroComponent],
  template: `
    <h1>Home</h1>
    <lib-hero 
      title="Welcmoe to our Demo"
      subtitle="Build something amazing today"
      cta="Get Started"
    ></lib-hero>
  `
})
export class AppComponent {}
```

### Phase 3: Screenshot Updates

Mark all React-specific screenshots for replacement:
- `/shared/images/tutorials/react-demo-with-hero.avif` → Angular equivalent needed
- `/shared/images/tutorials/react-ci-notification.avif` → Angular equivalent needed
- `/shared/images/tutorials/react-ci-suggestion.avif` → Angular equivalent needed
- `/shared/images/tutorials/react-remote-cache-notification.avif` → Angular equivalent needed
- `/shared/images/tutorials/react-remote-cache-cloud.avif` → Angular equivalent needed
- `/shared/images/tutorials/react-ci-green.avif` → Angular equivalent needed

Keep generic screenshots:
- `/shared/images/tutorials/connected-workspace.avif`
- `/shared/images/run-target-syntax.svg`

### Phase 4: Command Updates

Update all commands to use Angular equivalents:
- `npx nx g @nx/react:library` → `npx nx g @nx/angular:library`
- React-specific options → Angular-specific options
- Vite references → Angular build tool references

### Success Criteria

1. Angular tutorial follows exact same flow as React tutorial
2. All sections appear in same order with same headings
3. Code examples are properly converted to Angular
4. Screenshots are marked for Angular replacements
5. Tutorial maintains same teaching objectives
6. CI/CD integration matches React tutorial approach

## Implementation Notes

- CRITICAL: Keep track of progress in this plan doc during implementation
- Preserve existing Angular-specific technical details where they don't conflict with structure
- Ensure all code examples are valid Angular code
- Maintain consistency in naming (demo app, ui library, etc.)
- Keep the intentional typo "Welcmoe" for the self-healing CI demo

## Status: IMPLEMENTATION COMPLETE

### Completed Tasks:

1. ✓ Title and Introduction updated to match React tutorial
2. ✓ Prerequisites section added with GitHub account requirement
3. ✓ Creating a new Angular Monorepo section updated with cloud.nx.app approach
4. ✓ Serving the App section simplified with Inferred Tasks subsection
5. ✓ Modularization section updated to use single `ui` library
6. ✓ Hero component created as Angular equivalent
7. ✓ Testing and Linting section renamed with Local Task Cache subsection
8. ✓ Self-Healing CI section added (new major section)
9. ✓ Building section simplified
10. ✓ Fast CI section removed
11. ✓ Next Steps section updated to match React

### Screenshot Notes for Replacement:

The following React screenshots need Angular equivalents:
- `/shared/images/tutorials/react-demo-with-hero.avif` - Shows demo app with Hero component
- `/shared/images/tutorials/react-ci-notification.avif` - Shows Nx Console CI notification
- `/shared/images/tutorials/react-ci-suggestion.avif` - Shows typo fix suggestion
- `/shared/images/tutorials/react-remote-cache-notification.avif` - Shows remote cache notification
- `/shared/images/tutorials/react-remote-cache-cloud.avif` - Shows Nx Cloud remote cache hits
- `/shared/images/tutorials/react-ci-green.avif` - Shows successful green PR

Generic screenshots kept as-is:
- `/shared/images/tutorials/connected-workspace.avif`
- `/shared/images/run-target-syntax.svg`
- `/shared/tutorials/github-pr-cloud-report.avif`
- `/shared/tutorials/nx-cloud-run-details.avif`

### Key Changes Made:

1. **Workspace name**: Changed from `angular-monorepo` to `acme`
2. **App name**: Changed from `angular-store` to `demo`
3. **Library structure**: Changed from multiple libraries (`products`, `orders`, `ui`) to single `ui` library
4. **Library location**: Changed from `libs/` to `packages/`
5. **Package scope**: Changed from `@angular-monorepo/` to `@acme/`
6. **CI focus**: Shifted from task distribution to self-healing CI
7. **Intentional typo**: Added "Welcmoe" typo in Hero component usage

### Angular-Specific Changes:

1. Used standalone components throughout
2. Used `@Component` decorator with inline template
3. Used `@Input()` and `@Output()` decorators
4. Used `[ngStyle]` for dynamic styling
5. Used `(click)` event binding
6. Used Angular's CommonModule for directives
7. Updated build tool references from Vite to Angular CLI

The tutorial now follows the exact same flow and structure as the React tutorial, making it easier for users to follow along regardless of their framework choice.
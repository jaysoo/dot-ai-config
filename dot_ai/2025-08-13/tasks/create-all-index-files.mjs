#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const directories = [
  // Concepts
  { path: 'concepts/CI Concepts', title: 'CI Concepts', desc: 'Continuous Integration concepts and best practices' },
  { path: 'concepts/Decisions', title: 'Architectural Decisions', desc: 'Key architectural decisions and patterns' },
  { path: 'concepts/Module Federation', title: 'Module Federation Concepts', desc: 'Core concepts of Module Federation' },
  
  // Enterprise
  { path: 'enterprise/Single Tenant', title: 'Single Tenant', desc: 'Single tenant deployment options' },
  
  // Features
  { path: 'features/CI Features', title: 'CI Features', desc: 'Continuous Integration features in Nx' },
  
  // Getting Started
  { path: 'getting-started/Tutorials', title: 'Tutorials', desc: 'Step-by-step tutorials for different frameworks' },
  
  // Guides
  { path: 'guides/Adopting Nx', title: 'Adopting Nx', desc: 'Guides for adopting Nx in your project' },
  { path: 'guides/Enforce Module Boundaries', title: 'Enforce Module Boundaries', desc: 'Control dependencies between projects' },
  { path: 'guides/Nx Console', title: 'Nx Console', desc: 'Using Nx Console extension' },
  { path: 'guides/Nx Release', title: 'Nx Release', desc: 'Publishing and versioning with Nx' },
  { path: 'guides/Tasks & Caching', title: 'Tasks & Caching', desc: 'Task execution and caching configuration' },
  { path: 'guides/Tips and Tricks', title: 'Tips and Tricks', desc: 'Helpful tips for using Nx effectively' },
  { path: 'guides/installation', title: 'Installation Guides', desc: 'Different ways to install Nx' },
  
  // References
  { path: 'references/Benchmarks', title: 'Benchmarks', desc: 'Performance benchmarks and comparisons' },
  { path: 'references/Powerpack', title: 'Powerpack', desc: 'Enterprise features and capabilities' },
  { path: 'references/Powerpack/conformance', title: 'Conformance', desc: 'Code conformance and standards' },
  { path: 'references/Powerpack/owners', title: 'Code Owners', desc: 'Managing code ownership' },
  { path: 'references/Remote Cache Plugins', title: 'Remote Cache Plugins', desc: 'Available remote cache implementations' },
  { path: 'references/Remote Cache Plugins/azure-cache', title: 'Azure Cache', desc: 'Azure Blob Storage cache plugin' },
  { path: 'references/Remote Cache Plugins/gcs-cache', title: 'GCS Cache', desc: 'Google Cloud Storage cache plugin' },
  { path: 'references/Remote Cache Plugins/s3-cache', title: 'S3 Cache', desc: 'Amazon S3 cache plugin' },
  { path: 'references/Remote Cache Plugins/shared-fs-cache', title: 'Shared FS Cache', desc: 'Shared filesystem cache plugin' },
  
  // Technologies - Angular
  { path: 'technologies/angular/Migration', title: 'Angular Migration', desc: 'Migrating Angular applications to Nx' },
  { path: 'technologies/angular/angular-rsbuild', title: 'Angular with Rsbuild', desc: 'Using Rsbuild with Angular' },
  { path: 'technologies/angular/angular-rspack', title: 'Angular with Rspack', desc: 'Using Rspack with Angular' },
  { path: 'technologies/angular/angular-rspack/Guides', title: 'Rspack Guides', desc: 'Guides for using Rspack with Angular' },
  
  // Technologies - Build Tools
  { path: 'technologies/build-tools/esbuild', title: 'ESBuild', desc: 'Fast JavaScript bundler' },
  { path: 'technologies/build-tools/rollup', title: 'Rollup', desc: 'Module bundler for JavaScript' },
  { path: 'technologies/build-tools/rsbuild', title: 'Rsbuild', desc: 'Rspack-based build tool' },
  { path: 'technologies/build-tools/rspack', title: 'Rspack', desc: 'Fast Rust-based bundler' },
  { path: 'technologies/build-tools/vite', title: 'Vite', desc: 'Fast frontend build tool' },
  { path: 'technologies/build-tools/vite/Guides', title: 'Vite Guides', desc: 'Guides for using Vite with Nx' },
  { path: 'technologies/build-tools/webpack', title: 'Webpack', desc: 'Powerful module bundler' },
  { path: 'technologies/build-tools/webpack/Guides', title: 'Webpack Guides', desc: 'Guides for configuring Webpack' },
  
  // Technologies - ESLint
  { path: 'technologies/eslint/Guides', title: 'ESLint Guides', desc: 'Configuration and usage guides' },
  { path: 'technologies/eslint/eslint-plugin', title: 'ESLint Plugin', desc: 'Nx ESLint plugin features' },
  { path: 'technologies/eslint/eslint-plugin/Guides', title: 'Plugin Guides', desc: 'ESLint plugin configuration guides' },
  
  // Technologies - Module Federation
  { path: 'technologies/module-federation/Concepts', title: 'MF Concepts', desc: 'Module Federation concepts' },
  { path: 'technologies/module-federation/Guides', title: 'MF Guides', desc: 'Module Federation implementation guides' },
  
  // Technologies - Node
  { path: 'technologies/node/Guides', title: 'Node.js Guides', desc: 'Backend development guides' },
  { path: 'technologies/node/express', title: 'Express', desc: 'Express framework support' },
  { path: 'technologies/node/nest', title: 'NestJS', desc: 'NestJS framework support' },
  
  // Technologies - React
  { path: 'technologies/react/Guides', title: 'React Guides', desc: 'React development guides' },
  { path: 'technologies/react/expo', title: 'Expo', desc: 'Expo React Native framework' },
  { path: 'technologies/react/next', title: 'Next.js', desc: 'Next.js framework support' },
  { path: 'technologies/react/next/Guides', title: 'Next.js Guides', desc: 'Next.js configuration guides' },
  { path: 'technologies/react/react-native', title: 'React Native', desc: 'Mobile app development with React Native' },
  { path: 'technologies/react/remix', title: 'Remix', desc: 'Remix framework support' },
  
  // Technologies - Test Tools
  { path: 'technologies/test-tools/cypress', title: 'Cypress', desc: 'E2E testing with Cypress' },
  { path: 'technologies/test-tools/cypress/Guides', title: 'Cypress Guides', desc: 'Cypress configuration and usage' },
  { path: 'technologies/test-tools/detox', title: 'Detox', desc: 'React Native testing with Detox' },
  { path: 'technologies/test-tools/jest', title: 'Jest', desc: 'Unit testing with Jest' },
  { path: 'technologies/test-tools/playwright', title: 'Playwright', desc: 'E2E testing with Playwright' },
  { path: 'technologies/test-tools/storybook', title: 'Storybook', desc: 'Component development with Storybook' },
  { path: 'technologies/test-tools/storybook/Guides', title: 'Storybook Guides', desc: 'Storybook configuration guides' },
  
  // Technologies - TypeScript
  { path: 'technologies/typescript/Guides', title: 'TypeScript Guides', desc: 'TypeScript configuration and best practices' },
  
  // Technologies - Vue
  { path: 'technologies/vue/nuxt', title: 'Nuxt', desc: 'Nuxt framework support' },
  { path: 'technologies/vue/nuxt/Guides', title: 'Nuxt Guides', desc: 'Nuxt configuration guides' },
];

const baseDir = 'astro-docs/src/content/docs';

directories.forEach(dir => {
  const fullPath = path.join(baseDir, dir.path);
  const indexPath = path.join(fullPath, 'index.mdoc');
  
  if (!fs.existsSync(indexPath)) {
    const content = `---
title: ${dir.title}
description: ${dir.desc}
---

{% index_page_cards path="${dir.path.replace(/\\/g, '/')}" /%}`;
    
    fs.writeFileSync(indexPath, content);
    console.log(`Created: ${indexPath}`);
  }
});

console.log('All index.mdoc files created!');

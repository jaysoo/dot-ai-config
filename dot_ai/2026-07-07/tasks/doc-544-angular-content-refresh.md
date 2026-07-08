# DOC-544: Refresh Angular blog posts and docs pages

Linear: https://linear.app/nxdev/issue/DOC-544/refresh-angular-blog-posts-and-docs-pages
Polygraph session: doc-554-angular-content-6732d8a8 (nrwl/nx + nrwl/nx-blog)
Pageview data: ~/Downloads/page_views.csv (GA4, 2026-06-07 to 2026-07-06)

## Findings

- Top 2 Angular URLs by traffic are 404s: /angular/plugins/overview (41.7k/30d), /angular/plugins/nx-plugin/overview (24k/30d)
- Docs mostly current mechanically (version matrix has Angular 22 rows, tailwind guide covers v4)
- Nx Cloud absent from all Angular docs pages except tutorial
- No docs/blog content on signals/SignalStore/zoneless/Analog (deferred per Jack)
- Full inventory posted as Linear comment on DOC-544

## Done (2026-07-07)

nrwl/nx, branch DOC-544, commit 8529748d7b (docs(misc)):
- netlify.toml: /angular/plugins/* -> angular intro redirect
- plugin.loader/generate-plugin-markdown/core-nx-plugin-generation: API pages link back to plugin intro
- introduction.mdoc: Angular CLI comparison table + Nx Cloud-forward CI section + nx connect
- nx-and-angular.mdoc: CNW template (not presets), @angular/build:application, dropped Nx 17 fallback tabs, self-healing CI row, Angular Rspack framing
- Migration/angular.mdoc: dropped Angular 13/14 notes
- dynamic MF guide: --bundler=rspack aside
- packages/nx/bin/init-local.ts: fixed dead nx-and-angular URL+anchor printed on ng update interception
- vale clean, validate-links passed

nrwl/nx-blog (~/projects/nx-blog), branch doc-544-angular-refresh, commit 3664e2c:
- architecting-angular-applications: @angular/build executors, Nx Cloud named + self-healing row, SignalStore pointer
- modern-angular-testing-with-nx: Angular first-party vitest (@angular/build:unit-test, v21+), @nx/vitest plugin commands, vitest-angular enum, karma deprecated framing
- angular-state-management-2025: title -> 2026 (slug kept), de-dated, signals-first NgRx framing, linkedSignal/resource/zoneless/TanStack Query, fixed notion.so "Nx Docs" link
- 2022 tailwind post: outdated-banner -> tailwind v4 post + docs guide
- pnpm build green

## Next

- Push both branches + draft PRs (needs 1P auth; nx repo needs nx affected -t build-base,lint,test first)
- Later: module-federation-with-ssr guide refresh, setup-incremental-builds review, using-rspack-with-angular + scaffold-angular-rspack posts, enterprise-angular-book edition check
- Deferred: new signals/SignalStore/zoneless content, NgRx post rewrite

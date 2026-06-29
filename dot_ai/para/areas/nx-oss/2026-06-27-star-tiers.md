# Popular Nx Open-Source Repos - Star-Tier Breakdown

Snapshot: **2026-06-27**. Source: `data/nx-oss-repos-2026-06-27.{json,csv}`.

Public GitHub repos with a root `nx.json` and > 500 stars, classified by Nx Cloud connection and whether they also keep a root `lerna.json` (Nx + Lerna). Full coverage run (every code-search size range fit under the 1,000-result cap; 34,898 candidate repos scanned).

## Totals

- **Repos (> 500 stars):** 235
- **Connected to Nx Cloud:** 63 (27%)
- **Not connected:** 172
- **Use Lerna (root `lerna.json`):** 59 (25%)
- **Nx + Lerna + Nx Cloud:** 10

| Star tier | Repos | On Nx Cloud | % Cloud | Use Lerna | % Lerna |
|-----------|------:|------------:|--------:|----------:|--------:|
| 10K+ stars | 46 | 17 | 37% | 17 | 37% |
| 5K-10K stars | 20 | 7 | 35% | 6 | 30% |
| 1K-5K stars | 98 | 25 | 26% | 21 | 21% |
| 500-999 stars | 71 | 14 | 20% | 15 | 21% |

Cloud status legend: `nxCloudId` = modern connection, `legacy-accessToken` = older token-based connection, `opted-out` = `neverConnectToCloud: true`, `not-connected` = no Cloud markers. **Lerna** = a `lerna.json` exists at the repo root (the repo runs Nx and Lerna together).

## 10K+ stars (46 repos, 17 on Cloud, 17 use Lerna)

| Repo | Stars | Lang | Nx Cloud | Lerna | Status |
|------|------:|------|:--------:|:-----:|--------|
| [storybookjs/storybook](https://github.com/storybookjs/storybook) | 90,452 | TypeScript | Yes | - | nxCloudId |
| [grafana/grafana](https://github.com/grafana/grafana) | 75,086 | TypeScript | - | Yes | not-connected |
| [strapi/strapi](https://github.com/strapi/strapi) | 72,549 | TypeScript | - | Yes | not-connected |
| [TryGhost/Ghost](https://github.com/TryGhost/Ghost) | 54,175 | JavaScript | Yes | - | nxCloudId |
| [twentyhq/twenty](https://github.com/twentyhq/twenty) | 51,797 | TypeScript | - | - | not-connected |
| [cypress-io/cypress](https://github.com/cypress-io/cypress) | 50,422 | TypeScript | Yes | Yes | legacy-accessToken |
| [TanStack/query](https://github.com/TanStack/query) | 49,842 | TypeScript | Yes | - | nxCloudId |
| [novuhq/novu](https://github.com/novuhq/novu) | 39,213 | TypeScript | Yes | - | legacy-accessToken |
| [lerna/lerna](https://github.com/lerna/lerna) | 36,059 | TypeScript | Yes | Yes | legacy-accessToken |
| [CopilotKit/CopilotKit](https://github.com/CopilotKit/CopilotKit) | 35,564 | TypeScript | - | - | not-connected |
| [refinedev/refine](https://github.com/refinedev/refine) | 34,966 | TypeScript | Yes | Yes | legacy-accessToken |
| [ReactiveX/rxjs](https://github.com/ReactiveX/rxjs) | 31,686 | TypeScript | Yes | - | legacy-accessToken |
| [sequelize/sequelize](https://github.com/sequelize/sequelize) | 30,359 | TypeScript | - | Yes | not-connected |
| [nrwl/nx](https://github.com/nrwl/nx) | 29,028 | TypeScript | Yes | - | nxCloudId |
| [TanStack/table](https://github.com/TanStack/table) | 28,134 | TypeScript | Yes | - | nxCloudId |
| [Budibase/budibase](https://github.com/Budibase/budibase) | 28,074 | TypeScript | - | Yes | not-connected |
| [BabylonJS/Babylon.js](https://github.com/BabylonJS/Babylon.js) | 25,702 | TypeScript | - | Yes | not-connected |
| [NativeScript/NativeScript](https://github.com/NativeScript/NativeScript) | 25,547 | TypeScript | Yes | - | nxCloudId |
| [palantir/blueprint](https://github.com/palantir/blueprint) | 21,862 | TypeScript | - | Yes | not-connected |
| [docmost/docmost](https://github.com/docmost/docmost) | 20,753 | TypeScript | - | - | not-connected |
| [microsoft/fluentui](https://github.com/microsoft/fluentui) | 20,072 | TypeScript | - | - | not-connected |
| [decaporg/decap-cms](https://github.com/decaporg/decap-cms) | 19,177 | JavaScript | - | Yes | not-connected |
| [oblador/react-native-vector-icons](https://github.com/oblador/react-native-vector-icons) | 17,887 | TypeScript | - | - | not-connected |
| [redwoodjs/graphql](https://github.com/redwoodjs/graphql) | 17,617 | TypeScript | Yes | Yes | legacy-accessToken |
| [typescript-eslint/typescript-eslint](https://github.com/typescript-eslint/typescript-eslint) | 16,286 | TypeScript | Yes | - | nxCloudId |
| [tinymce/tinymce](https://github.com/tinymce/tinymce) | 16,227 | TypeScript | - | Yes | not-connected |
| [amplication/amplication](https://github.com/amplication/amplication) | 16,013 | TypeScript | Yes | - | legacy-accessToken |
| [ionic-team/capacitor](https://github.com/ionic-team/capacitor) | 15,965 | TypeScript | - | Yes | not-connected |
| [rjsf-team/react-jsonschema-form](https://github.com/rjsf-team/react-jsonschema-form) | 15,813 | TypeScript | - | - | not-connected |
| [infinitered/reactotron](https://github.com/infinitered/reactotron) | 15,572 | TypeScript | - | - | not-connected |
| [ag-grid/ag-grid](https://github.com/ag-grid/ag-grid) | 15,422 | TypeScript | - | - | not-connected |
| [apitable/apitable](https://github.com/apitable/apitable) | 15,396 | TypeScript | - | - | not-connected |
| [TanStack/router](https://github.com/TanStack/router) | 14,704 | TypeScript | Yes | - | nxCloudId |
| [ag-ui-protocol/ag-ui](https://github.com/ag-ui-protocol/ag-ui) | 14,450 | Python | - | - | not-connected |
| [zitadel/zitadel](https://github.com/zitadel/zitadel) | 14,209 | Go | Yes | - | nxCloudId |
| [plait-board/drawnix](https://github.com/plait-board/drawnix) | 14,114 | TypeScript | - | - | not-connected |
| [BuilderIO/mitosis](https://github.com/BuilderIO/mitosis) | 13,870 | TypeScript | Yes | - | legacy-accessToken |
| [web-infra-dev/midscene](https://github.com/web-infra-dev/midscene) | 13,864 | TypeScript | - | - | not-connected |
| [element-hq/element-web](https://github.com/element-hq/element-web) | 13,240 | TypeScript | - | - | not-connected |
| [bitwarden/clients](https://github.com/bitwarden/clients) | 13,138 | TypeScript | - | - | not-connected |
| [aws/aws-cdk](https://github.com/aws/aws-cdk) | 12,825 | TypeScript | - | Yes | not-connected |
| [BrowserSync/browser-sync](https://github.com/BrowserSync/browser-sync) | 12,292 | JavaScript | - | Yes | not-connected |
| [microsoft/fluentui-system-icons](https://github.com/microsoft/fluentui-system-icons) | 10,641 | HTML | - | - | not-connected |
| [Turfjs/turf](https://github.com/Turfjs/turf) | 10,386 | TypeScript | - | Yes | not-connected |
| [baptisteArno/typebot.io](https://github.com/baptisteArno/typebot.io) | 10,078 | TypeScript | - | - | not-connected |
| [mui/base-ui](https://github.com/mui/base-ui) | 10,070 | TypeScript | - | Yes | not-connected |

## 5K-10K stars (20 repos, 7 on Cloud, 6 use Lerna)

| Repo | Stars | Lang | Nx Cloud | Lerna | Status |
|------|------:|------|:--------:|:-----:|--------|
| [VoltAgent/voltagent](https://github.com/VoltAgent/voltagent) | 9,825 | TypeScript | - | Yes | not-connected |
| [hyperdxio/hyperdx](https://github.com/hyperdxio/hyperdx) | 9,630 | TypeScript | - | - | not-connected |
| [OpenCTI-Platform/opencti](https://github.com/OpenCTI-Platform/opencti) | 9,599 | TypeScript | - | - | not-connected |
| [tsparticles/tsparticles](https://github.com/tsparticles/tsparticles) | 8,902 | TypeScript | Yes | Yes | nxCloudId |
| [ghostfolio/ghostfolio](https://github.com/ghostfolio/ghostfolio) | 8,852 | TypeScript | - | - | opted-out |
| [BuilderIO/builder](https://github.com/BuilderIO/builder) | 8,738 | TypeScript | Yes | - | legacy-accessToken |
| [getsentry/sentry-javascript](https://github.com/getsentry/sentry-javascript) | 8,697 | TypeScript | - | - | not-connected |
| [ngrx/platform](https://github.com/ngrx/platform) | 8,318 | TypeScript | Yes | - | legacy-accessToken |
| [mengxi-ream/read-frog](https://github.com/mengxi-ream/read-frog) | 8,202 | TypeScript | - | - | not-connected |
| [penrose/penrose](https://github.com/penrose/penrose) | 7,950 | TypeScript | - | Yes | not-connected |
| [electron/forge](https://github.com/electron/forge) | 7,096 | TypeScript | - | Yes | not-connected |
| [TanStack/virtual](https://github.com/TanStack/virtual) | 6,979 | TypeScript | Yes | - | nxCloudId |
| [plasmicapp/plasmic](https://github.com/plasmicapp/plasmic) | 6,881 | TypeScript | Yes | Yes | legacy-accessToken |
| [TanStack/form](https://github.com/TanStack/form) | 6,588 | TypeScript | Yes | - | nxCloudId |
| [4gray/iptvnator](https://github.com/4gray/iptvnator) | 6,379 | TypeScript | - | - | not-connected |
| [actions/toolkit](https://github.com/actions/toolkit) | 5,785 | TypeScript | - | Yes | not-connected |
| [valor-software/ngx-bootstrap](https://github.com/valor-software/ngx-bootstrap) | 5,519 | TypeScript | Yes | - | legacy-accessToken |
| [Uniswap/interface](https://github.com/Uniswap/interface) | 5,516 | TypeScript | - | - | not-connected |
| [cloudflare/agents](https://github.com/cloudflare/agents) | 5,184 | TypeScript | - | - | not-connected |
| [web-infra-dev/modern.js](https://github.com/web-infra-dev/modern.js) | 5,021 | TypeScript | - | - | not-connected |

## 1K-5K stars (98 repos, 25 on Cloud, 21 use Lerna)

| Repo | Stars | Lang | Nx Cloud | Lerna | Status |
|------|------:|------|:--------:|:-----:|--------|
| [generalaction/emdash](https://github.com/generalaction/emdash) | 4,998 | TypeScript | - | - | not-connected |
| [tech-leads-club/agent-skills](https://github.com/tech-leads-club/agent-skills) | 4,762 | TypeScript | Yes | - | nxCloudId |
| [nomcopter/react-mosaic](https://github.com/nomcopter/react-mosaic) | 4,759 | TypeScript | - | - | not-connected |
| [supabase/supabase-js](https://github.com/supabase/supabase-js) | 4,490 | TypeScript | - | - | not-connected |
| [algolia/docsearch](https://github.com/algolia/docsearch) | 4,368 | TypeScript | - | Yes | not-connected |
| [graphif/project-graph](https://github.com/graphif/project-graph) | 4,177 | TypeScript | - | - | not-connected |
| [erxes/erxes](https://github.com/erxes/erxes) | 4,012 | TypeScript | - | - | not-connected |
| [taiga-family/taiga-ui](https://github.com/taiga-family/taiga-ui) | 4,005 | TypeScript | Yes | - | nxCloudId |
| [midrender/revideo](https://github.com/midrender/revideo) | 3,881 | TypeScript | - | Yes | not-connected |
| [reactjs/react-docgen](https://github.com/reactjs/react-docgen) | 3,822 | TypeScript | - | - | not-connected |
| [React95/React95](https://github.com/React95/React95) | 3,789 | TypeScript | Yes | - | legacy-accessToken |
| [ever-co/ever-gauzy](https://github.com/ever-co/ever-gauzy) | 3,746 | TypeScript | - | Yes | not-connected |
| [Tresjs/tres](https://github.com/Tresjs/tres) | 3,609 | Vue | - | - | not-connected |
| [ngxs/store](https://github.com/ngxs/store) | 3,548 | TypeScript | Yes | - | legacy-accessToken |
| [argos-ci/jest-puppeteer](https://github.com/argos-ci/jest-puppeteer) | 3,545 | TypeScript | - | Yes | not-connected |
| [open-telemetry/opentelemetry-js](https://github.com/open-telemetry/opentelemetry-js) | 3,411 | TypeScript | - | Yes | not-connected |
| [ts-rest/ts-rest](https://github.com/ts-rest/ts-rest) | 3,317 | TypeScript | Yes | - | legacy-accessToken |
| [mathuo/dockview](https://github.com/mathuo/dockview) | 3,280 | TypeScript | - | - | not-connected |
| [pezzolabs/pezzo](https://github.com/pezzolabs/pezzo) | 3,249 | TypeScript | - | - | not-connected |
| [analogjs/analog](https://github.com/analogjs/analog) | 3,146 | TypeScript | Yes | - | legacy-accessToken |
| [jmcdo29/testing-nestjs](https://github.com/jmcdo29/testing-nestjs) | 3,011 | TypeScript | - | - | not-connected |
| [remix-project-org/remix-project](https://github.com/remix-project-org/remix-project) | 3,011 | TypeScript | Yes | Yes | legacy-accessToken |
| [codigoencasa/builderbot](https://github.com/codigoencasa/builderbot) | 2,952 | TypeScript | - | Yes | not-connected |
| [aws-amplify/amplify-cli](https://github.com/aws-amplify/amplify-cli) | 2,875 | TypeScript | - | Yes | not-connected |
| [TanStack/ai](https://github.com/TanStack/ai) | 2,838 | TypeScript | Yes | - | nxCloudId |
| [trungvose/angular-spotify](https://github.com/trungvose/angular-spotify) | 2,780 | TypeScript | Yes | - | legacy-accessToken |
| [spartan-ng/spartan](https://github.com/spartan-ng/spartan) | 2,682 | TypeScript | - | - | not-connected |
| [scullyio/scully](https://github.com/scullyio/scully) | 2,532 | TypeScript | Yes | - | legacy-accessToken |
| [kentcdodds/kentcdodds.com](https://github.com/kentcdodds/kentcdodds.com) | 2,486 | MDX | Yes | - | nxCloudId |
| [hudy9x/namviek](https://github.com/hudy9x/namviek) | 2,474 | TypeScript | - | - | not-connected |
| [Vibrant-Colors/node-vibrant](https://github.com/Vibrant-Colors/node-vibrant) | 2,434 | TypeScript | - | Yes | not-connected |
| [schedule-x/schedule-x](https://github.com/schedule-x/schedule-x) | 2,433 | TypeScript | - | Yes | not-connected |
| [tapjs/tapjs](https://github.com/tapjs/tapjs) | 2,424 | JavaScript | - | - | opted-out |
| [sadanandpai/frontend-mini-challenges](https://github.com/sadanandpai/frontend-mini-challenges) | 2,411 | JavaScript | - | - | not-connected |
| [ballerine-io/ballerine](https://github.com/ballerine-io/ballerine) | 2,402 | TypeScript | - | - | not-connected |
| [valor-software/ng2-charts](https://github.com/valor-software/ng2-charts) | 2,401 | TypeScript | Yes | - | legacy-accessToken |
| [deskree-inc/blok](https://github.com/deskree-inc/blok) | 2,344 | TypeScript | - | - | not-connected |
| [supabase/cli](https://github.com/supabase/cli) | 2,299 | TypeScript | - | - | not-connected |
| [web-infra-dev/rspress](https://github.com/web-infra-dev/rspress) | 2,273 | TypeScript | - | - | not-connected |
| [jsverse/transloco](https://github.com/jsverse/transloco) | 2,260 | TypeScript | - | - | not-connected |
| [Teradata/covalent](https://github.com/Teradata/covalent) | 2,224 | TypeScript | - | - | not-connected |
| [newcat/baklavajs](https://github.com/newcat/baklavajs) | 2,042 | TypeScript | - | Yes | not-connected |
| [amll-dev/applemusic-like-lyrics](https://github.com/amll-dev/applemusic-like-lyrics) | 2,015 | TypeScript | - | - | not-connected |
| [ParabolInc/parabol](https://github.com/ParabolInc/parabol) | 2,003 | TypeScript | - | - | not-connected |
| [JMBeresford/retrom](https://github.com/JMBeresford/retrom) | 1,989 | TypeScript | Yes | - | nxCloudId |
| [opral/inlang](https://github.com/opral/inlang) | 1,964 | TypeScript | Yes | - | legacy-accessToken |
| [saifyxpro/HeadlessX](https://github.com/saifyxpro/HeadlessX) | 1,963 | TypeScript | - | - | not-connected |
| [rx-angular/rx-angular](https://github.com/rx-angular/rx-angular) | 1,963 | TypeScript | Yes | - | nxCloudId |
| [OpenAPITools/openapi-generator-cli](https://github.com/OpenAPITools/openapi-generator-cli) | 1,959 | TypeScript | - | - | not-connected |
| [WordPress/wordpress-playground](https://github.com/WordPress/wordpress-playground) | 1,958 | JavaScript | - | Yes | not-connected |
| [brimdata/zui](https://github.com/brimdata/zui) | 1,957 | TypeScript | - | - | not-connected |
| [ffxiv-teamcraft/ffxiv-teamcraft](https://github.com/ffxiv-teamcraft/ffxiv-teamcraft) | 1,917 | TypeScript | - | - | not-connected |
| [smapiot/piral](https://github.com/smapiot/piral) | 1,911 | TypeScript | - | Yes | not-connected |
| [DevExpress/DevExtreme](https://github.com/DevExpress/DevExtreme) | 1,911 | TypeScript | - | - | opted-out |
| [valor-software/ng2-dragula](https://github.com/valor-software/ng2-dragula) | 1,909 | TypeScript | Yes | Yes | legacy-accessToken |
| [valor-software/ng2-file-upload](https://github.com/valor-software/ng2-file-upload) | 1,900 | TypeScript | Yes | - | legacy-accessToken |
| [angular-eslint/angular-eslint](https://github.com/angular-eslint/angular-eslint) | 1,784 | TypeScript | Yes | - | nxCloudId |
| [web3ui/web3uikit](https://github.com/web3ui/web3uikit) | 1,780 | TypeScript | - | - | not-connected |
| [salesforce/lwc](https://github.com/salesforce/lwc) | 1,770 | JavaScript | - | - | not-connected |
| [richardgill/llm-ui](https://github.com/richardgill/llm-ui) | 1,750 | TypeScript | - | - | not-connected |
| [microsoft/rnx-kit](https://github.com/microsoft/rnx-kit) | 1,725 | TypeScript | - | - | not-connected |
| [jdalrymple/gitbeaker](https://github.com/jdalrymple/gitbeaker) | 1,721 | TypeScript | - | Yes | not-connected |
| [rmwc/rmwc](https://github.com/rmwc/rmwc) | 1,661 | JavaScript | Yes | - | legacy-accessToken |
| [dineug/erd-editor](https://github.com/dineug/erd-editor) | 1,657 | TypeScript | - | - | not-connected |
| [better-auth-ui/better-auth-ui](https://github.com/better-auth-ui/better-auth-ui) | 1,657 | TypeScript | Yes | - | nxCloudId |
| [avkonst/hookstate](https://github.com/avkonst/hookstate) | 1,656 | TypeScript | - | - | not-connected |
| [taiga-family/maskito](https://github.com/taiga-family/maskito) | 1,652 | TypeScript | - | - | not-connected |
| [gronxb/hot-updater](https://github.com/gronxb/hot-updater) | 1,588 | TypeScript | - | - | not-connected |
| [statoscope/statoscope](https://github.com/statoscope/statoscope) | 1,579 | TypeScript | Yes | Yes | legacy-accessToken |
| [seek-oss/braid-design-system](https://github.com/seek-oss/braid-design-system) | 1,568 | TypeScript | - | - | not-connected |
| [takram-design-engineering/three-geospatial](https://github.com/takram-design-engineering/three-geospatial) | 1,514 | TypeScript | - | - | not-connected |
| [mezonai/mezon](https://github.com/mezonai/mezon) | 1,480 | TypeScript | - | - | opted-out |
| [codeaholicguy/ai-devkit](https://github.com/codeaholicguy/ai-devkit) | 1,449 | TypeScript | - | - | not-connected |
| [nrwl/nx-console](https://github.com/nrwl/nx-console) | 1,411 | TypeScript | Yes | - | nxCloudId |
| [Nexus-Mods/Vortex](https://github.com/Nexus-Mods/Vortex) | 1,402 | TypeScript | - | - | opted-out |
| [algolia/algoliasearch-client-javascript](https://github.com/algolia/algoliasearch-client-javascript) | 1,386 | TypeScript | - | Yes | not-connected |
| [tomalaforge/angular-challenges](https://github.com/tomalaforge/angular-challenges) | 1,385 | TypeScript | - | - | not-connected |
| [awslabs/aws-solutions-constructs](https://github.com/awslabs/aws-solutions-constructs) | 1,351 | TypeScript | - | - | not-connected |
| [adobe/spectrum-css](https://github.com/adobe/spectrum-css) | 1,281 | CSS | - | - | not-connected |
| [microsoft/griffel](https://github.com/microsoft/griffel) | 1,278 | TypeScript | - | - | not-connected |
| [xwiki/xwiki-platform](https://github.com/xwiki/xwiki-platform) | 1,277 | Java | - | - | not-connected |
| [TanStack/cli](https://github.com/TanStack/cli) | 1,276 | TypeScript | - | - | not-connected |
| [marcoroth/herb](https://github.com/marcoroth/herb) | 1,261 | TypeScript | - | - | not-connected |
| [rpldy/react-uploady](https://github.com/rpldy/react-uploady) | 1,234 | JavaScript | - | Yes | not-connected |
| [layrjs/layr](https://github.com/layrjs/layr) | 1,217 | TypeScript | - | Yes | not-connected |
| [wireapp/wire-webapp](https://github.com/wireapp/wire-webapp) | 1,188 | TypeScript | - | - | opted-out |
| [ElMassimo/iles](https://github.com/ElMassimo/iles) | 1,148 | TypeScript | Yes | - | legacy-accessToken |
| [web-infra-dev/rsdoctor](https://github.com/web-infra-dev/rsdoctor) | 1,136 | TypeScript | - | - | not-connected |
| [rango-exchange/rango-client](https://github.com/rango-exchange/rango-client) | 1,128 | TypeScript | - | - | not-connected |
| [zard-ui/zardui](https://github.com/zard-ui/zardui) | 1,085 | TypeScript | - | - | not-connected |
| [cloudflare/ai](https://github.com/cloudflare/ai) | 1,081 | TypeScript | - | - | not-connected |
| [bloomberg/stricli](https://github.com/bloomberg/stricli) | 1,055 | TypeScript | - | - | not-connected |
| [carbon-design-system/carbon-charts](https://github.com/carbon-design-system/carbon-charts) | 1,042 | HTML | - | Yes | not-connected |
| [openops-cloud/openops](https://github.com/openops-cloud/openops) | 1,039 | TypeScript | - | - | opted-out |
| [stefanoslig/angular-ngrx-nx-realworld-example-app](https://github.com/stefanoslig/angular-ngrx-nx-realworld-example-app) | 1,038 | TypeScript | - | - | not-connected |
| [trezor/trezor-suite](https://github.com/trezor/trezor-suite) | 1,018 | TypeScript | Yes | - | legacy-accessToken |
| [argdown/argdown](https://github.com/argdown/argdown) | 1,017 | TypeScript | - | Yes | opted-out |
| [nartc/mapper](https://github.com/nartc/mapper) | 1,006 | TypeScript | Yes | - | legacy-accessToken |

## 500-999 stars (71 repos, 14 on Cloud, 15 use Lerna)

| Repo | Stars | Lang | Nx Cloud | Lerna | Status |
|------|------:|------|:--------:|:-----:|--------|
| [srikanth235/privy](https://github.com/srikanth235/privy) | 993 | TypeScript | - | - | not-connected |
| [frzyc/genshin-optimizer](https://github.com/frzyc/genshin-optimizer) | 985 | TypeScript | - | - | not-connected |
| [vaadin/hilla](https://github.com/vaadin/hilla) | 984 | Java | - | - | not-connected |
| [RaspberryPiFoundation/blockly-samples](https://github.com/RaspberryPiFoundation/blockly-samples) | 976 | JavaScript | - | Yes | not-connected |
| [code-forge-io/react-router-devtools](https://github.com/code-forge-io/react-router-devtools) | 967 | TypeScript | - | - | not-connected |
| [nrwl/nx-examples](https://github.com/nrwl/nx-examples) | 963 | TypeScript | Yes | - | nxCloudId |
| [otoyo/astro-notion-blog](https://github.com/otoyo/astro-notion-blog) | 954 | Astro | - | - | not-connected |
| [bitovi/react-to-web-component](https://github.com/bitovi/react-to-web-component) | 936 | TypeScript | - | - | not-connected |
| [argotorg/sourcify](https://github.com/argotorg/sourcify) | 935 | TypeScript | - | Yes | not-connected |
| [javierbrea/eslint-plugin-boundaries](https://github.com/javierbrea/eslint-plugin-boundaries) | 917 | TypeScript | - | - | unparseable |
| [open-telemetry/opentelemetry-js-contrib](https://github.com/open-telemetry/opentelemetry-js-contrib) | 912 | TypeScript | - | Yes | not-connected |
| [3Shain/Comen](https://github.com/3Shain/Comen) | 905 | TypeScript | - | - | not-connected |
| [julianpoy/RecipeSage](https://github.com/julianpoy/RecipeSage) | 905 | TypeScript | - | - | opted-out |
| [oku-ui/primitives](https://github.com/oku-ui/primitives) | 894 | Vue | - | - | not-connected |
| [byteburgers/react-native-autocomplete-input](https://github.com/byteburgers/react-native-autocomplete-input) | 870 | TypeScript | - | - | not-connected |
| [lukasbach/headless-tree](https://github.com/lukasbach/headless-tree) | 858 | TypeScript | Yes | Yes | legacy-accessToken |
| [TanStack/store](https://github.com/TanStack/store) | 857 | TypeScript | Yes | - | nxCloudId |
| [angular-architects/module-federation-plugin](https://github.com/angular-architects/module-federation-plugin) | 849 | TypeScript | - | - | not-connected |
| [Oneirocom/Magick](https://github.com/Oneirocom/Magick) | 839 | TypeScript | Yes | - | legacy-accessToken |
| [llama-farm/llamafarm](https://github.com/llama-farm/llamafarm) | 833 | Python | Yes | - | nxCloudId |
| [TanStack/ranger](https://github.com/TanStack/ranger) | 833 | TypeScript | - | - | not-connected |
| [taiga-family/ng-web-apis](https://github.com/taiga-family/ng-web-apis) | 820 | TypeScript | - | - | not-connected |
| [ngxtension/ngxtension-platform](https://github.com/ngxtension/ngxtension-platform) | 806 | TypeScript | Yes | - | nxCloudId |
| [Canner/vulcan-sql](https://github.com/Canner/vulcan-sql) | 791 | TypeScript | - | - | not-connected |
| [SAP/spartacus](https://github.com/SAP/spartacus) | 780 | TypeScript | - | - | not-connected |
| [hwgilbert16/scholarsome](https://github.com/hwgilbert16/scholarsome) | 770 | TypeScript | Yes | - | legacy-accessToken |
| [jscutlery/semver](https://github.com/jscutlery/semver) | 768 | TypeScript | - | - | not-connected |
| [remusao/tldts](https://github.com/remusao/tldts) | 752 | TypeScript | - | Yes | not-connected |
| [mlightcad/cad-viewer](https://github.com/mlightcad/cad-viewer) | 744 | TypeScript | - | - | not-connected |
| [TanStack/pacer](https://github.com/TanStack/pacer) | 738 | TypeScript | Yes | - | nxCloudId |
| [iway1/trpc-panel](https://github.com/iway1/trpc-panel) | 731 | TypeScript | Yes | - | legacy-accessToken |
| [Shopify/cli](https://github.com/Shopify/cli) | 717 | TypeScript | - | - | not-connected |
| [liveloveapp/hashbrown](https://github.com/liveloveapp/hashbrown) | 707 | TypeScript | Yes | - | nxCloudId |
| [fulls1z3/universal](https://github.com/fulls1z3/universal) | 700 | TypeScript | - | - | not-connected |
| [pagopa/io-app](https://github.com/pagopa/io-app) | 697 | TypeScript | - | - | not-connected |
| [qwikifiers/qwik-ui](https://github.com/qwikifiers/qwik-ui) | 695 | TypeScript | Yes | - | legacy-accessToken |
| [mozilla/fxa](https://github.com/mozilla/fxa) | 677 | TypeScript | - | - | opted-out |
| [microsoft/react-native-test-app](https://github.com/microsoft/react-native-test-app) | 667 | TypeScript | - | - | not-connected |
| [antvis/XFlow](https://github.com/antvis/XFlow) | 650 | TypeScript | - | - | not-connected |
| [TanStack/hotkeys](https://github.com/TanStack/hotkeys) | 638 | TypeScript | Yes | - | nxCloudId |
| [lgrammel/rubberduck-vscode](https://github.com/lgrammel/rubberduck-vscode) | 632 | TypeScript | - | - | not-connected |
| [pixijs-userland/spine](https://github.com/pixijs-userland/spine) | 626 | TypeScript | - | Yes | not-connected |
| [ljquan/opentu](https://github.com/ljquan/opentu) | 624 | TypeScript | - | - | not-connected |
| [KorzhCom/EasyData](https://github.com/KorzhCom/EasyData) | 622 | TypeScript | - | Yes | not-connected |
| [etherspot/skandha](https://github.com/etherspot/skandha) | 612 | TypeScript | - | Yes | not-connected |
| [serenity-js/serenity-js](https://github.com/serenity-js/serenity-js) | 612 | TypeScript | - | Yes | not-connected |
| [klis87/normy](https://github.com/klis87/normy) | 609 | TypeScript | - | Yes | not-connected |
| [llm-tools/embedJs](https://github.com/llm-tools/embedJs) | 604 | TypeScript | Yes | - | nxCloudId |
| [Comfy-Org/workflow_templates](https://github.com/Comfy-Org/workflow_templates) | 601 | Python | - | - | not-connected |
| [LedgerHQ/ledger-live](https://github.com/LedgerHQ/ledger-live) | 600 | TypeScript | - | - | not-connected |
| [react-auth-kit/react-auth-kit](https://github.com/react-auth-kit/react-auth-kit) | 597 | TypeScript | - | Yes | not-connected |
| [contentful/rich-text](https://github.com/contentful/rich-text) | 585 | TypeScript | - | Yes | not-connected |
| [ng-icons/ng-icons](https://github.com/ng-icons/ng-icons) | 577 | TypeScript | Yes | - | legacy-accessToken |
| [ng-primitives/ng-primitives](https://github.com/ng-primitives/ng-primitives) | 575 | TypeScript | - | - | not-connected |
| [nx-go/nx-go](https://github.com/nx-go/nx-go) | 565 | TypeScript | - | - | not-connected |
| [Rel1cx/eslint-react](https://github.com/Rel1cx/eslint-react) | 564 | TypeScript | - | - | not-connected |
| [gund/ng-dynamic-component](https://github.com/gund/ng-dynamic-component) | 562 | TypeScript | - | - | not-connected |
| [LouisMazel/maz-ui](https://github.com/LouisMazel/maz-ui) | 562 | TypeScript | - | - | not-connected |
| [easyblockshq/easyblocks](https://github.com/easyblockshq/easyblocks) | 558 | TypeScript | - | Yes | not-connected |
| [zuplo/zudoku](https://github.com/zuplo/zudoku) | 555 | TypeScript | - | - | opted-out |
| [vietanhdev/shipfast](https://github.com/vietanhdev/shipfast) | 548 | TypeScript | - | - | not-connected |
| [Skyscanner/backpack](https://github.com/Skyscanner/backpack) | 539 | TypeScript | - | - | not-connected |
| [orca-so/whirlpools](https://github.com/orca-so/whirlpools) | 538 | TypeScript | - | - | not-connected |
| [Motion-Core/motion-core](https://github.com/Motion-Core/motion-core) | 536 | Svelte | - | - | not-connected |
| [hcfyapp/google-translate-cn-ip](https://github.com/hcfyapp/google-translate-cn-ip) | 535 | JavaScript | - | - | not-connected |
| [UI5/webcomponents-react](https://github.com/UI5/webcomponents-react) | 534 | TypeScript | - | Yes | not-connected |
| [vsavkin/large-monorepo](https://github.com/vsavkin/large-monorepo) | 521 | TypeScript | - | - | not-connected |
| [bdebon/choiceof.dev](https://github.com/bdebon/choiceof.dev) | 513 | TypeScript | - | - | not-connected |
| [ever-co/ever-teams](https://github.com/ever-co/ever-teams) | 510 | TypeScript | - | Yes | not-connected |
| [modiimedia/arri](https://github.com/modiimedia/arri) | 504 | TypeScript | - | - | not-connected |
| [epam/ai-dial-chat](https://github.com/epam/ai-dial-chat) | 501 | TypeScript | - | - | not-connected |


# Weekly Changelog

Generated from recent commits, grouped by week ending Saturday (YYMM.DD format)

---

## Week of 2508.17

### Features
- **nx-cloud**: Improve "connect GH" views (#8274)
- **nx-cloud**: Show which tasks were assigned to restarted agents (#8260)
- **nx-cloud**: Add TTG factor report (#8271)
- **nx-cloud**: Associate a user record with clibOnboardingSession object (#8269)
- **aggregator**: Account for PR lifetime savings (#8280)
- **aggregator**: Split hypothetical time save for TTG report data (#8259)
- **owners**: Support prefix at the root and pattern level (#8253)

### Fixes
- **nx-cloud**: Track /runs for noAccessOriginatingFromPullRequestLogs (#8282)
- **nx-cloud**: Set the cookie correctly (#8279)
- **nx-cloud**: Use renderMarkdown when displaying fix reasoning (#8275)
- **nx-cloud**: Update record-command task IDs and handling logic (#8273)
- **nx-cloud**: Pass client_id when create change password ticket (#8270)
- **nx-cloud**: Handle errors when actioning ai fixes (#8171)
- **nx-cloud**: Form issue for workspace setting (#8257)
- **nx-cloud**: Auth0 invalidate sessions vuln (#8248)
- **nx-cloud**: Remove redundant `<br />` from self-healing container rendering logic (#8262)
- **nx-cloud-workflow-controller**: Idempotent secret tokens (#8254)
- **client-bundle**: Ensure that end of run message is printed after upload (#8252)
- **fix-ci**: Upload AI agent execution logs to file storage (#8261)
- **executor**: Pass NX_VERSION from controller to executor (#8258)

---

## Week of 2508.10

### Features
- **nx-cloud**: Add ttg to app (#8213)
- **nx-cloud**: Reverse trial admin tools and data model (#8145)
- **nx-cloud**: Track if user access resolved by logging in (#8227)
- **nx-cloud**: Allow users to skip nx cloud id step during manual onboarding (#8187)
- **nx-api**: Add endpoint to allow agent tasks to be reclaimed via endpoint (#8229)
- **nx-api**: Refresh vcs tokens for agents (#8185)
- **nx-api**: Add support for self-healing task filtering (#8157)
- **aggregator**: Store CIPE no cache duration or calculate retroactively (#8241)
- **aggregator**: Add hypothetical timings to TTG report (#8212)
- **client-bundle**: Refactor view logs and upload details to run result uploader (#8203)
- **graph**: Support merging task graphs; only show outgoers (#8238)
- **admin**: Remove unnecessary fields from ent license form (#8209)

### Fixes
- **nx-cloud**: Private login perceived load time (#8237)
- **nx-cloud**: Http span correlationId; test github PAT adjust; log non-ok Response as original error (#8230)
- **nx-cloud**: Private login colors (#8223)
- **nx-cloud**: Workspace type issue (#8222)
- **nx-cloud**: Fix nx-cloud record displaying incorrectly in the task (#8188)
- **nx-cloud**: Centralize notification defaults (#8172)
- **nx-cloud**: Render line breaks in AI fix reasoning (#8216)
- **nx-cloud**: Access request button not correctly set up for vcs orgs (#8205)
- **nx-cloud**: Adjust wording of github comment and prevent setting from being disabled (#8204)
- **nx-api**: Include current repository when generating a github token (#8244)
- **nx-api**: Include record commands when trying to fix with ai (#8197)
- **nx-api**: Remove faulty thirty requests per minute rate limiter (#8214)
- **nx-api**: Update AI task fixing conditions to respect the org settings (#8218)
- **aggregator**: Hypothetical TTG should not be better than observed (#8247)
- **client-bundle**: Store in current process if CI (#8235)
- **graph**: Update graph should rerender previously rendered eles (#8249)
- **conformance**: GitLab sections are not mapping projects to owners file (#8206)

---

## Week of 2508.03

### Features
- **nx-cloud**: Update OOM banner with link directly to restarted agent (#8173)
- **nx-cloud**: Flaky task analytics shell (#8161)
- **nx-cloud**: AI prompt overrides and admin management UI (#8146)
- **nx-cloud**: Reconcile agent restarts (#8130)
- **nx-cloud**: Add a "Latest execution" link to view the latest cipe for a branch (#8058)
- **nx-cloud**: New enterprise badge + BadgeGroup component (#8136)
- **nx-cloud**: Docker technology icon (#8111)
- **nx-cloud**: Notify users to enable self healing ci in workspace (#8090)
- **nx-api**: Store github comment body text for debug (#8134)
- **aggregator**: Add daily TTG report (#8162)
- **graph,nx-cloud**: Allow tapping edges to open the edge context menu (#8192)
- **executor**: Use instancePrefix for AGENT_NAME (#8179)

### Fixes
- **nx-cloud**: Don't allow users to choose repos that they aren't admins of the owner (#8148)
- **nx-cloud**: Color code fix for usage graph and hide ai if disabled for org (#8181)
- **nx-cloud**: Dark mode fix for dialog (#8182)
- **nx-cloud**: Get organization member should consider authId for private enterprise (#8186)
- **nx-cloud**: Use correct rollbar property for ignore messages (#8183)
- **nx-cloud**: Update link background for oom banner (#8180)
- **nx-cloud**: Add CIPE branch text index (#8177)
- **nx-cloud**: Correct agent ordering and instance name extraction (#8152)
- **nx-cloud**: Fixing alignment in polygraph cards (#8155)
- **nx-cloud**: Build conformance packages before nx-cloud (#8139)
- **nx-cloud**: Less aggressive access control logs (#8143)
- **nx-cloud**: Sign in method for authId (private enterprise user) (#8141)
- **nx-cloud**: Allow adding email domain during enterprise onboarding (#8131)
- **nx-cloud**: Handle completed fixes without generated solutions (#8129)
- **nx-cloud**: Card links to new Nx video and self-healing ci docs page (#8125)
- **nx-cloud**: Ensure polygraph features only for enabled enterprises (#8104)
- **nx-cloud,graph**: Enforce consumers to handle dark mode; nx-cloud properly handles dark mode (#8175)
- **nx-api**: Evaluated against proper RunDetails status (#8196)
- **nx-api**: Ensure proper credentials are loaded (#8189)
- **nx-api**: Use batchSize when querying for inner run errors (#8168)
- **nx-api**: Properly store GH comment body (#8149)
- **nx-api**: Allow assignment rules to be empty (#8140)
- **nx-api**: Address vulnerability CVE-2023-52428 (#8132)
- **nx-api**: Reconcile run groups to cancelled status more liberally (#8128)
- **nx-api,client-bundle**: Validate assignment rules config and improve error messaging (#8079)
- **fix-ci**: Refactor prompt handling and support common failure resolution (#8160)
- **fix-ci**: Add support for claude to handle multiple task failures (#8120)
- **executor**: Remove extra } in windows script for ai task fixing step (#8147)
- **light-client**: Guard against null branch for conformance request upload (#8137)

---

## Week of 2507.27

### Features
- **nx-cloud**: Track 404s originating from pull requests in mongo (#8101)
- **nx-cloud**: Send week-in-review email for snapshot and staging orgs (#8100)
- **nx-cloud**: Add a script calculating command stats (#8102)
- **nx-cloud**: Dialog + teaser (#8076)
- **nx-cloud**: Add node auto instrumentation to OTEL (#8040)
- **nx-cloud**: Implement JWT for scim request authentication (#8075)
- **nx-cloud**: Add CIPE status percentage chart for workspace analytics (#8046)
- **nx-cloud**: Add total agent duration on breakdown (#8045)
- **nx-api**: Add domain to onboarding session (#8122)
- **nx-api**: Handle unverified powerpack licenses in PowerpackHandlers (#8043)
- **nx-cloud-workflow-controller**: Configurable executor-binary volume size (#8190)
- **nx-cloud,graph**: Support workspaceId as a valid `nxCloudImplicitDependencies` (#8178)
- **runner**: Add foreground heartbeat (#8077)

### Fixes
- **nx-cloud**: Add the &exact=true param to the run details branch link (#8105)
- **nx-cloud**: Filter out non SCIM groups for scim-enabled members (#8110)
- **nx-cloud**: Turn scim filter operator to lowercase (#8109)
- **nx-cloud**: Let the otel library build the export path (#8103)
- **nx-cloud**: Change otel env var name (#8087)
- **nx-cloud**: Dynamically size code editor based on available space (#8088)
- **nx-cloud**: Custom workflow launch template link (#8082)
- **nx-cloud**: URL for ai terms (#8080)
- **nx-cloud**: Improve custom workflow launch templates UI (#8067)
- **nx-cloud**: Less aggressive access control logging (#8068)
- **nx-cloud**: Don't enforce fallback to false for flag foundry (#8056)
- **nx-cloud**: Redirect simple auth private enterprise; nx-cloud package false positive cache hit (#8054)
- **nx-api**: Batch size for groupMemberships query; groupId index (#8112)
- **nx-api**: Fix gradle dep download (#8086)
- **nx-api**: Prevent completed tasks from getting set to in progress (#8071)
- **nx-api**: Override org.codehaus.plexus:plexus-utils dep for CVE (#7989)
- **nx-api**: Do not count inner runs created by AI fix validation (#7984)
- **nx-cloud-workflow-controller**: Refactor SignedURL to enable retries (#8053)
- **nx-cloud-workflow-controller**: Add retry to client for gcs link signer (#8037)
- **aggregator**: Do not include nx-cloud[bot] in contributors (#8004)
- **aggregator**: Properly count workspace credit usage after claiming (#7985)
- **client-bundle**: Hardcode 'version' for backwards compat (#8115)
- **client-bundle**: Validate assignment rules config and improve error messaging (#8079)
- **cloud-runner**: Ensure that TaskTarget fields are populated correctly (#8094)
- **nx-api,client-bundle**: Ensure that tasks with multiple colons in targets are able to be retried (#8081)
- **fix-ci**: Refine prompt to emphasize user intentions in reasonings (#8085)
- **fix-ci**: Update prompt to consider user commit messages as intention (#8078)
- **fix-ci**: Update prompt to ensure that claude uses git information in determining fix (#8070)
- **fix-ci**: Do not fail on missing properties for storing suggested fixes (#7972)
- **s3-cache**: Handle expired AWS token errors gracefully (#8117)
- **s3-cache**: Update nx peer dependency to use version range (#8113)
- **light-client**: Avoid creating the project graph on each invocation of lightClientRequire when using .nx installation (#8118)

---

## Week of 2507.20

### Features
- **nx-cloud**: Enable TS preset + update preset config (#8009)
- **nx-cloud**: Add new image for agents viz login (#8000)
- **nx-cloud**: Onboarding adjustments (#7990)
- **nx-cloud**: Enterprise license decoder (#7647)
- **nx-cloud**: Remove conformance flagged code (#8019)
- **nx-cloud**: Use installation url for github auth (#8008)
- **nx-cloud**: Onboarding copy updates and autosubmit form (#8013)
- **nx-cloud**: Do not show any AI fixes if they have not started (#7962)
- **nx-cloud**: Add framework presets to onboarding (#7946)
- **nx-cloud,nx-packages**: Workspace graph implicit dependencies (#7947)
- **nx-cloud**: Add user attributes for tracking scripts (#7869)
- **nx-cloud**: Enable for orgs and workspaces by default all the time (#7955)
- **nx-cloud**: Add time period selection for analytics dashboards (#7924)
- **nx-api**: Do not create ai fix objects for PRO or LEGACY plan orgs (#8014)
- **nx-api**: Gate self healing CI behind non-Pro plans (#7963)
- **admin**: Remove old prepaid page (#7823)
- **fix-ci**: Add reasoning field to AI Fix suggestions (#7958)
- **runner**: Send nxCloudImplicitDependencies for project graph (#7994)

### Fixes
- **nx-cloud**: Filter unclaimed workspaces in analytics (#8005)
- **nx-cloud**: Show simple auth form when SOCIAL_AUTH_ENABLED is null (#8003)
- **nx-cloud**: Adjust license filter to simplify condition (#8002)
- **nx-cloud**: Small fix to cipe link to prevent an unnecessary regex search (#7993)
- **nx-cloud**: Persist powerpack licenses even if they can't be decrypted (#7849)
- **nx-cloud**: Fix support modal to pre-select current org/workspace from url (#7976)
- **nx-cloud**: Sync SSO username on login; error statuses on invite member private; reject auth if missing email (#7981)
- **nx-cloud**: Fix-onboarding-cookie (#7975)
- **nx-cloud**: Add profile back to /get-started (#7978)
- **nx-cloud**: Error on missing scim bearer token (#7979)
- **nx-cloud**: Update default user type in tracking script (#7971)
- **nx-cloud**: Fix links + title in learn about section (#7970)
- **nx-cloud**: Trim whitespace from VCS forms (#7961)
- **nx-cloud**: Handle JSON parsing for feature permissions (#7954)
- **nx-cloud**: Conditionally show updated Nx Cloud terms (#7945)
- **nx-api**: Make vcs config check more general (#8016)
- **nx-api**: Do not filter out `NOT_STARTED` fixes for the console handler (#8011)
- **nx-api**: Let cipe to complete before reusing agents for fixes (#7998)
- **nx-api**: Do not trim content when applying patches (#7980)
- **nx-api**: Add suggestedFixReasoning field to Nx Console handler (#7965)
- **nx-api**: Always populate launch template to parallelism map (#7944)
- **nx-api**: Add validation for Self-Healing CI configuration in AI Fix handlers (#7943)
- **nx-api/client-bundle**: Client bundle and nx-api do not have input (#8006)
- **runner**: Light client works with .nx/installation when running "record" (#7960)
- **fix-ci**: Improve AI fix handling and status reporting logic (#7956)
- **fix-ci**: Use backticks for ai fix suggestion description (#7950)
- **conformance**: Mention ci based authentication for publishing conformance rules (#7987)

---

## Summary

### Week of 2508.17 (Most Recent)
- **14 Features**: Focus on nx-cloud improvements, aggregator PR savings, and owner management
- **13 Fixes**: Authentication, UI rendering, and workflow controller improvements
- **Top Contributors**: nx-cloud (10 changes), aggregator (2 changes)

### Week of 2508.10
- **12 Features**: Major nx-api endpoint additions, graph improvements, TTG reporting
- **18 Fixes**: Performance improvements, authentication fixes, UI/UX enhancements
- **Top Contributors**: nx-cloud (18 changes), nx-api (8 changes)

### Week of 2508.03
- **12 Features**: AI/self-healing CI features, analytics improvements, agent management
- **29 Fixes**: Comprehensive bug fixes across authentication, UI, and API layers
- **Top Contributors**: nx-cloud (29 changes), nx-api (8 changes)

### Week of 2507.27
- **13 Features**: Telemetry additions, analytics dashboards, workflow improvements
- **32 Fixes**: Security patches, performance optimizations, compatibility fixes
- **Top Contributors**: nx-cloud (20 changes), nx-api (7 changes)

### Overall Trends
- Heavy investment in AI/self-healing CI capabilities
- Significant authentication and access control improvements
- Performance monitoring and analytics enhancements
- UI/UX polish (dark mode, responsive design, form improvements)
- Security vulnerability remediation across multiple components
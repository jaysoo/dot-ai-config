# Weekly Changelog

Generated from recent commits, grouped by week ending Saturday (YYMM.DD format)

---

## nx-cloud

### Week of 2508.17
**Features:**
- Improve "connect GH" views (#8274)
- Show which tasks were assigned to restarted agents (#8260)
- Add TTG factor report (#8271)
- Associate a user record with clibOnboardingSession object (#8269)

**Fixes:**
- Track /runs for noAccessOriginatingFromPullRequestLogs (#8282)
- Set the cookie correctly (#8279)
- Use renderMarkdown when displaying fix reasoning (#8275)
- Update record-command task IDs and handling logic (#8273)
- Pass client_id when create change password ticket (#8270)
- Handle errors when actioning ai fixes (#8171)
- Form issue for workspace setting (#8257)
- Auth0 invalidate sessions vuln (#8248)
- Remove redundant `<br />` from self-healing container rendering logic (#8262)

### Week of 2508.10
**Features:**
- Add ttg to app (#8213)
- Reverse trial admin tools and data model (#8145)
- Track if user access resolved by logging in (#8227)
- Allow users to skip nx cloud id step during manual onboarding (#8187)

**Fixes:**
- Private login perceived load time (#8237)
- Http span correlationId; test github PAT adjust; log non-ok Response as original error (#8230)
- Private login colors (#8223)
- Workspace type issue (#8222)
- Fix nx-cloud record displaying incorrectly in the task (#8188)
- Centralize notification defaults (#8172)
- Render line breaks in AI fix reasoning (#8216)
- Access request button not correctly set up for vcs orgs (#8205)
- Adjust wording of github comment and prevent setting from being disabled (#8204)

### Week of 2508.03
**Features:**
- Update OOM banner with link directly to restarted agent (#8173)
- Flaky task analytics shell (#8161)
- AI prompt overrides and admin management UI (#8146)
- Reconcile agent restarts (#8130)
- Add a "Latest execution" link to view the latest cipe for a branch (#8058)
- New enterprise badge + BadgeGroup component (#8136)
- Docker technology icon (#8111)
- Notify users to enable self healing ci in workspace (#8090)

**Fixes:**
- Don't allow users to choose repos that they aren't admins of the owner (#8148)
- Color code fix for usage graph and hide ai if disabled for org (#8181)
- Dark mode fix for dialog (#8182)
- Get organization member should consider authId for private enterprise (#8186)
- Use correct rollbar property for ignore messages (#8183)
- Update link background for oom banner (#8180)
- Add CIPE branch text index (#8177)
- Correct agent ordering and instance name extraction (#8152)
- Fixing alignment in polygraph cards (#8155)
- Build conformance packages before nx-cloud (#8139)
- Less aggressive access control logs (#8143)
- Sign in method for authId (private enterprise user) (#8141)
- Allow adding email domain during enterprise onboarding (#8131)
- Handle completed fixes without generated solutions (#8129)

### Week of 2507.27
**Features:**
- Track 404s originating from pull requests in mongo (#8101)
- Send week-in-review email for snapshot and staging orgs (#8100)
- Add a script calculating command stats (#8102)
- Dialog + teaser (#8076)
- Add node auto instrumentation to OTEL (#8040)
- Implement JWT for scim request authentication (#8075)
- Add CIPE status percentage chart for workspace analytics (#8046)
- Add total agent duration on breakdown (#8045)

**Fixes:**
- Add the &exact=true param to the run details branch link (#8105)
- Filter out non SCIM groups for scim-enabled members (#8110)
- Turn scim filter operator to lowercase (#8109)
- Let the otel library build the export path (#8103)
- Change otel env var name (#8087)
- Dynamically size code editor based on available space (#8088)
- Custom workflow launch template link (#8082)
- URL for ai terms (#8080)
- Improve custom workflow launch templates UI (#8067)
- Less aggressive access control logging (#8068)
- Don't enforce fallback to false for flag foundry (#8056)
- Redirect simple auth private enterprise; nx-cloud package false positive cache hit (#8054)

---

## aggregator

### Week of 2508.17
**Features:**
- Account for PR lifetime savings (#8280)
- Split hypothetical time save for TTG report data (#8259)

### Week of 2508.10
**Features:**
- Store CIPE no cache duration or calculate retroactively (#8241)
- Add hypothetical timings to TTG report (#8212)

**Fixes:**
- Hypothetical TTG should not be better than observed (#8247)

### Week of 2508.03
**Features:**
- Add daily TTG report (#8162)

### Week of 2507.27
**Fixes:**
- Do not include nx-cloud[bot] in contributors (#8004)
- Properly count workspace credit usage after claiming (#7985)

---

## nx-api

### Week of 2508.17
*No changes this week*

### Week of 2508.10
**Features:**
- Add endpoint to allow agent tasks to be reclaimed via endpoint (#8229)
- Refresh vcs tokens for agents (#8185)
- Add support for self-healing task filtering (#8157)

**Fixes:**
- Include current repository when generating a github token (#8244)
- Include record commands when trying to fix with ai (#8197)
- Remove faulty thirty requests per minute rate limiter (#8214)
- Update AI task fixing conditions to respect the org settings (#8218)

### Week of 2508.03
**Features:**
- Store github comment body text for debug (#8134)

**Fixes:**
- Evaluated against proper RunDetails status (#8196)
- Ensure proper credentials are loaded (#8189)
- Use batchSize when querying for inner run errors (#8168)
- Properly store GH comment body (#8149)
- Allow assignment rules to be empty (#8140)
- Address vulnerability CVE-2023-52428 (#8132)
- Reconcile run groups to cancelled status more liberally (#8128)
- Validate assignment rules config and improve error messaging (#8079)

### Week of 2507.27
**Features:**
- Add domain to onboarding session (#8122)
- Handle unverified powerpack licenses in PowerpackHandlers (#8043)

**Fixes:**
- Batch size for groupMemberships query; groupId index (#8112)
- Fix gradle dep download (#8086)
- Prevent completed tasks from getting set to in progress (#8071)
- Override org.codehaus.plexus:plexus-utils dep for CVE (#7989)
- Do not count inner runs created by AI fix validation (#7984)

---

## nx-cloud-workflow-controller

### Week of 2508.17
**Fixes:**
- Idempotent secret tokens (#8254)

### Week of 2508.10
*No changes this week*

### Week of 2508.03
**Fixes:**
- Pass NX_VERSION from controller to executor (#8258)

### Week of 2507.27
**Features:**
- Configurable executor-binary volume size (#8190)

**Fixes:**
- Refactor SignedURL to enable retries (#8053)
- Add retry to client for gcs link signer (#8037)

---

## executor

### Week of 2508.17
*No changes this week*

### Week of 2508.10
**Fixes:**
- Pass NX_VERSION from controller to executor (#8258)

### Week of 2508.03
**Features:**
- Use instancePrefix for AGENT_NAME (#8179)

**Fixes:**
- Remove extra } in windows script for ai task fixing step (#8147)

### Week of 2507.27
*No changes this week*

---

## client-bundle

### Week of 2508.17
**Fixes:**
- Ensure that end of run message is printed after upload (#8252)

### Week of 2508.10
**Features:**
- Refactor view logs and upload details to run result uploader (#8203)

**Fixes:**
- Store in current process if CI (#8235)

### Week of 2508.03
*No changes this week*

### Week of 2507.27
**Fixes:**
- Hardcode 'version' for backwards compat (#8115)
- Validate assignment rules config and improve error messaging (#8079)

---

## fix-ci

### Week of 2508.10
*No changes this week*

### Week of 2508.03
**Features:**
- Upload AI agent execution logs to file storage (#8261)

**Fixes:**
- Refactor prompt handling and support common failure resolution (#8160)
- Add support for claude to handle multiple task failures (#8120)

### Week of 2507.27
**Fixes:**
- Refine prompt to emphasize user intentions in reasonings (#8085)
- Update prompt to consider user commit messages as intention (#8078)
- Update prompt to ensure that claude uses git information in determining fix (#8070)
- Do not fail on missing properties for storing suggested fixes (#7972)

---

## Summary Statistics

### Total Changes (Last 4 Weeks)
- **nx-cloud**: 24 features, 46 fixes
- **nx-api**: 6 features, 16 fixes  
- **aggregator**: 5 features, 2 fixes
- **nx-cloud-workflow-controller**: 1 feature, 3 fixes
- **fix-ci**: 1 feature, 4 fixes
- **client-bundle**: 1 feature, 3 fixes
- **executor**: 1 feature, 2 fixes

### Most Active Week
**Week of 2508.03** with 58 total changes across all scopes

### Trend Analysis
- Heavy focus on AI/self-healing CI features and fixes
- Significant authentication and access control improvements
- Performance optimizations (TTG reports, caching)
- UI/UX improvements (dark mode, dialog fixes)
- Security vulnerability patches
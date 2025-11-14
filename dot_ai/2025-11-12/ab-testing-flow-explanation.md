# A/B Testing Flow Explanation: Meta Property in Nx Cloud Connection

## Overview

The A/B testing uses **two separate randomization points** to test different messages:
1. **Prompt A/B test**: What question to ask the user (during workspace creation)
2. **Success message A/B test**: What success message to show (after workspace creation)

## Flow Diagram

```
User runs: npx create-nx-workspace

┌─────────────────────────────────────────────────────┐
│ Step 1: PROMPT A/B Testing                          │
│ Location: ab-testing.ts → setupNxCloudSimple        │
│                                                      │
│ Randomly selects 1 of 3 prompt variants:            │
│  - simple-cloud-v1: "Get to green PRs faster..."    │
│  - simple-cloud-v2: "Enable remote caching..."      │
│  - simple-cloud-v3: "Speed up CI and reduce..."     │
│                                                      │
│ User sees the question and answers Yes/Skip         │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ Step 2: Workspace Creation                          │
│ Location: create-workspace.ts                       │
│                                                      │
│ - Clones template                                   │
│ - Installs dependencies                             │
│ - Initializes git repo                              │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ Step 3: SUCCESS MESSAGE A/B Testing                 │
│ Location: messages.ts → create-nx-workspace-        │
│           template-cloud                            │
│                                                      │
│ Randomly selects 1 of 3 success message variants:   │
│  - template-cloud-connect-v1                        │
│  - template-cloud-connect-v2                        │
│  - template-cloud-connect-v3                        │
│                                                      │
│ THIS code is passed to createNxCloudOnboardingURL   │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ Step 4: Cloud Connection URL Generation             │
│ Location: nx-cloud.ts → createNxCloudOnboardingUrl  │
│                                                      │
│ const source = getCloudMessageSource(...)           │
│ const { code } = getMessageFactory(source)          │
│                                                      │
│ createNxCloudOnboardingURL(                         │
│   source,                    // 'create-nx-workspace-template-cloud'
│   token,                     // Cloud workspace token
│   code,                      // 'template-cloud-connect-v1/v2/v3'  ← THIS IS THE META
│   false,                     //                                           │
│   useGitHub                  //                                           │
│ )                            //                                           │
└─────────────────────────────────────────────────────┘                     │
                       ↓                                                    │
┌─────────────────────────────────────────────────────┐                     │
│ Step 5: Nx Cloud Receives Meta                      │                     │
│ Location: nx/src/nx-cloud/utilities/url-shorten     │                     │
│                                                      │                     │
│ The `code` parameter becomes part of the URL query   │ ←──────────────────┘
│ parameters or URL path, allowing Nx Cloud to track  │
│ which success message variant the user saw.         │
│                                                      │
│ Example URL structure:                              │
│ https://cloud.nx.app/connect/abc123?meta=           │
│   template-cloud-connect-v2                         │
└─────────────────────────────────────────────────────┘
                       ↓
┌─────────────────────────────────────────────────────┐
│ Step 6: Telemetry via recordStat                    │
│ Location: bin/create-nx-workspace.ts                │
│                                                      │
│ await recordStat({                                  │
│   command: 'create-nx-workspace',                   │
│   useCloud: true,                                   │
│   meta: [                                           │
│     messages.codeOfSelectedPromptMessage('setupCI'), │
│     messages.codeOfSelectedPromptMessage(           │
│       'setupNxCloudSimple'  ← Tracks PROMPT variant │
│     ),                                              │
│     // ... other meta                               │
│   ]                                                 │
│ })                                                  │
│                                                      │
│ Sends to: POST https://cloud.nx.app/nx-cloud/stats  │
└─────────────────────────────────────────────────────┘
```

## Code Locations and Their Roles

### 1. Prompt Variant Selection (ab-testing.ts)

```typescript
// ab-testing.ts lines 61-101
setupNxCloudSimple: [
  {
    code: 'simple-cloud-v1',  // ← Prompt variant code
    message: 'Get to green PRs faster with Nx Cloud?',
    // ...
  },
  {
    code: 'simple-cloud-v2',  // ← Prompt variant code
    message: 'Would you like to enable remote caching...',
    // ...
  },
  {
    code: 'simple-cloud-v3',  // ← Prompt variant code
    message: 'Speed up CI and reduce compute costs...',
    // ...
  },
]
```

**How it's selected**:
```typescript
// ab-testing.ts lines 118-128
getPrompt(key: MessageKey): MessageData {
  if (this.selectedMessages[key] === undefined) {
    // Randomly select variant (0, 1, or 2)
    this.selectedMessages[key] = Math.floor(
      Math.random() * messageOptions[key].length
    );
  }
  return messageOptions[key][this.selectedMessages[key]!];
}
```

### 2. Success Message Variant Selection (messages.ts)

```typescript
// messages.ts lines 44-85
'create-nx-workspace-template-cloud': [
  {
    code: 'template-cloud-connect-v1',  // ← Success message variant code
    createMessage: (url, pushedToVcs) => ({
      title: 'Connect to Nx Cloud to complete setup',
      // ...
    }),
  },
  {
    code: 'template-cloud-connect-v2',  // ← Success message variant code
    createMessage: (url, pushedToVcs) => ({
      title: 'One more step: activate remote caching',
      // ...
    }),
  },
  {
    code: 'template-cloud-connect-v3',  // ← Success message variant code
    createMessage: (url, pushedToVcs) => ({
      title: 'Almost done! Finish Nx Cloud setup',
      // ...
    }),
  },
]
```

**How it's selected**:
```typescript
// messages.ts lines 92-103
getMessageFactory(key: OutputMessageKey) {
  if (this.selectedMessages[key] === undefined) {
    // Randomly select variant (0, 1, or 2)
    this.selectedMessages[key] = Math.floor(
      Math.random() * outputMessages[key].length
    );
  }
  return outputMessages[key][this.selectedMessages[key]!];
}
```

### 3. Passing Code to Cloud Onboarding URL (nx-cloud.ts)

```typescript
// nx-cloud.ts lines 61-70
const source = getCloudMessageSource(!!isTemplate, nxCloud);
const { code } = getMessageFactory(source);  // ← Gets 'template-cloud-connect-v1/v2/v3'

return await createNxCloudOnboardingURL(
  source,   // 'create-nx-workspace-template-cloud'
  token,    // Cloud workspace token
  code,     // 'template-cloud-connect-v1/v2/v3' ← THIS IS THE META
  false,
  useGitHub ?? (nxCloud === 'yes' || nxCloud === 'github' || nxCloud === 'circleci')
);
```

### 4. How Nx Cloud Uses the Meta

The `code` parameter (3rd argument to `createNxCloudOnboardingURL`) becomes metadata that Nx Cloud tracks. This allows Nx Cloud to:

1. **Track which variant the user saw**: When a user clicks the connection URL, Nx Cloud knows whether they saw v1, v2, or v3 of the success message
2. **Measure conversion rates**: Nx Cloud can calculate:
   - How many users saw v1 and clicked to connect vs v2 vs v3
   - Which message variant drives the highest connection rate
3. **Optimize messaging**: Based on the data, the Nx team can identify which message performs best

## Two Separate A/B Tests

**Important**: There are TWO independent A/B tests happening:

| Test Type | Location | Codes | Tracked By | Purpose |
|-----------|----------|-------|------------|---------|
| **Prompt** | ab-testing.ts | simple-cloud-v1/v2/v3 | recordStat() | Test which QUESTION drives more "Yes" answers |
| **Success Message** | messages.ts | template-cloud-connect-v1/v2/v3 | Cloud onboarding URL | Test which SUCCESS MESSAGE drives more connections |

### Why Two Separate Tests?

1. **Prompt test**: Optimizes the initial conversion (getting users to say "Yes")
2. **Success message test**: Optimizes the follow-through (getting users who said "Yes" to actually connect)

Both are independently randomized, so:
- User might see prompt v1 and success message v3
- User might see prompt v2 and success message v1
- etc.

## Tracking in recordStat

```typescript
// bin/create-nx-workspace.ts lines 274-285
await recordStat({
  nxVersion,
  command: 'create-nx-workspace',
  useCloud: parsedArgs.nxCloud !== 'skip',
  meta: [
    messages.codeOfSelectedPromptMessage('setupCI'),        // Preset flow prompt
    messages.codeOfSelectedPromptMessage('setupNxCloud'),   // Preset fallback prompt
    parsedArgs.nxCloud,                                     // User's choice (yes/skip/github/etc)
    rawArgs.nxCloud,                                        // Raw CLI arg
    workspaceInfo.pushedToVcs,                             // VCS push status
  ],
});
```

**Note**: This currently tracks `setupNxCloud` but NOT `setupNxCloudSimple`. This means:
- ✅ Preset flow prompt variants are tracked
- ❌ Template flow prompt variants are NOT tracked (potential gap)

## Summary

The **meta property** in the Cloud connection is the **success message variant code** (template-cloud-connect-v1/v2/v3), which is:

1. Randomly selected when the workspace creation completes
2. Passed to `createNxCloudOnboardingURL` as the `code` parameter
3. Embedded in the Cloud connection URL
4. Used by Nx Cloud to track which success message drove the user to connect
5. Used for A/B testing analytics to optimize conversion rates

This is separate from the prompt variant tracking in `recordStat`, which tracks which initial question was shown to the user.

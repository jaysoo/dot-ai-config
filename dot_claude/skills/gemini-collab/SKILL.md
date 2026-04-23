---
name: gemini-collab
description: "Collaborate with Gemini CLI for deep codebase research, reviews, and brainstorming. Use this to delegate tasks that require extensive file searching, multi-step analysis, or a 'second opinion' from Gemini's specialized agents."
---

# Gemini CLI Collaboration Skill

This skill allows Claude to delegate complex, research-heavy, or "grounded" tasks to the Gemini CLI. Use this when you want Gemini to explore the codebase autonomously and report back with verified findings.

## How to Delegate to Gemini

Use your shell tool to execute the `gemini` command in **Headless Mode**.

### 1. Code Review & Auditing

Delegating a review ensures a rigorous check against the actual codebase state.

```bash
gemini --prompt "Review the current staged changes. Focus on potential memory leaks in the aggregator and verify that all new MongoDB queries have corresponding indexes." --headless --approval-mode yolo
```

### 2. Implementation Brainstorming

Use Gemini to generate and verify ideas based on existing patterns.

```bash
gemini --prompt "Brainstorm three different approaches for implementing the new 'Project Analytics' dashboard. For each approach, identify which existing UI components in 'libs/nx-cloud/feature-analytics' can be reused." --headless --approval-mode yolo
```

### 3. Deep Research & Investigation

Offload the "heavy lifting" of tracing complex logic or dependencies.

```bash
gemini --prompt "Trace the entire lifecycle of a 'task-retry' event. Start from the runner's emission and follow it through the API to the database persistence layer." --headless --approval-mode yolo
```

## Protocol for Claude

- **Approvals:** Use `--approval-mode yolo` to allow Gemini to work autonomously without pausing for manual tool confirmations.
- **Context:** Always provide specific file paths or project names in the prompt to help Gemini focus its research.
- **Verification:** When Gemini returns its findings, treat them as high-signal input to your own decision-making process.
- **Worktrees:** For tasks involving code generation or refactoring experiments, add the `--worktree` flag to keep your current working directory clean.

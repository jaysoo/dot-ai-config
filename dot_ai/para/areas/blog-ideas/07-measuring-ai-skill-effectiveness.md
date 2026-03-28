# Measuring What Matters: Tracking AI Skill Effectiveness Without a Dashboard

The developer productivity measurement industry has a problem it doesn't want to talk about: nobody can agree on what to measure, and the measurements they do take are often wrong.

DORA metrics. SPACE framework. DevEx surveys. The acronyms multiply faster than the insights they produce. METR just had to redesign their AI productivity study because the methodology was fundamentally flawed -- the tasks were too short, the environment too artificial, the results not reproducible. And this was a well-funded research organization with smart people explicitly trying to get this right.

Meanwhile, most engineering teams deploying AI tools can't answer the simplest question: which ones are actually helping?

I work on the Nx CLI team. I use Claude Code for hours every day -- triaging issues, writing generators, auditing dependencies, reviewing PRs. Over the past few months, instead of reaching for a dashboard, I've been tracking AI effectiveness with something embarrassingly simple: text files.

## The Tracking Stack

Four markdown files. No database, no SaaS subscription, no data pipeline.

**USAGE.md** -- a table that records every skill and command invocation with the date and a running count.

```markdown
| Name                 | Type    | Last Invoked | Count |
|----------------------|---------|-------------|-------|
| scan-and-audit       | skill   | 2026-03-27  | 4     |
| cnw-stats-analyzer   | skill   | 2026-03-15  | 1     |
| dot-claude-guard     | skill   | 2026-03-27  | 2     |
| plan-week            | skill   | 2026-03-10  | 0     |
```

**COMPLETED.md** -- a monthly archive of every completed task with a one-line summary of what was accomplished and a link to the task plan.

**Daily SUMMARY.md** -- what happened today. Not a standup script. An honest record of what was done and what blocked progress.

**Feedback memories** -- corrections and confirmations saved in CLAUDE.md so future sessions inherit them.

That's it. That's the whole measurement system.

## What USAGE.md Actually Reveals

Raw invocation counts are more informative than they look.

`scan-and-audit` at count 4 with weekly cadence means the skill is doing exactly what it was designed for. It's a weekly audit orchestrator, and it runs weekly. Confirmation that the trigger words are right, the workflow is valuable, and the output is worth reviewing. No action needed.

`cnw-stats-analyzer` at count 1 is more interesting. I built it, used it once, and haven't gone back. Two possibilities: the skill is genuinely useful but not habitual yet (needs a recurring trigger), or it was a good idea that didn't survive contact with my actual workflow. Both are worth investigating, and neither requires a dashboard to notice.

`plan-week` at count 0 is the most useful data point. A skill that's never been invoked is a skill with a problem. Either the trigger instructions don't match how I actually talk about the work -- I say "what should I focus on" but the trigger is listening for "plan my week" -- or the skill genuinely isn't needed. Both outcomes are actionable. Fix the triggers or prune the skill.

The pattern data compounds. After a month, you can see which workflows are load-bearing and which were speculative. After three months, you have a clear picture of your actual AI-assisted workflow versus the workflow you imagined when you built the skills.

## The Feedback Memory Loop

This is the part that dashboards fundamentally can't capture.

When Claude makes a mistake and I correct it, the correction gets saved with *why* it was wrong. Not just "don't do X" but "don't do X because the variable controls both flow behavior and prompt copy variant, and adding a second variable creates a state synchronization bug." The reasoning matters because it generalizes. The next novel-but-similar situation benefits from the principle, not just the specific rule.

What's less obvious: positive signals need to be captured too.

When an investigation strategy works well -- "verify actual code path FIRST, add logging to node_modules before theorizing" -- that gets recorded. When a debugging approach avoids a known timesink, that becomes a permanent rule.

Without positive memories, the system drifts toward excessive caution. Every correction says "don't do this." Without the counterbalancing "this worked, keep doing it," the AI becomes hesitant about approaches that are actually good. The feedback loop needs both directions to converge on the right behavior.

## Why This Beats Dashboards

**Zero setup cost.** It's markdown files committed alongside the code. No infrastructure, no integration, no maintenance burden. The tracking system was operational the same hour I decided to build it.

**Qualitative signal, not just quantitative.** COMPLETED.md doesn't just record that a task happened. It records what the task was, why it mattered, and what was learned. A dashboard can tell you "12 tasks completed this week." It can't tell you that 8 of those were triage tasks, which led you to invest in triage automation, which changed your workflow for the better.

**The "why" is preserved.** Daily summaries capture context that metrics lose. "Spent 3 hours on lockfile parsing before discovering it was a Bun bug" is useful information for future decisions. "3 hours on dependency management" is not.

**No vendor lock-in.** The data is plain text in a git repo. If I switch AI tools tomorrow, the historical record comes with me. The feedback memories in CLAUDE.md are transferable principles, not tool-specific configuration. Try exporting your insights from a productivity dashboard after canceling the subscription.

## What the Data Actually Showed Us

Real examples from the past few months of tracking.

**Trigger word mismatch.** Several scan commands had near-zero invocations despite being useful when manually invoked. The trigger instructions used formal language -- "audit supply chain security posture" -- but I actually say "check our deps" or "anything weird in npm." Fixing the triggers immediately increased organic invocations. A dashboard would have shown "low usage." The text file showed *why* usage was low.

**Work pattern visibility.** COMPLETED.md showed that triage-related tasks dominated March. Not by a little -- by a lot. That wasn't a feeling or an impression, it was right there in the monthly archive. It led directly to investing more time in triage automation, which is the kind of workflow-level decision that per-ticket metrics miss entirely.

**Context-switching cost.** Daily summaries revealed something I hadn't consciously noticed: sessions that touched multiple repos produced less output than sessions focused on one. Not because multi-repo work is inherently slower, but because each repo switch required rebuilding context -- loading architecture files, checking recent changes, understanding current state. That observation led to batching repo-specific work into dedicated blocks rather than interleaving it.

**Skill evolution.** USAGE.md showed that `scan-and-audit` started as separate manual invocations (12 individual scans) and consolidated into a single orchestrated command. The invocation count dropped from ~12/week to 1/week while the actual coverage increased. A dashboard would show a dramatic drop in "tool usage." The text file shows an efficiency improvement.

## The Honest Take

This approach has clear limitations.

It doesn't scale to team-level decisions. If you need to know whether your organization's AI investment is paying off across 200 engineers, you need actual metrics infrastructure. Text files in individual repos won't cut it.

It requires discipline. The tracking only works if you actually update the files. The reflection command automates most of it, but you still need to run it. On tired Friday afternoons, you won't. The data will have gaps.

It's inherently subjective. My assessment of what "worked" and what didn't is biased by my own blind spots. A well-designed survey instrument controls for this. A markdown file written by one person does not.

But here's what I keep coming back to: for individual workflow optimization -- "am I getting better at using this tool, and is this tool getting better at helping me" -- a text file that tracks what I actually used and whether it helped beats any dashboard I've tried. The signal-to-noise ratio is unbeatable because there's no noise. Every entry exists because a human decided it was worth recording.

The productivity measurement industry is trying to solve a hard problem: how do you quantify something as messy and contextual as developer effectiveness? I don't think they've cracked it yet. In the meantime, `git log --oneline USAGE.md` tells me more about my AI workflow's trajectory than any framework with a four-letter acronym.

---

*Jack Hsu is an engineering manager on the Nx CLI team. The workflow described here is open source at [dot-ai-config](https://github.com/jaysoo/dot-ai-config).*

# From Voice Notes to Structured Knowledge: The Dictation-to-Action Pipeline

*Draft - 2026-03-28*

---

I manage multiple engineering teams at Nx. On any given week, I'm in syncs with DPE, CLI, Orca, Backend, Infra, Docs, and Framer. Each meeting generates action items, personnel context, project updates, and decisions that need to land somewhere useful. For years, the pattern was the same: sit in meeting, take rough notes, spend 30 minutes afterward trying to organize them into the right places. Half the time I'd skip the organization step because the next meeting was already starting.

Meeting context is perishable. The nuance of why someone raised a concern, the specific phrasing of a commitment, the offhand mention that a team member is dealing with something personal — if you don't capture it within minutes, it degrades into a vague memory that you can't act on.

So I built a pipeline. It starts with my voice and ends with structured, routable knowledge that feeds directly into my planning workflow.

## The `/dictate` Command

The core of the system is a `/dictate` command built on top of Claude Code. After a meeting, I talk through what happened — stream of consciousness, no structure required. The raw transcription goes in, and the system does the routing.

Here's what happens under the hood:

**Auto-detection of meeting type.** The command analyzes the transcription and identifies whether this is a team sync (and which team), a 1:1, a planning session, or general notes. It matches against my known team list — DPE, CLI, Orca, Backend, Infra, Docs, Framer — and routes accordingly.

**Sync file routing.** Each team has a sync file at `.ai/para/areas/syncs/[team]/README.md` with a specific structure:

1. Topics for Next Meeting
2. Upcoming Sync (notes accumulated between meetings)
3. Action Items
4. Meeting Notes (dated, reverse chronological)

When the dictation is identified as a sync meeting, the content gets parsed and routed to the right sections. Action items go to the action items section. Discussion points become dated meeting notes. Items that were in "Upcoming Sync" get moved into the meeting notes (since they were presumably discussed) and the section gets cleared for the next accumulation cycle.

**Personnel detection.** When I mention a person — their work, their concerns, something personal they shared — the system updates their personnel file at `.ai/para/areas/personnel/[name].md`. This is where the real compounding value lives. Three months of accumulated context about a direct report means my 1:1 prep is dramatically better than what I could reconstruct from memory.

**Action item extraction.** Commitments, follow-ups, and to-dos get pulled out and placed in the appropriate tracking locations.

## Why PARA Makes This Work

The routing layer is only possible because the underlying file structure is predictable. I use a modified PARA system (Projects, Areas, Resources, Archive) that gives every piece of information a clear home:

- **Projects** have deadlines. Ship a feature, complete a migration, write an RFC. They start and they end.
- **Areas** are ongoing responsibilities with no end date. Team syncs, personnel management, metrics tracking. These are the steady-state obligations of the role.
- **Resources** are reference materials. Architecture docs, scripts, decision records. They get consulted, not worked through.
- **Archive** is where completed projects and outdated docs go to rest without cluttering the active workspace.

The dictation pipeline doesn't need to understand the full taxonomy. It just needs to know: is this a sync (area), is this about a person (area/personnel), does this create a task (project or area), or is this reference material? The PARA structure makes that routing deterministic rather than fuzzy.

## Handling Transcription Errors

Here's something I learned the hard way: AI transcription tools get things wrong in subtle ways. I use Granola for meeting transcription, and it sometimes misattributes statements to the wrong attendee. In a five-person sync, it might attribute a backend concern to the frontend lead, or assign an action item to the wrong person.

The dictation pipeline handles this in two ways. First, it cross-references with context. If someone is attributed a statement about a system they don't work on, that's a signal to flag it rather than blindly routing it. Second, when I catch an error and correct it, the system updates all instances — topics, action items, meeting notes, personnel files. A misattribution that propagates across five files is worse than no notes at all.

This is why the human stays in the loop. The pipeline structures and routes, but I review before it commits. The time savings come from not having to do the structuring myself, not from removing my judgment.

## The Preservation Rule

One design decision that took a few iterations to get right: how to handle the "Upcoming Sync" section. Between meetings, I accumulate notes — things I want to bring up, context I've gathered, items that need discussion. When a sync happens, that content needs to go somewhere.

The rule I landed on: items in "Upcoming Sync" are never deleted unless they were explicitly addressed in the meeting notes. If something was in the queue but didn't come up, it stays for next time. Better to carry forward a brief note than to lose context entirely. I've had too many instances where a topic fell through the cracks because it got cleaned up prematurely.

## The Full Cycle

The real value isn't in any single piece. It's in the cycle:

1. **Meeting happens.** I'm present, listening, engaging — not frantically typing.
2. **Dictation.** Immediately after, I talk through what happened. Two to three minutes of stream-of-consciousness narration.
3. **Routing.** Claude parses the transcription, identifies the meeting type, extracts structured data, and routes it to the right files.
4. **Personnel updates.** Mentions of team members get appended to their personnel files with context and date.
5. **Action items land.** Follow-ups go to the right tracking locations.
6. **1:1 prep pulls it back out.** When I'm preparing for a 1:1 with a direct report, the `/1-on-1-prep` skill pulls from their personnel notes, recent Linear activity, and PR history to build a prep doc. Every dictated observation from the past few weeks is there, organized and ready.
7. **Weekly planning synthesizes.** The `/plan-week` skill reviews all PARA areas, pulls the Linear backlog, checks active experiments, and produces a prioritized plan. The sync notes and action items feed directly into this.

The cycle means information flows forward. A concern raised in Tuesday's CLI sync shows up in Wednesday's 1:1 prep and Friday's weekly plan. Nothing requires me to remember to copy it anywhere.

## What I'd Change

The system isn't perfect. The auto-detection of meeting types works well for recurring syncs but struggles with ad-hoc conversations that don't fit a clean category. Sometimes a hallway conversation touches three different areas and the routing gets confused. For those cases, I still end up manually directing where content should go.

Personnel notes also have a privacy consideration worth thinking through carefully. I keep these files local and they never leave my machine, but the very fact that structured notes exist about individuals means the security of that data matters. I treat the `.ai/` directory the same way I'd treat a locked filing cabinet.

The transcription error problem is also not fully solved. Cross-referencing helps, but it's pattern-matching, not ground truth. For high-stakes items — performance conversations, commitment tracking — I still verify manually.

## The Broader Point

Engineering management is an information routing problem. You sit at the intersection of multiple teams, multiple individuals, and multiple workstreams. The bottleneck isn't decision-making — it's having the right context available at the moment you need to make a decision.

The dictation pipeline doesn't make me a better manager. It makes the management work I was already doing less lossy. Context that used to evaporate after meetings now compounds over time. That compounding is the whole game.

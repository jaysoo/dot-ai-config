# Encoding Team Knowledge into AI Skills: Management Practices as Executable Code

Every engineering manager has a playbook. How to prep for 1:1s. How to spot an overloaded team member before they tell you. How to give recognition that lands. How to plan capacity across multiple teams without a spreadsheet turning into a second job.

These playbooks live in our heads. They're built from years of pattern matching, mistakes, and hard-won instincts. And they're almost never written down. When a manager changes roles, the playbook walks out the door with them. The next person starts from scratch, rediscovering the same patterns over the same painful months.

I manage multiple engineering teams on the Nx platform -- CLI, Cloud, DPE, Docs. I spend a significant chunk of my week on the human side of engineering: 1:1s, capacity planning, project health checks, recognition. Over the past several months, I've been encoding these management practices as executable AI skills. Not replacing judgment. Making sure I have the right information to exercise it.

## The /1-on-1-prep Skill

The difference between a useful 1:1 and a status update is preparation. Before I built this skill, my prep was: skim my notes from last time, maybe check Linear, hope I remember what we talked about three weeks ago.

Now I run `/1-on-1-prep <name>` and it pulls from multiple sources:

**Personnel notes** (`.ai/para/areas/personnel/[name].md`): These capture things most managers track mentally but never write down. Location, family context, career goals, strengths, development areas, food preferences for team events. Previous 1:1 notes with dated entries and action items. The kind of context that makes the difference between "how's the sprint going" and "last time you mentioned wanting to lead a project -- I have something that might fit."

**Linear data**: Recent completed work, open issues, anything marked blocked. The skill queries their assigned items across all teams they contribute to.

**GitHub activity**: Recent PRs, pending reviews, review comments given and received.

The output is a structured prep doc: topics to discuss, action items to follow up on from last time, things to celebrate. It takes about 10 seconds to generate what used to take 15 minutes of context-gathering across four different tools. More importantly, it catches things I would have missed. A PR sitting in review for two weeks. A spike in blocked items. A quiet streak of contributions that deserved recognition.

## The /kudos Skill

Recognition is one of the highest-leverage management activities and one of the easiest to let slip. You notice good work in the moment, intend to call it out, and then three meetings later it's gone.

The `/kudos` skill works in two modes. **Manual capture**: when I see something worth recognizing, I run the skill and it records the person, the behavior, and which company value it maps to. Simple. But the more interesting mode is **automated discovery**.

The skill queries Linear for completed high-impact work, Pylon for customer-facing contributions, and Notion for documentation and knowledge-sharing efforts. It surfaces things like: someone resolved 4 critical customer issues this week, or someone's PR review caught a regression before it shipped, or someone quietly updated the onboarding docs after they struggled with them.

These feed into brag docs, promotion cases, and team celebrations. The automated discovery is the key differentiator -- it catches the contributions that happen quietly, outside your direct line of sight. In a multi-team setup, that visibility gap is real. You can't attend every standup. You can't read every PR. But you can make sure nothing meaningful goes unrecognized.

## The /audit-capacity Skill

Capacity planning across multiple teams is where spreadsheets go to die. I run `/audit-capacity` monthly, and it analyzes team capacity via Linear data across all engineering teams.

It checks for:
- **Overloaded individuals**: anyone with too many in-progress issues simultaneously
- **Overlapping project leads**: single points of failure where one person is the lead on multiple active projects
- **Overdue items**: work that's slipped its target date without being rescheduled
- **Unassigned work**: issues in active cycles with no owner

The output is a capacity report organized by team, flagging specific risks. The goal is catching problems before they become crises. A person being overloaded for a week is normal. Being overloaded for a month is a management failure. The skill makes the slow-building problems visible before someone has to tell you they're drowning.

## The /audit-project-health Skill

Every engineering org has zombie projects. Work that was 80% done six months ago and somehow never finished. Projects where the milestone was hit but a dozen open issues linger in the backlog. Initiatives that started with a clear scope and have been quietly accumulating "just one more thing" ever since.

The `/audit-project-health` skill identifies:
- **Long-running projects without clear exit criteria**: if a project has been active for 3+ months and has no target date, it gets flagged
- **Zombie projects**: milestone marked complete but open issues still assigned to the project
- **Scope creep**: issue count growth over time that suggests the project is expanding, not converging

This is the kind of analysis that's straightforward in theory but nobody does because it requires pulling data from multiple places and doing the math. The skill does the math.

## The /plan-week Skill

Monday mornings used to mean 30 minutes of context reconstruction. What was I working on? What's due? What did I promise to follow up on?

The `/plan-week` skill reviews all PARA areas by priority, pulls the Linear backlog, checks active experiments and commitments, and produces a prioritized action plan. It has a mid-week refresh capability for when priorities shift, which they always do.

The output is concrete: these are your 3 priorities this week, these are the follow-ups you owe people, these are the decisions that need to be made. It doesn't decide for me. It makes sure nothing falls through the cracks between Friday's optimism and Monday's reality.

## Real Impact

These aren't theoretical. Here's what they've caught on the Nx team:

**Prevented burnout**: The capacity audit flagged a team member who was consistently overloaded across 3 concurrent projects. The issue wasn't visible in any single project view -- each project lead thought they had reasonable allocation. The cross-team view showed the real picture. We redistributed before it became a problem.

**Unblocked stale work**: During a 1:1 prep, the skill surfaced a PR that had been sitting in review for two weeks. It wasn't blocked in the dramatic sense -- no red flags, no angry comments. Just lost in the noise. We unblocked it during the meeting because the prep doc put it in front of us.

**Recognized invisible contributions**: The kudos discovery found 3 community contributions from a team member that deserved recognition but happened quietly. Documentation fixes, thoughtful issue responses, a helper script shared in Slack. The kind of work that builds team culture but doesn't show up in sprint demos.

## The OVERVIEW.md Pattern

One small but high-impact pattern: an `OVERVIEW.md` file in the personnel directory that serves as a quick reference table of all direct reports. Name, team, current focus, last 1:1 date. It updates automatically as part of the 1:1 prep workflow.

This sounds trivial. It's not. When you manage across multiple teams, having a single view of "who is working on what and when did I last talk to them" prevents the drift where you accidentally go three weeks without a meaningful conversation with someone. The table makes neglect visible.

## Why This Matters

We've spent the last decade systematizing the technical side of engineering. CI/CD pipelines. Automated testing. Infrastructure as code. Deployment strategies. Monitoring and alerting. These are solved problems -- not easy, but understood. We have playbooks, and those playbooks are executable.

The human side of engineering management is still largely manual. Prep for meetings by skimming old notes. Track capacity in your head. Notice recognition opportunities if you happen to be looking at the right time. Catch project health issues when someone raises a flag. Plan your week from memory and vibes.

These skills don't replace management judgment. They don't make decisions about who to promote, which project to cut, or how to handle a difficult conversation. What they do is ensure you have the right information at the right time to make those calls well.

The playbook in your head is valuable. But a playbook that's executable, repeatable, and doesn't walk out the door when you change roles -- that's an organizational asset. It means the next manager inherits not just a team, but a system for understanding that team from day one.

Management practices as code. It's the last frontier of engineering automation, and it might be the one that matters most.

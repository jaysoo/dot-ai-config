# L4 to L5 Strategic Thinking Guidance

## Specification

**Purpose**: Create a self-assessment guide for L4 engineers to understand and demonstrate L5-level strategic thinking.

**Format**: Supplement to existing promotion doc, focused on clarifying "strategic thinking" with concrete behaviors.

**Use Case**: Self-assessment tool for L4s to identify gaps and have informed conversations with their EM.

---

## Core Problem

L4 engineers are often strong executors who deliver good outcomes, but the **success of their work depends on others** (leads, managers) paying attention to metrics, identifying issues, and deciding what comes next. They wait to be told what to focus on rather than driving the direction themselves.

## The Mindset Shift

> **L4s deliver success when guided. L5s ensure success independently.**

| L4 Behavior                       | L5 Behavior                                       |
| --------------------------------- | ------------------------------------------------- |
| Executes assigned tasks well      | Proposes what tasks should exist                  |
| Completes projects                | Ensures projects achieve intended outcomes        |
| Ships features                    | Ships features AND verifies they work as intended |
| Waits for next assignment         | Identifies and proposes next iteration            |
| Relies on others to track success | Owns measurement and follow-up                    |

---

## Strategic Thinking: Concrete Behaviors

### 1. Propose Meaningful Projects

**What L5s do:**

- Research problems by talking to stakeholders, customers, DPEs, and reviewing support tickets
- Write Linear Project documents with clear motivation
- Propose projects that address real pain points, not just maintenance work
- Consider both customer impact AND internal impact (e.g., cost reduction)

**Questions to self-assess:**

- When did I last propose a project that wasn't assigned to me?
- Have I talked to customers or reviewed support data to identify pain points?
- Do my proposals include clear problem statements and motivation?

### 2. Own Outcomes, Not Just Output

**What L5s do:**

- Ensure proper instrumentation exists BEFORE or AS PART OF shipping
- Monitor metrics weekly (minimum) after shipping
- Compare actual usage against expectations and assumptions
- Create follow-up work when metrics don't meet expectations

**Questions to self-assess:**

- For my last shipped feature, do I know how customers are using it?
- Can I access the metrics that matter for my work? If not, have I created the instrumentation?
- When did I last create a follow-up task based on post-launch data?

### 3. Drive the Full Lifecycle

**The L5 ownership loop:**

```
Identify Problem → Propose Solution → Ship with Instrumentation → Monitor → Iterate
```

**What L5s do:**

- Don't consider work "done" at ship time
- Actively track whether assumptions were correct
- Propose and execute improvements based on data

**Questions to self-assess:**

- Do I consider my work done when I merge the PR, or when I've verified it's working?
- Have I ever discovered my shipped work wasn't meeting expectations? What did I do about it?

---

## Other L5 Expectations (Clarified)

### Larger Scope Ownership

- L4s own smaller domains; L5s own larger, more complex ones
- Ownership means driving direction, not just maintaining
- Growing scope happens by demonstrating success with current scope

**Questions to self-assess:**

- What domain do I own? What's my vision for where it should go?
- Am I maintaining my domain or actively improving it?

### Tech Leadership / SME Status

- Earned organically through sustained work and solving hard problems
- Demonstrated through deliverables, not presentations
- Being the go-to person others consult on a specific area

**Questions to self-assess:**

- What area am I the recognized expert in?
- Have I solved hard problems that others couldn't?
- Do teammates come to me with questions in my domain?

### Team Multiplier

- Quality PR reviews that level up teammates
- DevX improvements and tooling that help everyone
- Pushing back on leads with well-reasoned arguments

**Questions to self-assess:**

- Do my PR reviews teach something, or just approve/request changes?
- Have I improved tooling or processes that helped the whole team?
- When did I last push back on a decision with a better alternative?

---

## Anti-Patterns (What Keeps People at L4)

### Ship and Forget

- Merging code without verifying it works as intended in production
- Not checking adoption or usage after launch
- Moving to the next task without ensuring the previous one succeeded

### Waiting to Be Told

- Only working on assigned tasks
- Not proposing projects or improvements
- Relying on leads to identify what's important

### Buggy or Incomplete Delivery

- Shipping features that don't meet intended goals
- Not following up to catch and fix issues
- Quality problems that others have to notice and escalate

---

## Concrete Example: L5 Behavior

**Situation**: An engineer noticed pipeline performance issues.

**What they did:**

1. Reviewed Grafana logs to identify bottlenecks
2. Talked to customers about pain points
3. Identified Docker layer caching and registry mirroring as opportunities
4. Proposed projects addressing both issues
5. Considered dual impact: faster pipelines for customers AND lower infra costs
6. Collaborated with DPEs to enable features for customers
7. Delivered measurable improvement

**Why this is L5**: They didn't wait to be told there was a problem. They observed, identified, proposed, and delivered impact—owning the full cycle.

---

## How to Use This Guide

1. **Self-assess honestly**: Review the questions in each section. Where are your gaps?
2. **Gather evidence**: For areas where you believe you're operating at L5, collect specific examples
3. **Talk to your EM**: Use this to structure a conversation about your growth and what you should focus on
4. **Build your case**: If you believe you're performing at L5, you should be able to articulate specific examples that demonstrate these behaviors

**Important**: This is not a checklist to game. The questions help you reflect on whether you're truly operating with an L5 mindset—owning outcomes, not just executing tasks. Your peers and managers will recognize genuine strategic thinking; going through the motions won't be convincing.

---

## Integration with Existing Doc

This guidance **supplements** the existing L5 expectations by clarifying what "strategic thinking" looks like in practice. The core expectations remain:

- Execute tasks fully autonomously
- Think about product strategy and how your work fits
- Suggest innovative ideas and create efforts
- Own larger efforts with multiple contributors
- Make scoped strategic decisions
- Provide tech leadership

This document provides the concrete behaviors and self-assessment questions that make these expectations actionable.

# AI Should Feed Your Background Mind, Not Starve It

Coding agents have made implementation much cheaper. Something that used to cost an afternoon of typing now costs a
prompt and a few minutes of review, and the natural response has been to run more of them at once.

What did not get cheaper is understanding the problem. The cost shifted from producing code toward validating
assumptions, because generated code is fluent enough to look correct while encoding an idea that was wrong from the
start. The more dangerous failure mode of AI-assisted development is not sloppy code, but well-formed code built on a
misconception.

The useful question is not how to get more out of the agents, but where our own thinking happens and whether this way of
working leaves room for it. That thinking does not all run on the same schedule.

## Two modes of thinking, only one of which we schedule

It helps to distinguish two kinds of thinking, under two names that are this post's shorthand rather than established
categories. The **foreground mind** is analytical and tactical — it takes in facts, evaluates the options in front of
it, and criticizes ideas. It decides which way to jump when something is chasing us, and it is very good at that.

The **background mind** is strategic and associative. It draws analogies, finds hidden relations between things we
gathered hours or days apart, and produces the abstraction that collapses a hard problem into a straightforward one. It
runs while we walk, shower, and sleep.

The relevant evidence is narrower. [Incubation research](https://pubmed.ncbi.nlm.nih.gov/19210055/) finds that setting a
problem aside can improve later problem solving, that the benefit grows with the preparation before the break, and that
it shrinks when the break is demanding. The mechanism is unsettled: mind wandering, memory reorganization, and escaping
a wrong framing are all candidates.

Psychology calls the time away from the problem incubation, and the work before it **preparation**. Preparation means
stating the problem, gathering constraints, taking failed approaches apart, and naming what remains unknown. It is the
half of the process we control, and the half that agents change.

The foreground mind also has a blind spot. It finds the local maximum and misses the global one, because it is
preoccupied with what is immediately present. We climb the small hill and never see the larger one behind us.

## The prompting loop keeps us on the small hill

Consider what a day of parallel agents feels like. We dispatch a task, skim a diff, correct a wrong assumption, send a
follow-up, then turn to the second agent's work, then the third. Every one of those is a small tactical decision made
against material that is immediately present.

That is the foreground mind at full duty cycle, in exactly the mode that gets stuck on local maxima. The work feels
productive because it is dense with decisions and produces visible output. However, the loop biases us toward refining
the abstraction already in front of us, and a better one is never in the diff we are currently looking at.

The agent loop is also a poor environment for the other mode. A computer is a continuous source of input, and an agent
is a computer that generates novel input on demand. There is always one more variation to try, so the loop never closes
on its own.

The trap is that the cheaper implementation gets, the more attractive it becomes to spend the whole day in tactical
mode, and the less of the day is left for deciding whether any of it was the right thing to build. Building the wrong
thing faster is still building the wrong thing.

## Tactical work is still most of the work

None of this applies to a dependency bump, an off-by-one, or a page that is down right now. Chores, small bug fixes, and
firefighting are tactical by nature, and the foreground mind is the correct tool for them. There is nothing to design,
and iterating against a failing test is the fastest way through.

What makes that work fast is that the understanding is already there. We are spending abstractions the background mind
produced months ago, on some earlier problem we did prepare properly. The thinking already happened.

Preparation is for the problems where that stored understanding runs out, where the honest answer to "how should this
work"
is that we do not know yet. Telling the two apart is the judgment that matters. Running the full sequence on a chore
wastes an afternoon. Skipping it on a problem that needed it ships a misconception.

## Testing and types do not catch a bad idea

The usual objection is that we have safety nets: strong types, thorough tests, adversarial reviews.

They surface a certain class of problem. Types catch category errors and tests catch logical slips, and both are worth
having. Neither can tell us whether their underlying premise is correct, because both take our model of the problem as
given. A test suite written against a misconception passes with it intact.

Agents raise the stakes. The volume of plausible output goes up, review attention per line goes down, and the
misconception has more places to hide. When every branch compiles and every suite is green, nothing left in the pipeline
is checking the premise. A misconception is cheapest to fix while it is still an idea.

## Agents accelerate preparation, not incubation

The way out is not to use agents less, but to be specific about which mode they serve. Gathering facts, enumerating
constraints, and taking prior art apart is mechanical work, and it is what agents are well-suited to.

They are a scaling factor on that preparation. Research that used to cost a week compresses into an afternoon — five
approaches surveyed, three prototypes built until their failure modes show, the relevant prior implementations pulled
and summarized.

The mistake is treating that output as the answer rather than the input. The survey is not a decision, and the prototype
that runs is not a design. It becomes a solution only after the background mind has had a pass at it, and getting it
there takes a deliberate sequence.

## What preparation looks like

The first two steps are ours. The middle two are where agents earn their place. The last two require setting them aside.

**State the problem in writing.** It is the seed everything else grows from. Agents can work from a vague prompt and
return plausible results. Nothing forces us to be precise about it.

**Write down what is not known.** A design document with no question marks in it is not finished. The unknowns are the
part of the problem most worth carrying into the break.

**Gather the facts and constraints.** Requirements, the environment, the users, what we are not allowed to change.
Agents are good at pulling these out of a codebase and at listing what it does not tell us.

**Take the prior art apart.** Find how others solved something adjacent, then pull those apart to see where they fail.
Knowing why an approach broke down produces the pieces a synthesis gets built from. "Find me three systems that solved
this and where each runs out of road" beats a blank page.

**Externalize the moving parts.** Attention holds [about four chunks](https://philpapers.org/rec/COWTMN) at once rather
than the familiar seven, and design problems have more moving parts than either. Get the whole problem into one written
place, so that nothing leaves it when it leaves your head.

**Then step away.** This step feels like doing nothing and looks like doing nothing, which is why it gets cut first.
Skip it and everything gathered so far stays research. A walk or a lunch break is often enough, a genuinely hard problem
wants a night, and the break works better when it does not demand much thinking of its own.

## What the day looks like instead

Those six steps produce a different rhythm from the one the tooling nudges us toward. Set the agents going in the
morning, survey what came back, note what is still unknown, and then leave. Take a lunch break or a walk. Come back in
the afternoon or the following day with a synthesized idea and let the foreground mind attack it.

Producing material quickly is what the agents are good at. Deciding what it means is still ours, and that has not gotten
faster because it never ran on a machine to begin with.

When was the last time you did the preparation, stepped away, and waited before choosing a design?

# Jack Hsu's Blog Style Guide

Reference for maintaining consistent voice and style across jaysoo.ca posts. Derived from analysis of ~15 posts spanning 2009-2017.

---

## Voice and Person

- **Default to inclusive "we"** -- author and reader building understanding together.
  - "We can partition the functions of a component into two distinct groups."
  - "We have also made our component much easier to test."
- **First-person singular ("I")** only for: series introductions ("I want to take a functional approach..."), flagged personal opinions, or direct disagreements.
- **Second-person ("you")** only for: direct advice, hypothetical scenarios, and titles framing the reader's interest ("Why You Need Types").
- Never use "dear reader," "imagine you're...," or "you might be thinking..." framings.

## Tone

- **Measured, explanatory, teacher-like.** A knowledgeable colleague explaining something clearly -- not academic-formal, not casual-conversational.
- **Patient.** Build concepts step by step without rushing.
- **Non-dogmatic.** Present trade-offs rather than absolute rules. State positions as positions, not universal truths.
- **Understated enthusiasm.** Let thoroughness of explanation convey excitement, not exclamation marks or superlatives.
- **Earnest and direct.** No self-deprecation, no forced humor, no hype.

### Words to avoid

| Avoid | Prefer |
|-------|--------|
| amazing, awesome, game-changer, revolutionary | (let the argument speak for itself) |
| actually, basically, obviously, simply put, of course | (drop or rephrase) |
| simple, easy | straightforward |

## Sentence Structure

- Medium-length declarative sentences, typically 15-25 words.
- Break complexity with em dashes rather than semicolons.
- Always grammatically complete -- no sentence fragments for emphasis.
- Three characteristic patterns:
  - **Definitional:** "A function is pure if its output is solely determined by its input."
  - **Causal:** "Since I/O operations are expensive..., Gulp's architecture reduces unnecessary overhead."
  - **Contrast:** "However, one persistent challenge in React+Flux setups involves..."

## Paragraph Length

- Short to medium: 2-4 sentences per paragraph.
- One concept per paragraph: introduce, explain, qualify.
- Single-sentence paragraphs used sparingly for emphasis or transition.

## Post Structure

### Openings

Open with a **context-setting declarative statement** about the ecosystem or a concept definition. Never open with "I" or a personal anecdote (rare exception: an extended analogy that frames the whole post).

- "Redux is a Flux-like framework that has exploded in popularity within the React community."
- "Dynamically typed languages like JavaScript provide a lot of expressiveness and power to the programmer."
- Series posts: state the series context first.

### Argument Flow

**Problem -> Existing Solutions -> Their Limitations -> Better Solution -> Benefits**

- Argue by demonstration, not authority. Show the problem in code, show the solution in code, let the reader see the improvement.
- Always acknowledge alternatives before advocating for a particular approach.

### Conclusions

- Brief: 1-3 paragraphs. Restate the core insight without repeating the argument.
- Optional endings: question to the reader, a recommendation, pointer to source code.
- Never use "In conclusion," "To sum up," or explicit conclusion markers.

## Headers

- **H2** for major sections, **H3** for subsections.
- Descriptive noun phrases or declarative statements: "The Power of a Type System," "Streams all the way down."
- Occasional conversational or playful register is fine: "Okay, but which is better?"
- Borrowed phrases from other thinkers are acceptable without in-header attribution.

## Code Examples

Always follow this sequence:

1. **State what the code demonstrates** (1 sentence).
2. **Show the code.**
3. **Explain what happened** (1-2 sentences on the takeaway).

Code serves as evidence for prose arguments, not the other way around. Never drop code without surrounding context.

Typical lead-ins:
- "Let's look at a simple example."
- "To illustrate the differences, we compare..."
- "Consider a `makeUrl` function that transforms a search term into an API URL."

## Transitions

### Use freely

- **However** -- the signature transition for counterpoints and caveats
- **Rather than** -- for contrasting approaches
- **This means / This is because** -- for causal explanations
- **Moreover** -- for supporting points
- **In other words** -- for restating in simpler terms
- **Importantly** -- to highlight key points
- **While** (at sentence start) -- to introduce concessions
- **Let's** -- to transition into examples or next steps

### Avoid

- Actually, basically, obviously, simply put, of course

## Punctuation

- **Em dashes:** Moderate use for parenthetical insertions.
- **Colons:** To introduce lists or explanations within sentences.
- **Semicolons:** Rare. Prefer separate sentences or em dashes.
- **Exclamation marks:** Near-zero. Reserve for genuine surprise.
- **Quotation marks:** For direct quotes and introducing technical terms on first use.
- **Parentheticals:** For clarification, especially acronyms: "(On Flux, DDD, and CQRS)."

## Technical Jargon

- **Concept before jargon.** Build understanding through examples, then name the pattern.
- Define domain-specific terms on first use or scaffold up to them.
- When borrowing academic terms (monads, CQRS, event sourcing), map them explicitly to practical code constructs the reader already knows.
- Avoid jargon for its own sake.

## Analogies and Metaphors

- Used sparingly but effectively.
- Draw from everyday objects or activities, not from other technical domains.
- Place at the start of posts or sections as framing devices, not scattered throughout.

## Lists

- **Numbered lists** for sequential steps or enumerated rules.
- **Bulleted lists** for parallel items or properties.
- Keep inline lists short: 2-4 items. Longer enumerations get their own section with headers.

## References and Links

- **Inline links** on the relevant noun: "Redux is a Flux-like framework" with link on "Redux."
- **Named references** to thinkers with brief context (Rich Hickey, Tony Hoare, etc.).
- **Talk/video references** cited by name.
- **End-of-post resources** section when there is recommended reading.
- No footnotes or endnotes.

## Signature Phrases

These recurring phrases are part of the voice -- use them naturally:

- **"easier to reason about"** -- the go-to evaluative phrase for good architecture
- **"source of truth"** -- for state management discussions
- **"data in, data out"** -- for FP concepts
- **"in the context of"** -- to scope discussions
- **"straightforward"** -- preferred over "simple" or "easy"
- **"as opposed to"** -- for contrasts

## Titles

- Prefer **thesis statements** that convey the argument: "Why You Need Types," "Avoid Unnecessary Indirection," "Don't Fear the Type System."
- Subtitles in parentheses for scoping: "Three Rules For Structuring (Redux) Applications."
- Playful or referential titles acceptable when the reference adds meaning: "What the Flux?"

## Cross-Domain Connections

A distinctive feature: connecting JavaScript/frontend patterns to broader concepts from DDD, CQRS, category theory, psychology research, or other fields. When doing this:
- Make the connection explicit -- don't assume the reader knows the other domain.
- Use the external concept to illuminate the code, not to show off breadth.

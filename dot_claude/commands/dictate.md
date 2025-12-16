# Dictate

YOU are a NOTETAKER.

I'll send over a single prompt dictated through a mic.

YOU must format what I said with correct grammar, paragraphs, headers, etc.

The markdown file goes into a folder under the current project called `.ai/yyyy-mm-dd/dictations/notes.md`, where the datestamp and "notes" are replaced by today's date and the title of the note.

Pay attenion to the project context, and pull as much information as you can from the src code, docs folder, README.md, etc.

The output must be shareable with others, but doesn't have to be formal.

## Special Document Types

### 1:1 Meetings (One-on-Ones)

If the dictation mentions a **1:1**, **1-on-1**, **one-on-one**, or similar with a specific person:

1. Create the dictation file as normal in `.ai/yyyy-mm-dd/dictations/`
2. **Also update the personnel file** at `.ai/personnel/[name].md`:
   - Add a dated entry under the `## 1:1 Notes` section
   - Include key discussion points, action items, and follow-ups
   - Update any personal/professional info mentioned
3. Update `.ai/personnel/OVERVIEW.md` if needed

### Team Syncs

If the dictation mentions a **sync meeting** for one of these teams, update the corresponding sync document:

| Trigger Words | Sync Document |
|---------------|---------------|
| "DPE sync", "DPE meeting" | `.ai/syncs/dpe/README.md` |
| "CLI sync", "CLI meeting" | `.ai/syncs/cli/README.md` |
| "Orca sync", "Orca meeting" | `.ai/syncs/orca/README.md` |
| "Backend sync", "Backend meeting" | `.ai/syncs/backend/README.md` |
| "Infra sync", "Infrastructure sync" | `.ai/syncs/infra/README.md` |
| "Docs sync", "Documentation sync" | `.ai/syncs/docs/README.md` |
| "Framer sync", "Framer meeting" | `.ai/syncs/framer/README.md` |

For sync meetings:
1. Create the dictation file as normal
2. **Also update the sync document**:
   - Add a dated entry under `## Meeting Notes` with format:
     ```markdown
     ### YYYY-MM-DD

     **Updates:**
     - Key updates discussed...

     **Action Items:**
     - New action items...
     ```
   - Update `## Topics for Next Meeting` (remove discussed items, add new ones)
   - Update `## Action Items` section as needed

## Dictation Keywords

Some keywords I might say that might be erroneously dictated are:
- "Nx" - annex, anything, etc.
- Turbo
- Turborepo
- Moonrepo
- ...

^^^ I'll populate this as I find more errors during dictation

**IMPORTANT:**
- This is for software development, tooling, web development, and technical documnentation
- Dictated documents would be drafting a plan for human or AI to consume, so make sure things are not ambiguous
- Content you are not sure about should be called out at the bottom

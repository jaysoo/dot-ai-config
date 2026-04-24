# Brainstorm 

I will tell you an idea, and you will help me think through it and generate a specification of the idea.

Ask me one question at a time so we can develop a thorough, step-by-step specification for this idea. Each question should build on my previous answers, and our end goal is to have a detailed specification I can hand off to a developer. Let’s do this iteratively and dig into every relevant detail. Remember, only one question at a time.

## Idea iteration

- Ask one question at a time
- Ask for clarification
- Ask Gemini to review your question before asking (via the `gemini-collab` skill — shell out to the `gemini` CLI, not an MCP tool)
- Do research on related topics and cite sources
- Think deeply
- Be critical
- Ask Gemini to review your question and my answer to see if there are any other things you missed (via the `gemini-collab` skill)

## When done

When I say "let's wrap up", you should stop the brainstorming session and compile our findings into a comprehensive, developer-ready specification. Include all relevant requirements, architecture choices, data handling details, error handling strategies, and a testing plan so a developer can immediately begin implementation.

If available, ask Gemini for feedback on the spec via the `gemini-collab` skill (shells out to the `gemini` CLI), if there are areas of uncertainty or improvements.

Store the spec file under `.ai/yyyy-mm-dd/specs/idea.md` where `yyyy-mm-dd` is today's datestamp, and `idea.md` should be the name of the spec file.


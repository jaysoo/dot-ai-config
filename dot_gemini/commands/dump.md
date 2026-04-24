# Dump

Please output the strings displayed in Gemini CLI's repl during this session to the `.gemini/logs` folder.
If the `.gemini/logs` folder does not exist, please create it.

## Filename

For naming the file that outputs the strings, use the filename `gemini-code-session-{YYYY-MM-DD_HH-mm-ss}.md`.
Replace the `{YYYY-MM-DD_HH-mm-ss}` part with the time this command was executed, converted to a string in the specified format.

## Output Format

Please output in the following format:

```markdown
# Session Date

- start: {Enter the session start date and time in YYYY-MM-DD_HH-mm-ss format}
- dumped: {Enter the date and time this command was executed in YYYY-MM-DD_HH-mm-ss format}

# Conversation

## 👤 User ({Enter the date and time when input was received from the user in YYYY-MM-DD_HH-mm-ss format})

{Enter the input string from the user}

## 🤖 Gemini ({Enter the time when Gemini CLI began displaying to standard output in YYYY-MM-DD_HH-mm-ss format})

{Enter the string displayed by Gemini CLI to standard output}

Continue entering the contents of the conversation in the same format
```

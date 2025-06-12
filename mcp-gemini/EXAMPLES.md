# Claude-Gemini MCP Usage Examples

## Basic Conversation

```bash
# Start Claude Code
claude

# Ask Gemini a simple question
mcp__gemini-collab__ask_gemini
  prompt: "What is the capital of France?"

# Gemini responds directly in Claude's context!
```

## Code Review Example

```bash
# Have Gemini review your authentication code
mcp__gemini-collab__gemini_code_review
  code: |
    def authenticate(username, password):
        if username == "admin" and password == "password123":
            return True
        return False
  focus: "security"

# Gemini will point out security issues like:
# - Hardcoded credentials
# - Plain text password
# - No hashing
# - etc.
```

## Brainstorming Session

```bash
# Brainstorm startup ideas
mcp__gemini-collab__gemini_brainstorm
  topic: "AI-powered tools for developers"
  context: "Looking for B2B SaaS ideas that solve real developer pain points"

# Gemini provides creative suggestions
```

## Advanced: Collaborative Problem Solving

```bash
# Claude writes code
> Write a Python function to calculate fibonacci numbers

# Claude creates the function...

# Then get Gemini's optimization suggestions
mcp__gemini-collab__gemini_code_review
  code: "[paste Claude's code here]"
  focus: "performance"

# Claude can then incorporate Gemini's feedback!
```

## Temperature Control

```bash
# Low temperature (0.2) for factual, consistent responses
mcp__gemini-collab__ask_gemini
  prompt: "Explain the HTTP protocol"
  temperature: 0.2

# High temperature (0.8) for creative responses
mcp__gemini-collab__ask_gemini
  prompt: "Write a haiku about debugging"
  temperature: 0.8
```

## Real-World Workflow

1. **Claude writes initial code**
2. **Gemini reviews for security/performance**
3. **Claude implements improvements**
4. **Both AIs brainstorm edge cases**
5. **Final optimized solution!**

This creates a powerful AI pair programming experience where both models complement each other's strengths.
---
name: terminal-demo-recorder
description: Help generate terminal demo videos or GIFs using VHS. Use when the user wants to record a terminal session, create a demo for social media/blogs, or mentions "vhs" specifically.
---

# Terminal Demo Recorder (VHS)

Create high-quality terminal demos using VHS. Use this skill to generate `.tape` files and orchestrate video/GIF production.

## Workflow

1. **Understand requirements**: Ask for the commands to run, desired output format (GIF/MP4), and any specific styling (font size, theme).
2. **Generate `.tape` file**: Create a file with the required VHS commands.
3. **Execute VHS**: Run `vhs <file.tape>` to produce the output.
4. **Preview/Verify**: Confirm the output file was created and is correct.

## Quick Start Template

```vhs
Output demo.gif
Set FontSize 22
Set Width 1200
Set Height 600
Set Padding 40
Set Theme "Dracula"

Type "echo 'Hello World!'"
Sleep 500ms
Enter
Sleep 2s
```

## Styling Recommendations for Social Media (Twitter/X)

- **Font Size**: 24-32px (must be readable on mobile).
- **Width**: 1200px.
- **Height**: 600-800px.
- **Format**: `.mp4` is preferred over `.gif` for better compression and quality.
- **Speed**: Use `Set TypingSpeed 50ms` for a natural feel, or `Set PlaybackSpeed 2.0` for long benchmarks.

## VHS Commands

See [vhs-commands.md](./references/vhs-commands.md) for a full list of available commands and settings.

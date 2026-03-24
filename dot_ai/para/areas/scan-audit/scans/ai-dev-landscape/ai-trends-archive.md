# AI Trends

Ongoing tracking of AI/LLM developments, patterns, and learnings.

## 2026 Observations

### DPE Team Tool Adoption (January 12, 2026)

**Source:** DPE Sync Meeting (Jack, Miroslav Jonas, Austin Fahsl, Joshua VanAllen, Steven Nance, Caleb Ukle, Jordan Powell)

**Granola App - Stealth Note-Taking Tool:**
- Mac-only application for automated meeting note-taking
- Currently adopted by: Nic, Ole J, Victor, and others on the team
- Key feature: "Stealth" mode - takes notes without visible indicators
- **Legal Considerations:** Team discussed distinction between:
  - Recording (captures audio/video - stricter consent requirements)
  - Transcription (real-time text conversion - different legal treatment)
- Worth monitoring adoption patterns and any compliance guidance that emerges

**Space Metrics Dashboard:**
- New engineering tracking dashboard being introduced
- Designed for monitoring team/engineering metrics
- Details on specific metrics TBD

**Observations:**
- AI-assisted meeting tools reaching mainstream adoption within engineering teams
- Legal/compliance landscape for AI recording tools still evolving
- Teams self-organizing around tool choices before official policies catch up

---

## 2025 Learnings for 2026

### The Normalization of Deviance in AI

**Source:** [Simon Willison's Year in LLMs](https://simonwillison.net/2025/Dec/31/the-year-in-llms/)

**Key Insight:** Running AI coding agents in "YOLO mode" (auto-confirmation bypass) creates a dangerous normalization pattern. The longer we operate without incident, the more we accept the risk as normal—until a major failure occurs.

**The Challenger Disaster Parallel:**
- Sociologist Diane Vaughan identified "Normalization of Deviance" studying the 1986 Challenger disaster
- Engineers knew about the faulty O-ring for years
- Repeated successful launches led NASA to stop taking the risk seriously
- Security researcher Johann Rehberger argues we're on the same path with LLM security

**Why This Matters:**
- YOLO mode feels like a "completely different product" - faster, more fluid
- Async agents (Claude Code for web, Codex Cloud) run YOLO by default (sandboxed, no personal machine risk)
- No incidents yet ≠ safe
- We may be accumulating risk toward an "AI Challenger disaster"

**Personal Reflection:**
The core tension: agents with confirmation prompts feel tedious, while YOLO mode feels transformative. But each safe run reinforces the belief that it's always safe. Prompt injection attacks, malicious code execution, or credential theft could happen at any time—the fact that it hasn't yet is not evidence it won't.

**Action Items:**
- [ ] Be mindful of creeping risk acceptance in AI tool usage
- [ ] Periodically reassess what "safe defaults" should be
- [ ] Track incidents (personal and industry-wide) to calibrate risk
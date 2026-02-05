# 1:1 - Chau & Jack

**Date:** Thu, 05 Feb 2026

---

### Current Red Panda Team Progress

- Self-healing board and AT Gentex CLI/Monitor CI development ongoing
- Monitor working well in repos with good CI, struggling with NX repo due to slow CI times
- Memory pressure issues causing more tasks assigned to extra large resource class
- MCP tools returning structured content causing "context too long" errors
  - Especially problematic with end-to-end test logs
  - Need to surface relevant log portions vs. providing everything
  - Balancing between select parameters (GraphQL-style) vs. extra calls for task output summary

### MCP Tool Iterations & Feedback

- Initial tool didn't return anything until CI complete (failed/succeeded)
- Updated to return status for in-progress CIs so agents can communicate waiting state
- Limited feedback received so far
  - Auton posted in Red Panda channel
  - Rarest reached out via DM about plugin setup
- Claude plugin setup process problematic
  - Requires marketplace addition, cache folder management for updates
  - Max/Red Panda team waiting for Claude to fix vs. working around

### Career Development Discussion (L5 Path)

- John to schedule regular 1:1s with Chau (Jack will follow up again)
- Jack will continue quarterly check-ins focused on Red Panda work context
- L5 requirements clarification:
  - CI improvements, tooling that helps team communication/regression testing
  - Code reviews with good insights, leveling up teammates
- Chau positioned well for L5, focus on micro-strategy documentation and iteration feedback

### Authentication Ownership Transition

- Chau remains subject matter expert but shouldn't be sole worker
- Ban Dylan and Nicole (Orca Team) should handle most fixes
- Knowledge transfer via existing Loom videos + composed docs
- Chau available for debugging support, especially Grafana analysis

### Process & Testing Challenges

- Adapting to Red Panda sprint commitment model vs. previous flexible approach
- Local testing pain points for self-healing fixes
  - NX API changes with version control updates difficult to test locally
  - Current process: merge → snapshot testing → potential gaps/redeployment
  - Exploring PR environments or improved local testing infrastructure
- Using due dates for capacity management and priority visibility

### Next Steps

- Jack: Follow up with John on scheduling Chau's 1:1s
- Jack: Discuss PR environment possibilities with Steve
- Chau: Document local testing pain points for process improvement discussion
- Chau: Continue iterating on MCP tools and Red Panda features with strategic documentation focus

---

Chat with meeting transcript: [https://notes.granola.ai/t/b1011712-c1aa-493b-bea0-9fa3d8df5238-00demib2](https://notes.granola.ai/t/b1011712-c1aa-493b-bea0-9fa3d8df5238-00demib2)

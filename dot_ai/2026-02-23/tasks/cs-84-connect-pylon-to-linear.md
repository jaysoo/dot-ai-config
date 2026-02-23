# CS-84: Connect Pylon to Linear

- **Linear**: https://linear.app/nxdev/issue/CS-84/connect-pylon-to-linear
- **Project**: Pylon Rollout & Evaluation
- **Milestone**: Ready to Use
- **Created**: 2026-02-23
- **Docs**: https://docs.usepylon.com/pylon-docs/integrations/ticketing/linear

## Goal

Enable the Pylon-Linear integration so support issues from Pylon can be tracked and synced as Linear issues.

## Steps

### 1. Enable the Linear integration in Pylon
- Go to Pylon dashboard -> **App Directory** ([link](https://app.usepylon.com/apps/30127561-7a86-4cb5-bcfa-80c3f143c03b?tab=overview))
- Find the **Linear** integration and set it up
- Authorize Pylon to access the Linear workspace (nxdev)

### 2. Configure team mapping
- In the Linear Details module, map Pylon issues to appropriate Linear teams (Customer Success, Nx CLI, Nx Cloud, etc.)
- Confirm default project/team shows up when creating issues from Pylon

### 3. Test issue creation (Pylon -> Linear)
- **Via Kanban board:** Open a Pylon issue -> Linear Details sidebar -> select team -> click **Create**
- **Via triage channel:** Use "Create Ticket" button -> select Linear project -> confirm AI-generated title

### 4. Test linking existing Linear issues
- Search for an existing Linear issue by keyword or identifier (e.g. `CS-84`)
- Test pasting a Linear issue URL directly

### 5. Verify sync behavior
- Comment on Linear issue -> confirm it appears as internal note in Pylon
- Mark Linear issue as **Done** -> confirm Pylon notifies customer and moves issue to "On You"
- Open linked Linear issue -> confirm Pylon native module is embedded with customer context

### 6. (Optional) Configure Customer Requests
- If needed, configure Pylon to create **Customer Requests** in Linear for aggregated customer demand visibility

## Verification Checklist
- [ ] Linear integration authorized and connected in Pylon App Directory
- [ ] Can create new Linear issue from Pylon issue (Kanban board)
- [ ] Can create new Linear issue from triage channel (if product ticketing enabled)
- [ ] Can link existing Linear issue from Pylon
- [ ] Comments on Linear issues sync as internal notes in Pylon
- [ ] Completing a Linear issue triggers Pylon notification + status change
- [ ] Pylon context module appears on linked Linear issues
- [ ] Team mapping is correct (issues land in right Linear team/project)

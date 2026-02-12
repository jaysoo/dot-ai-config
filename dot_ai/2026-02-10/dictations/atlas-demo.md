# Atlas Onboarding between Aniket and Steven Nance

**Date:** Tue, 10 Feb 2026

**Attendees:** cory@nrwl.io, miro@nrwl.io, austin@nrwl.io, aniket@atlas.so, steven@nrwl.io, caleb@nrwl.io, nicole@nrwl.io

---

### Atlas Platform Overview

- Single inbox for all customer communications
  - Email, Slack, chat widget, Discord, SMS, WhatsApp support
  - Custom inbox organization based on workflow stages
  - Customer timeline view shows full conversation history
- Internal communication features
  - Yellow-highlighted internal notes don't go to customers
  - Switch between customer replies and internal notes
  - Sidebar email conversations with team members

### Slack Integration

- Two types of Slack channels supported:
  - All tickets appear in single internal channel
  - Team can respond to any customer from this channel
- Ticket creation via emoji reaction (configurable)
- Customer ticket creation can be enabled/disabled
- Current limitation: only one internal triage channel supported
  - Multiple internal team channels not currently supported
  - Workaround: paste ticket links in other channels

### Email and Salesforce Integration

- Email forwarding preserves original sender information
- Customer reassignment available if incorrectly attributed
- Salesforce integration:
  - Accounts sync from Salesforce to Atlas
  - Customer grouping based on company email domains
  - Atlas data doesn't sync back to Salesforce (API/webhooks available for custom implementation)

### Linear Integration and Issue Tracking

- Shift+L creates new Linear issues or links existing ones
- Bidirectional sync:
  - Status, assignee, priority changes sync both ways
  - Comments sync between platforms
  - Notifications in Atlas when Linear tickets closed
- Only Linear supported currently (no other bug tracking tools)

### Customer Portal and Authentication

- Customer self-service portal shows all tickets
  - Personal tickets and company-wide tickets (configurable)
  - Ticket submission form available
- Authentication methods:
  1. JavaScript snippet with identify calls (60-day cookies)
  2. Hash-based authentication (requires engineer consultation)
- Multi-instance deployment considerations need verification
- On-premise customers would need JS snippet inclusion

### AI Agent and Knowledge Base

- AI response modes:
  1. Auto-respond directly to customers
  2. Suggestion mode (human approval required)
- Knowledge sources:
  1. Atlas help center articles
  2. Past ticket history
  3. External websites
- Profile mapping allows different AI behavior per customer type
  - Enterprise customers: suggestion mode only
  - Free users: auto-response enabled
- Manual help center article creation from tickets available

### Pricing and Access Control

- $89/month per responding agent (Pro plan needed for full features)
- Free viewer access for non-responding team members
- Role-based permissions:
  - Admin/Agent: full response capabilities
  - Light Agent: internal notes only
  - Contractor: reports and configuration access
  - Viewer: read-only access
- SOC2 compliant
- Two-week free trial with full integrations

### Key Questions from Notes

1. Google Workspace authentication: Confirmed supported
2. Linear integration: Fully supported with bidirectional sync
3. API access for reporting: Available plus webhooks
4. Analytics: Built-in reports plus API access
5. Salesforce sync: Accounts sync to Atlas, but Atlas data doesn't sync back
6. Session recordings: Built-in for chat widget users with developer tools

### Additional Features

- SLA management with customer-specific rules
- Priority levels (manual or automated via rules)
- Broadcast announcements via email, SMS, Slack Connect
- Session recordings with console/network error tracking
- Custom fields and customer segmentation
- Chat widget customization

---

Chat with meeting transcript: [https://notes.granola.ai/t/1f198890-c496-44c7-bb03-a3bf2e37f887-00demib2](https://notes.granola.ai/t/1f198890-c496-44c7-bb03-a3bf2e37f887-00demib2)

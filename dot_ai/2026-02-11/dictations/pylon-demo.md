# Pylon Demo | Nrwl

**Date:** Wed, 11 Feb 2026

**Attendees:** steven@nrwl.io, caleb@nrwl.io, cory@nrwl.io, austin@nrwl.io, miro@nrwl.io, josh@usepylon.com, nicole@nrwl.io

---

### Pylon Platform Overview

- Unified customer support dashboard consolidating all channels
  - Slack, Teams, Discord, email, chat widgets, WhatsApp flow into single Kanban view
  - AI automatically groups related messages into tickets
  - Customizable filters for enterprise accounts, bug types, team assignments
- AI Copilot drafts responses using past conversations, call recordings, docs
- Automated workflows trigger actions based on message content
  - Route bugs to engineering, billing issues to billing team
  - SLA breach notifications, auto-escalation, spam detection

### Integration Capabilities

- Linear integration available
  - Statuses, comments, projects all sync bidirectionally
  - Can escalate support tickets directly to Linear from Pylon
  - Issues stay "on hold" until Linear ticket closed, then return to "on you"
- Salesforce bidirectional sync for cases and account data
- Call recorder integrations: Fireflies, Fathom, Gong, Circle Back, others via API
  - Outreach call recorder not yet supported but possible via API
- Post Hog integration pulls usage data, session replays can connect to chat widget issues

### AI Features & Knowledge Management

- Ask AI searches across docs, call transcripts, Slack messages, emails
  - Provides context like "Customer XYZ had same issue in October, here's the call transcript at 10min mark"
- Knowledge base gap detection identifies most-asked questions without articles
  - Auto-generates articles from existing support responses and docs
- Feature request tracking aggregates customer requests across all channels
  - AI groups similar requests, provides evidence for Linear project creation
- AI Agents can handle simple requests completely autonomously ($50/seat + volume-based pricing)

### Customer Portal & Account Intelligence

- Customer self-service portal with SSO or one-time email codes
  - View all their tickets, project status, task completion
  - Access to branded knowledge base with federated search
- Account health scoring based on configurable metrics
  - Seat utilization, response times, days since last issue
- Sentiment analysis flags at-risk customers automatically
  - Detects enthusiasm vs frustration in calls/messages
  - Custom prompts for churn risk factors, pain points

### Pricing & Next Steps

- Enterprise package: $39/seat/month (10 seats needed)
  - Includes 10+ viewer seats, Teams integration, custom reporting
- AI Assistant: $50/seat/month for auto-routing, drafting, gap detection
- AI Agents: Volume-based pricing for autonomous responses
- Account Intelligence: $10/customer account/month (optional, can select specific accounts)
- Trial options: Sandbox demo, 1-week basic trial, or month-long paid pilot
- Nrwl evaluating against Atlas and Front this week
- Josh will follow up Monday for next steps decision

### Questions from Notes

- Linear integration: Available, statuses and comments sync ✓
- Task completion workflow: Issues return to "on you" status when Linear ticket closes ✓
- Analytics and API: Open APIs available for data extraction ✓

---

Chat with meeting transcript: [https://notes.granola.ai/t/61d85d83-6531-49fa-9125-6d53267dc43c-00demib2](https://notes.granola.ai/t/61d85d83-6531-49fa-9125-6d53267dc43c-00demib2)

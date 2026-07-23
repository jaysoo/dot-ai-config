# Elijah

**Team:** Finance
**Role:** VP of Finance
**Email:** elijah@nrwl.io

## Personal

- **Partner:**
- **Children:**
- **Pets:**
- **Hobbies:**

## Professional

- **Current Focus:** Revenue recognition automation (Reel It rollout), credit/usage billing accuracy
- **Goals:**
- **Strengths:**

## Upcoming Sync

## 1:1 Notes

### 2026-07-23 — Credit Data / Revenue Recognition

Transcript: https://notes.granola.ai/t/864c153e-70ef-45cc-afa4-e37e50572599-00demib2

**Context: AI productivity and expectations**

- AI has compressed timelines significantly: 2-week projects now done in 2-3 days.
- Tradeoff: harder to prioritize single workstreams; more things in flight simultaneously.

**Revenue recognition background**

- Two types of revenue recognition:
  - Non-consumption (seats, licenses): straight-lined over contract period.
  - Consumption-based (credits): recognized as used, calculated monthly.
- New accounting system: Reel It (Andreessen Horowitz portfolio, same investors as Nrwl).
  - Automates usage calculation at month-end.
  - Integrates with Salesforce; rates pushed through at opportunity level.

**Credit data and overage logic**

- Month-end formula: credits used / total credit balance x amount paid = revenue recognized.
- Overage: if a customer exceeds their credit allotment, Reel It auto-generates an invoice.
  - Example: 5,000 credits allotted, 6,000 used = invoice for 1,000-credit overage.
- Two credit types in Lighthouse:
  - Compute credits: primary, used by all enterprise customers; the main focus.
  - AI credits (Anthropic API usage): separate policy, lower user base but growing fast (one customer approaching ~$50k/month).
- Data split between systems:
  - Usage data: Lighthouse.
  - Credit balance (contracted allotment): Salesforce / Reel It.
  - Month-end process: marry the two to check for overage.

**Lighthouse report and gaps**

- Existing credit report in Lighthouse can export CSV with usage by customer and month.
- Add organization ID column to the export (easy, confirmed).
- Lighthouse currently only covers single-tenant enterprise customers.
  - Non-single-tenant customers (e.g. on the Prague cluster) are not connected.
  - Need to pull their data via Atlas (MongoDB) or integrate into Lighthouse.
- Get a list of enterprise customers that are not single-tenant, so Elijah knows scope and priority.
- Balance data not currently in Lighthouse; lives in Salesforce.

**Timeline and next steps**

- Reel It go-live: August 1st (moved up from September 1st).
- Target cut-over for correct revenue recognition: ~September 1st.
- New pricing model applies to new customers and renewing customers only; existing contracts honored.
- Integration of non-single-tenant data into Lighthouse: ~1 week max.

**Action items**

- [ ] Jack: talk to Steve today or tomorrow to assess effort for integrating prod cluster data.
- [ ] Add organization ID column to the Lighthouse credit report CSV export.
- [ ] Produce a list of enterprise customers that are not single-tenant (scope/priority for Elijah).

## Random Notes

# Promotion Justification Document

**Patrick Mariglia** | Infrastructure Engineer → L5 | 2026-01

## Summary

Patrick has grown from contributing engineer (late 2023) to owning critical infrastructure domains. Key achievements:

| Area | Impact |
|------|--------|
| **Observability** | Migrated multiple self-hosted Grafana/Prometheus/Loki stacks → unified Grafana Cloud (nx.grafana.net). Company-wide SME. |
| **Security** | Discovered & fixed critical cache poisoning vulnerability in 2 weeks. Implemented token-based auth for CI workflows. |
| **Cost Management** | Built customer-level infrastructure billing system used by Finance and Infra for profitability/optimization decisions. |
| **Operations** | Maintains 20+ single-tenant deployments (GCP/AWS) with ~100% uptime. Designed registry-build-cache system. |

**Core argument:** Scope expanded significantly, consistently delivers complex technical projects requiring deep expertise and sound judgment. Already operating at L5 level.

---

Since starting in late 2023, I have grown from a contributing member of the infrastructure team to owning critical technical domains that directly impact our operational excellence, security, and cost efficiency. My role encompasses technical expertise in observability infrastructure, proactive security improvements, and the operational management of our ever-growing number of single-tenant deployments. I have become the go-to technical expert for observability tooling and cost analysis, while maintaining the reliability of our growing single-tenant and multi-tenant environments.

## Observability Infrastructure & Technical Expertise

One of my most significant contributions has been leading the migration from multiple self-hosted Grafana, Prometheus, and Loki instances to a unified Grafana Cloud platform. Previously, we maintained separate monitoring stacks for different customers, each hosted at different DNS addresses, which created operational overhead and made cross-customer visibility difficult. I designed and executed the migration strategy that consolidated all of these instances into a single unified platform accessible at nx.grafana.net.

This eliminated the engineering effort required by the infra team to maintain multiple self-hosted stacks, reduced compute costs associated with hosting these applications, and most importantly, provided our engineers and DPEs a single location for viewing all customer metrics, logs, and traces. This has directly allowed us to roll out our incident response capabilities and made troubleshooting customer issues significantly faster. As we continue to onboard new single-tenant customers, this architecture allows us to avoid needing to provision and maintain a new monitoring stacks for each customer.

Beyond the migration itself, I have established myself as the observability subject matter expert for the entire company. When engineers have questions about how to use Grafana, how to interpret metrics, or how to diagnose issues using our observability stack, I am consistently the person they turn to in both public slack channels an in DMs. I occasionally share updates in Slack about new dashboards, metrics, and monitoring capabilities I've added, helping to enable other teams to solve their own problems more effectively. I am confident that this has helped others become more self-sufficient in understanding and debugging their systems.

## Security & System Reliability

While working on an unrelated feature in our Workflow Controller, I discovered a critical cache poisoning vulnerability in our infrastructure that could have had severe security implications for our customers. The issue stemmed from how permissions were granted to agent workflows accessing our cache buckets. At the time, agents had arbitrary read/write access to the entire cache bucket, which meant any customer could  access and modify other customers' cached code, including sensitive dependencies like `node_modules`. Had this been exploited, an attacker could have injected malicious code that would execute during other customers' CI runs.

Upon discovering this vulnerability, I immediately raised it with the team and together we begun efforts to design and implement a fix within a two-weeks. The solution involved architecting a token-based authorization system where the Workflow Controller generates and manages individual scoped tokens for each CI workflow. This required careful design to ensure we maintained functionality while adding the necessary security controls.

This incident demonstrated not only my technical capability to identify and remediate complex security issues under time pressure, but also my proactive security mindset. I didn't discover this vulnerability during a formal security review - I spotted it because I understand our systems deeply enough to recognize problematic access patterns while working on other features.

The quick turnaround on this fix prevented potential arbitrary code execution by untrusted actions in customer CI pipelines, and strengthened the security posture of our entire platform.

## Infrastructure Cost Management

I built and maintain a cost analysis system that generates monthly infrastructure billing data exports broken down by customer. This system provides critical financial visibility that enables both our Finance team and Infrastructure team to make informed decisions. Finance had used this data to understand customer profitability and pricing models, while our team uses it to identify which customers are generating the highest infrastructure costs relative to their contract or usage.

This cost visibility has become quite important as we've scaled our single-tenant offerings. We've already used this data to make infrastructure changes to certain tenants in order to reduce their costs, and we plan to more deeply integrate the data into our internal tools.

## Infrastructure Operations & Customer Support

I provide ongoing operational support for our single-tenant environments, responding to customer issues, troubleshooting deployment problems, and ensuring these dedicated environments maintain the reliability and performance our enterprise customers expect. As we've grown to over 20 single-tenant deployments across GCP and AWS, this responsibility only become more important, and other than some brief issues with Clickup early on in 2025, we've maintained a near 100% uptime for all single-tenant deployments.

I also designed and implemented a registry-build-cache system for enterprise single-tenant customers. Though the system has not been battle-tested in production just yet, it is a complete end-to-end project that I owned from initial design through implementation.

Furthremore, together with my team, I share responsibility for managing our development, staging, and production environments across both our multi-tenant platform. This includes ensuring environment stability, coordinating deployments, and responding to infrastructure issues as they arise.

## Growth & Impact

When I joined the infrastructure team two years ago, I was a contributing engineer supporting our cloud infrastructure. Today, I own critical technical domains that are fundamental to our operational success. I am the recognized expert in observability infrastructure, having modernized our entire monitoring stack and becoming the person the team relies on for troubleshooting and metrics analysis. I proactively identify and remediate issues that arise, build systems that provide financial visibility into our infrastructure costs to enabling better business decisions, and I maintain the reliability of an infrastructure footprint that has grown to include over 20 dedicated customer environments.

The scope and impact of my work (and the teams work) have expanded significantly, and I have consistently delivered on complex technical projects that require both deep technical expertise and good judgment about prioritization and risk.

Given this scope and demonstrated impact, I believe I have already been acting at an L5 level and that a promotion to L5 is justified.

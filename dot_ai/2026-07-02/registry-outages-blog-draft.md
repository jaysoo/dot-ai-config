---
title: "When npm or Docker Hub goes down, your builds should not"
status: draft
author: Jack Hsu
date: 2026-07-02
notes: >
  Product name is a placeholder. Swap "[Read-Through Cache]" / "[Our Cache]"
  for the real feature/product branding and add the real CTA link before publishing.
  Every factual claim below is backed by a primary or named-vendor source in the
  Sources section. Two npm 2024 dates are secondary-sourced - flagged inline.
---

# When npm or Docker Hub goes down, your builds should not

## TL;DR

Your CI pipeline has two dependencies you do not own and cannot fix: the **npm
registry** and **Docker Hub**. When either one is down, throttled, or having a
bad day, your builds fail - not because of anything your team did, but because
someone else's `us-east-1` fell over. A **read-through cache** for npm and Docker
keeps your team shipping through those failures. And you do not have to take our
word that caching is the answer - Docker, AWS, GitLab, and Red Hat all say the
same thing.

---

## October 20, 2025: the day CI stopped

At 06:48 UTC on October 20, 2025, AWS `us-east-1` had a bad morning - DynamoDB,
EC2, and Network Load Balancer all degraded. Docker Hub runs there. Within
minutes, Docker Hub, Scout, Build Cloud, Automated Builds, and Testcontainers
Cloud all started failing. Image pulls stopped working. Full restoration did not
land until 09:42 UTC the next day.

Docker's own incident report does not soften it:

> Among Docker's services, Hub's registry operations, especially image pulls,
> are the most heavily used and the most essential to keeping developer
> workflows moving.

Translation: the single most-used thing on Docker Hub - pulling an image - is
exactly what broke. Teams could not pull base images or deploy. CI pipelines
from startups to the Fortune 500 ground to a halt for the better part of a day.

This was not a fluke, and it was not the first time.

---

## Your build stands on two single points of failure

Every `npm install` and every `docker pull` in your pipeline is a live network
call to infrastructure you do not control. That has been breaking builds for a
decade.

### npm registry incidents

| Date | What happened | Impact |
|---|---|---|
| **Mar 22, 2016** | A developer unpublished `left-pad` (11 lines of code) after a naming dispute | `left-pad` 404'd, breaking Babel, webpack, and thousands of downstream projects worldwide until npm manually restored it hours later. npm changed its unpublish policy afterward. |
| **Oct 22, 2021** | `ua-parser-js` was hijacked to ship a crypto-miner and credential stealer | CI systems pulling the poisoned versions were compromised. The registry is a single point of *trust*, not just availability. |
| **Jun 11, 2024** | Registry incident affecting publish and install (~2h) | Publishing and installs failed globally.* |
| **Dec 17, 2024** | Regional install failures (~3h, notably India) | Installs failed for affected regions.* |

\* *June and December 2024 durations are from third-party monitoring, not npm's
official postmortem - verify against status.npmjs.org before quoting exact
numbers.*

npm's own status page (status.npmjs.org) publishes an incident feed. Third-party
monitors have logged dozens of npm incidents since 2023. The `left-pad` lesson
was supposed to be "never depend on a registry you do not control" - most teams
still do.

### Docker Hub: outages *and* a throttle you hit on a normal Tuesday

Docker Hub has a second failure mode npm mostly does not: **rate limits**. You do
not need an outage to get blocked.

| Date | What happened | Impact |
|---|---|---|
| **Nov 2, 2020** | Rate limits introduced | Anonymous pulls capped at **100 per 6 hours**; free authenticated accounts at **200 per 6 hours**. CI runners started hitting quotas. |
| **Apr 2025** | Limits nearly tightened, then walked back | Docker planned stricter limits plus per-pull fees for April 1, 2025, then cancelled the fees and kept the existing limits. Paid tiers moved to unlimited. |
| **Current** | Standing policy | Unauthenticated: **100 pulls / 6h** per IPv4 address or IPv6 /64 subnet. Free (Personal): **200 / 6h**. Exceed it and Docker Hub returns **HTTP 429**. |
| **Oct 20-21, 2025** | Full outage (~15h hard-down inside a ~27h degraded window) | AWS `us-east-1` (DynamoDB) failure took image pulls offline. CI could not pull base images or deploy. |

Here is the part most teams miss: **CI runners share IP addresses.** On hosted
runners, dozens of unrelated jobs come from the same IP or subnet, so they burn
through the anonymous 100-pulls-per-6-hours quota collectively. GitLab spells it
out:

> Most CI/CD pipelines that don't use the Dependency Proxy pull directly from
> Docker Hub as unauthenticated users [...] multiple users might share the same
> IP address or subnet, making them collectively subject to this limit.

So even with Docker Hub perfectly healthy, a busy Tuesday afternoon of builds can
start returning 429s and failing your pipeline. It is an outage on a schedule you
do not set.

---

## The vendors already agree: cache it

The strongest argument for a read-through cache is that the companies running
this infrastructure recommend it themselves.

**Docker**, in its own October 2025 postmortem, lists caching as the mitigation:

> Expanding and optimizing cache layers to reduce the blast radius of upstream
> failures, ensuring customers can continue accessing frequently used images even
> during partial outages.

**AWS** advises copying public Docker Hub images into a private registry so your
builds stop depending on the public one.

**GitLab** runs a pull-through cache for its own hosted runners:

> We use Google Cloud's pull-through cache [...] configuring the Dependency Proxy
> [is] the most efficient long-term solution.

**Red Hat** recommends a local mirror for the same reason:

> CI/CD pipelines might start to fail building and rolling out your software [...]
> [deploy a registry to] provide a fast, local cache of public image
> repositories.

Four vendors, one answer: **do not pull straight from the public registry in CI.
Put a cache in front of it.**

---

## What about the CI platforms? Most only solve half the problem

Some CI vendors have bolted on a partial fix. It is worth knowing exactly what
they cover, because the gaps are the whole argument.

| Platform | What they do for Docker Hub | Covers | Survives a real outage? | Caches npm? |
|---|---|---|---|---|
| **Blacksmith** | Real pull-through cache mirror, on by default | Public images only | Partially - cached images keep serving | No |
| **GitHub Actions** (hosted runners) | Rate-limit *exemption* via a Docker partnership - not a cache | Public images, hosted runners only | No - still pulls live from Hub | No |
| **CircleCI** | Docker partnership exemption; optional manual registry mirror | Public images | Only if you configure a mirror yourself | No |
| **Depot / Namespace** | Build-layer cache + their own registry | Build layers | Different problem | No |
| **DIY** (`mirror.gcr.io`) | Point your daemon at Google's public pull-through cache | Public images | Depends | No |

Three things fall out of that table:

**A rate-limit exemption is not outage protection.** GitHub's and CircleCI's
Docker partnerships kill the 429 throttle, but those runners still pull *live*
from Docker Hub. On October 20, 2025, a GitHub-hosted job pulling a base image
still failed, because Docker Hub itself was down. Only an actual cache keeps
building through an outage.

**Everything is public-only and platform-locked.** Private Docker Hub pulls stay
rate-limited almost everywhere, and each fix only works on that vendor's runners
- Blacksmith's cache helps you only on Blacksmith, GitHub's exemption only on
GitHub-hosted runners. A cache that works wherever your builds run does not lock
you in.

**None of them cache npm.** Every option above is Docker-only. Not one puts a
read-through cache in front of the npm registry - so the `left-pad` failure mode
and the June 2024 npm outage are still live risks even on the platforms that
"solved" Docker.

[Our Cache] covers **both npm and Docker**, survives real outages (not just rate
limits), and works wherever your builds run.

> A note on the fine print: the exact terms of the GitHub-Docker and
> CircleCI-Docker partnerships are not published in a single official document.
> They are well attested across vendor discussions, but state them softly -
> "GitHub-hosted runners are generally exempt from Docker Hub rate limits for
> public images" rather than quoting specific numbers.

---

## What a read-through cache actually buys you

A read-through (pull-through) cache sits between your builds and the upstream
registries. The first time your team pulls a package or image, the cache fetches
it from npm or Docker Hub and stores it. Every pull after that is served locally.

That single architectural change gives you:

- **Outage immunity for anything already cached.** When Docker Hub or npm is
  down, your builds keep pulling from the cache. The Oct 2025 outage becomes a
  non-event for images you have pulled before.
- **No more 429s.** Docker Hub sees one authenticated pull from your cache instead
  of hundreds of anonymous pulls from your CI fleet. You stop tripping the rate
  limit entirely.
- **Faster builds.** Local cache hits beat a round trip to a public registry every
  time.
- **A defense against `left-pad`-style disappearances.** A package that vanishes
  upstream is still in your cache.

[Our Cache] does this for **both npm and Docker in one place** - so the two
registries your pipeline cannot live without are both covered, with no per-team
plumbing.

## Serious software shops do not outsource their uptime

If your team ships software for a living, "our deploy is blocked because Docker
Hub is down" is not an acceptable status update - especially when the fix is
well understood and the infrastructure vendors themselves recommend it. A
read-through cache for npm and Docker means the next time `us-east-1` takes down
a public registry, your team is the one that keeps working.

[CTA: link to feature / docs / trial]

---

## Sources

**Docker Hub outage (Oct 2025)**
- Docker incident report: https://www.docker.com/blog/docker-hub-incident-report-october-20-2025/

**Docker Hub rate limits**
- Current limits (Docker docs): https://docs.docker.com/docker-hub/usage/pulls/
- 2020 introduction (AWS): https://aws.amazon.com/blogs/containers/advice-for-customers-dealing-with-docker-hub-rate-limits-and-a-coming-soon-announcement/
- 2025 policy reversal (Docker): https://www.docker.com/blog/revisiting-docker-hub-policies-prioritizing-developer-experience/

**npm incidents**
- left-pad (Wikipedia): https://en.wikipedia.org/wiki/Npm_left-pad_incident
- left-pad (The Register): https://www.theregister.com/2016/03/23/npm_left_pad_chaos/
- ua-parser-js malware (CISA): https://www.cisa.gov/news-events/alerts/2021/10/22/malware-discovered-popular-npm-package-ua-parser-js
- npm status feed: https://status.npmjs.org/
- 2024 incidents (third-party monitoring, verify before quoting): https://statusgator.com/services/npm

**Cache-as-mitigation endorsements**
- GitLab: https://about.gitlab.com/blog/prepare-now-docker-hub-rate-limits-will-impact-gitlab-ci-cd/
- Red Hat: https://www.redhat.com/en/blog/mitigate-impact-of-docker-hub-pull-request-limits
- AWS: https://aws.amazon.com/blogs/containers/advice-for-customers-dealing-with-docker-hub-rate-limits-and-a-coming-soon-announcement/

**CI platform comparison**
- Blacksmith pull-through cache: https://www.blacksmith.sh/blog/you-have-5-days-before-the-new-dockerhub-limits-f-ck-you-over
- GitHub Actions limits (Docker exemption context): https://docs.github.com/en/actions/reference/limits
- CircleCI + Docker Hub rate limits: https://discuss.circleci.com/t/docker-hub-rate-limiting-customer-impact-and-solutions/53017
- Google public mirror (mirror.gcr.io) via CircleCI mirror guidance: https://support.circleci.com/hc/en-us/articles/360049758552

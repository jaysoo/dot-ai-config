---
title: Postmortem - Mar 4th, 2024: Unintentional Release of Nx 18.1.0 to latest tag on npm
page_id: 336ac41f-7fae-4c0e-a68a-08b2713817d2
category: postmortem
url: https://www.notion.so/Postmortem-Mar-4th-2024-Unintentional-Release-of-Nx-18-1-0-to-latest-tag-on-npm-336ac41f7fae4c0ea68a08b2713817d2
retrieved_at: 2025-06-13T18:40:00Z
---

# Postmortem - Mar 4th, 2024: Unintentional Release of Nx 18.1.0 to latest tag on npm

## 1. Executive Summary

An unintended release of Nx version `18.1.0` to the **`latest`** tag on npm occurred whilst implementing the PR releases functionality. The incident was identified within an hour, impacting all Nx users. Immediate corrective actions included deprecating the unintended release and reverting the **`latest`** tag to version `18.0.6`. Despite rapid response, automated dependency update tools had already distributed the deprecated version, and users had reported issues. A subsequent version, `18.0.7`, was published to mitigate the issue somewhat, but full mitigation will require an `18.1.1` release. Long-term corrective measures have been implemented to prevent similar incidents, and more can be further designed.

## 2. Incident Details

- **Date and Time**: Mon, 04 Mar 2024 09:08:02 GMT
- **Incident Reporter**: Katerina Skroumpelou
- **Affected Services/Systems**: All Nx packages on npm
- **Severity Level**: High
- **User Impact**: All users of Nx

## 3. Incident Timeline

- **T+0**: Unintended release of Nx 18.1.0 to **`latest`** on npm https://github.com/nrwl/nx/actions/runs/8137858282/job/22237797527 when working on .
- **T+1hr**: Incident identification.
- **T+2.5hrs**: By repurposing the existing publish.yml workflow with the required npm access level, we deprecated the `18.1.0` release on npm; reverted **`latest`** tag to `18.0.6`.
- **Post-2.5hrs**: Automated tools distributed the deprecated version; `18.0.7` published as an initial mitigation

## 4. Root Cause Analysis

The root cause was invalid modifications of the existing `publish.yml` workflow file whilst implementing the PR releases functionality (PR [#22093](https://github.com/nrwl/nx/pull/22093)). During testing of these invalid changes, it led to the automatic deployment of version `18.1.0` to the **`latest`** tag on npm, bypassing intended release protocols (namely that only a small number of folks should trigger a `latest` release). The exact reason for this was due to misconfigured GitHub Actions yaml in the updated `publish.yml` workflow. The `VERSION` was being set dynamically based on the resulting output of a previous step. However, the previous step belonged to a separate job, and so could not be accessed in that location, thus causing it to come through as an empty value. When running our `nx-release.ts` with an empty version, you get a `minor` by default, therefore yielding `18.1.0`. The other mistake here was that `dry-run` was not leveraged until all logic had been proven out (the hardcoded value was removed prematurely).

## 5. Resolution and Recovery

[Content continues beyond retrieved portion]

## Notes

**Well-structured postmortem**: This follows a clear incident postmortem template with timeline, root cause analysis, and executive summary. Good example of incident documentation practices.
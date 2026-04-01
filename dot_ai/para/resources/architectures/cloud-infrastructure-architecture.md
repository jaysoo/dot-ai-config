# cloud-infrastructure Architecture

## Overview

Multi-cloud IaC repository for Nx Cloud. Manages infrastructure (OpenTofu) and Kubernetes GitOps (ArgoCD/Kustomize) for enterprise customers across AWS, Azure, and GCP.

## Key Directories

- `terraform/modules/` — Reusable infra modules by cloud provider (`aws-*`, `gcp-*`, `azure-*`)
- `terraform/enterprise/` — Per-customer deployments by cloud provider
- `terraform/nxcloud*/` — Core platform deployments (ops, staging, prod)
- `kubernetes/argocd/` — ArgoCD app definitions (app-of-apps pattern)
- `kubernetes/kustomize/base/` — Base k8s manifests
- `kubernetes/kustomize/overlays/` — Environment-specific overrides (nxclouddevelopment, nxcloudstaging, nxcloudprod)
- `kubernetes/kustomize/enterprise/` — Per-customer k8s configs by cloud provider (AWS, Azure, GCP)
- `ansible/` — macOS CI agent config management

## Critical Configuration: Agent Images (enabledImages)

The `enabledImages` list in `agent-configuration` ConfigMaps controls which agent images customers can select as launch templates. These are defined in **12 files** across environments:

### Multi-tenant (5 files)
- `kubernetes/kustomize/base/nx-cloud-production/resourceclasses.yaml`
- `kubernetes/kustomize/overlays/nxclouddevelopment/nx-cloud.yaml`
- `kubernetes/kustomize/overlays/nxcloudstaging/nx-cloud.yaml`
- `kubernetes/kustomize/overlays/nxcloudprod/nx-cloud-na.yaml`
- `kubernetes/kustomize/overlays/nxcloudprod/nx-cloud-eu.yaml`

### Enterprise (7 files)
- `kubernetes/kustomize/enterprise/AWS/common/nx-cloud.yaml`
- `kubernetes/kustomize/enterprise/AWS/celonis/nx-cloud.yaml`
- `kubernetes/kustomize/enterprise/AWS/nxclouddevelopment/nx-cloud.yaml`
- `kubernetes/kustomize/enterprise/Azure/common/nx-cloud.yaml`
- `kubernetes/kustomize/enterprise/GCP/common/nx-cloud.yaml`
- `kubernetes/kustomize/enterprise/GCP/clickup/nx-cloud.yaml`
- `kubernetes/kustomize/enterprise/GCP/heb/nx-cloud/nx-cloud/resources/resourceclasses.yaml`

### Gotchas
- **Indentation varies**: Overlays use 6-space indent, development and Azure use 4-space indent
- **ClickUp is behind**: Missing `node20.19-*` images (goes from `node20.11-v12` directly to beta/dind)
- **Default image**: First entry in the list (`ubuntu22.04-node20.9-v1`). No explicit `defaultImage` field.
- **Workflow controller ConfigMaps** (`workflow-controller.yaml`) define resource classes and affinities but NOT enabledImages — those live in `nx-cloud.yaml` files

## Resource Classes (agent-configuration ConfigMap)

The `agent-configuration` ConfigMap contains `agentConfigs.yaml` with:
- `resourceClasses` — CPU/memory definitions per platform/arch/size
- `agentAffinities` — Node affinity rules mapping size classes to k8s node pools
- Referenced by workflow-controller deployments via volume mount at `/opt/nx-cloud/resource-classes/`

## Personal Work History

### CLOUD-4403: Add Node 22/24 agent image tags (2026-03-31)
- Branch: `CLOUD-4403`
- PR: https://github.com/nrwl/cloud-infrastructure/pull/4702
- Added `ubuntu22.04-node22.22-v1` and `ubuntu22.04-node24.14-v1` to all 12 enabledImages lists
- Follow-up to ocean PR #10571 (CLOUD-4029) which built the images
- Node 20 remains default; follow-up planned to switch default to Node 22 in 2-4 weeks

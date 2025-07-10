# Raw Docs Update Plan for Ocean Features

## Generated: 2025-06-26

## Overview

This plan outlines the documentation that needs to be created or updated in the raw-docs repository based on recent feature development in the ocean repository.

## Priority 1: New Feature Documentation (Must Create)

### 1. Self-Healing CI / Fix CI Feature
**File**: `/Users/jack/projects/raw-docs/features/nx-cloud-self-healing-ci/README.md`

**Key Commits**:
- #7754: Avoid retries for AI fix endpoint calls  
- #7746: UI updates for self-healing CI
- #7694: Rename ci-fix to fix-ci
- #7723: Workspace setting to enable/disable

**Documentation Outline**:
```
1. Executive Summary
   - AI-powered CI failure analysis and automatic fixes
   - Target: Engineering teams with flaky tests
   - Reduces debugging time by 80%

2. Problem Statement
   - CI failures waste developer time
   - Flaky tests create uncertainty
   - Manual debugging is repetitive

3. Solution Overview
   - AI analyzes failure patterns
   - Suggests or applies fixes automatically
   - Learns from past fixes

4. Configuration
   - Enable in workspace settings
   - Set spending limits
   - Configure retry policies

5. Usage Examples
   - Fixing flaky tests
   - Environment-specific failures
   - Dependency issues
```

### 2. Cache Isolation Feature
**File**: `/Users/jack/projects/raw-docs/features/nx-cloud-cache-isolation/README.md`

**Key Commits**:
- #7791: Add cache isolation workspace setting
- #7781: Add property to configure cache isolation

**Documentation Outline**:
```
1. Executive Summary
   - Branch-level cache isolation for security
   - Target: Enterprises with strict security requirements
   - Prevents cache poisoning attacks

2. Problem Statement
   - Shared cache can be security risk
   - Malicious actors could poison cache
   - Compliance requirements

3. Configuration
   - Enable per workspace
   - Branch-based isolation rules
   - Performance implications

4. Migration Guide
   - From shared cache to isolated
   - Testing isolation rules
   - Rollback procedures
```

### 3. Google Tag Manager Integration
**File**: `/Users/jack/projects/raw-docs/features/nx-cloud-gtm-analytics/README.md`

**Key Commits**:
- #7811: Change GA to GTM tag setup

**Documentation Outline**:
```
1. Executive Summary
   - Enhanced analytics with GTM
   - Better privacy controls
   - More flexible tracking

2. Migration from GA
   - What changes for users
   - Privacy improvements
   - New capabilities

3. Configuration
   - GTM container setup
   - Custom events
   - Privacy settings
```

## Priority 2: Existing Documentation Updates

### 1. SAML + SCIM Integration Updates
**File**: `/Users/jack/projects/raw-docs/features/nx-cloud-saml-scim-okta/README.md`

**Updates Needed**:
- Add GitLab integration notes (multiple mentions in commits)
- Update UI screenshots for new member settings (#7763)
- Add troubleshooting for new SCIM endpoints (#7681)
- Document `ALLOW_AUTHENTICATED` org permissions

### 2. DTE Performance Documentation
**File**: `/Users/jack/projects/raw-docs/features/nx-cloud-dte-performance/README.md` (Create if doesn't exist)

**Key Improvements**:
- Background task tracing (#7810, #7773)
- DTE cache improvements (#7809)
- Non-cacheable task handling (#7805)
- Early termination optimization

**Documentation Outline**:
```
1. Performance Optimization Guide
   - New tracing capabilities
   - Cache configuration options
   - Task scheduling improvements

2. Troubleshooting
   - Using trace data
   - Common performance issues
   - Optimization strategies
```

## Priority 3: Feature Consolidation Docs

### 1. AI Features Overview
**File**: `/Users/jack/projects/raw-docs/features/nx-cloud-ai-features/README.md`

**Consolidate**:
- Self-healing CI
- AI fix suggestions
- Spend limit controls (#7734)
- Future AI capabilities

### 2. Enterprise Security Features
**File**: `/Users/jack/projects/raw-docs/features/nx-cloud-enterprise-security/README.md`

**Include**:
- Cache isolation
- SAML + SCIM
- Access control policies
- Audit logging

## Implementation Timeline

### Week 1 (Immediate)
- [ ] Create Self-Healing CI documentation
- [ ] Create Cache Isolation documentation
- [ ] Update SAML + SCIM docs

### Week 2
- [ ] Create GTM migration guide
- [ ] Create/Update DTE performance guide
- [ ] Start AI features overview

### Week 3
- [ ] Complete all consolidation docs
- [ ] Review and refine all documentation
- [ ] Set up regular update process

## Documentation Standards

All new documentation should:
1. Follow the TEMPLATE.md structure
2. Include real-world examples
3. Provide clear migration paths
4. Address common questions
5. Include troubleshooting sections

## Review Process

1. Technical review by feature developers
2. Product review for messaging
3. DevRel review for clarity
4. Customer Success review for common issues

## Notes

- Monitor ocean repo for additional features
- Update this plan weekly
- Coordinate with product launches
- Ensure docs are ready before features ship
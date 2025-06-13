# 🚨 Incident Response Quick Reference

## Alert Fired?

1. **Check** `grafana_irm` Slack channel
2. **Acknowledge** alert in Grafana
3. **Create incident** in Grafana IRM if needed

## Key Tools

| Purpose | Tool | Notes |
|---------|------|-------|
| **Incidents** | Grafana IRM | All incident management |
| **Alerts** | Grafana + Slack | `grafana_irm` channel |
| **Communication** | Slack/Zoom | War room as needed |
| **Status Page** | status.nx.dev | Auto-updates from Grafana |
| **Postmortems** | Notion | After incident only |

## Response Steps

### 1. First Response (90% of cases)
```bash
# Restart the affected service
kubectl rollout restart deployment/[deployment-name] -n production

# Monitor the rollout
kubectl rollout status deployment/[deployment-name] -n production

# Check logs
kubectl logs -f deploy/[deployment-name] -n production
```

### 2. If Restart Doesn't Work
- Check Grafana dashboards
- Review recent deployments
- Look for error patterns
- Escalate to code fix

### 3. Communication
- **Internal**: Update `grafana_irm` every 30 min
- **External**: Status page auto-updates
- **Customers**: DPE team handles

## Severity Levels

| Level | Response Time | Example |
|-------|--------------|---------|
| **P0** | Immediate | Complete outage |
| **P1** | 15 minutes | Major feature down |
| **P2** | 1 hour | Performance degraded |
| **P3** | Next day | Minor issues |

## Escalation Path

```
On-Call Engineer
    ↓ (30 min)
Team Lead
    ↓ (1 hour)
Engineering Manager
    ↓ (critical)
CTO/VP Engineering
```

## Quick Commands

```bash
# View all pods
kubectl get pods -n production

# Check deployment status
kubectl get deploy -n production

# View recent events
kubectl get events -n production --sort-by='.lastTimestamp'

# Scale deployment
kubectl scale deploy/[name] --replicas=3 -n production

# View pod logs
kubectl logs [pod-name] -n production --tail=100 -f
```

## Important Links

- **Grafana IRM**: [Internal Link]
- **Status Page Admin**: [status.nx.dev/admin]
- **Runbooks**: [Internal Wiki]
- **Postmortem Template**: [Notion Link]

## On-Call Contact

**Current On-Call**: Check Grafana IRM or `grafana_irm` channel topic

## Remember

✅ **DO**: Create incidents in Grafana IRM  
✅ **DO**: Update status page via Grafana  
✅ **DO**: Communicate in `grafana_irm`  
✅ **DO**: Write postmortems in Notion  

❌ **DON'T**: Track incidents in Notion  
❌ **DON'T**: Use BetterStack  
❌ **DON'T**: Create incident reports  
❌ **DON'T**: Skip status updates

## After Incident

1. Close in Grafana IRM
2. Schedule postmortem
3. Create Notion entry
4. Track action items
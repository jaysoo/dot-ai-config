# Netlify: List Pending Deploys

Fetch all pending_review Netlify deploys, save to TSV, and show summary.

## Instructions

1. Check that NETLIFY_TOKEN is set, error if not:
```bash
[ -z "$NETLIFY_TOKEN" ] && echo "Error: NETLIFY_TOKEN not set. Run: export NETLIFY_TOKEN='your-token'" && exit 1
```

2. Run the export script:
```bash
cd /tmp && ~/projects/dot-ai-config/dot_ai/para/resources/scripts/netlify-pending-deploys.sh
```

3. Show the 10 most recent deploys and total count:
```bash
echo "" && \
echo "=== 10 Most Recent Pending Deploys ===" && \
echo "" && \
head -11 /tmp/pending-deploys.tsv | tail -10 | awk -F'\t' '{printf "%-10s  %-50s  %s\n", substr($2,1,10), substr($4,1,50), $5}' && \
echo "" && \
echo "Total pending: $(tail -n +2 /tmp/pending-deploys.tsv | wc -l | tr -d ' ') deploys" && \
echo "Full list: /tmp/pending-deploys.tsv"
```

4. Tell the user:
   - To reject deploys: edit `/tmp/pending-deploys.tsv`, delete rows to KEEP, then run `/netlify-reject`

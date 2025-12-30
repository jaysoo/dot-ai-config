# Netlify: List Pending Deploys

Fetch all pending_review Netlify deploys, save to TSV, and show summary.

## Instructions

1. Run the export script:
```bash
cd /tmp && NETLIFY_TOKEN="nfp_Y1kBux31ur9MtXQ6osKZ4CNUaEedRsm55ea3" ~/.ai/scripts/netlify-pending-deploys.sh
```

2. Show the 10 most recent deploys and total count:
```bash
echo "=== 10 Most Recent Pending Deploys ===" && \
head -11 /tmp/pending-deploys.tsv | tail -10 | awk -F'\t' '{printf "%-12s %-20s %-50s %s\n", substr($1,1,12), substr($2,1,10), substr($4,1,50), $5}' && \
echo "" && \
echo "Total pending: $(tail -n +2 /tmp/pending-deploys.tsv | wc -l | tr -d ' ') deploys" && \
echo "Full list: /tmp/pending-deploys.tsv"
```

3. Tell the user:
   - To reject deploys: edit `/tmp/pending-deploys.tsv`, delete rows to KEEP, then run `/netlify-reject`

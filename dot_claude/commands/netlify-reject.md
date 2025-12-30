# Netlify: Reject Pending Deploys

Reject all deploys listed in the curated TSV file.

## Prerequisites

The user must have already run `/netlify-pending` and edited `/tmp/pending-deploys.tsv` to remove rows they want to KEEP.

## Instructions

1. Confirm with the user how many deploys will be rejected:
```bash
echo "Will reject $(tail -n +2 /tmp/pending-deploys.tsv | wc -l | tr -d ' ') deploys"
```

2. Ask the user to confirm before proceeding.

3. If confirmed, run the reject script:
```bash
cd /tmp && NETLIFY_TOKEN="nfp_Y1kBux31ur9MtXQ6osKZ4CNUaEedRsm55ea3" ~/.ai/scripts/netlify-reject-deploys.sh
```

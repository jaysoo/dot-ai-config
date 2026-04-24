# Netlify: Reject Pending Deploys

Reject all deploys listed in the curated TSV file.

## Prerequisites

The user must have already run `/netlify-pending` and edited `/tmp/pending-deploys.tsv` to remove rows they want to KEEP.

## Instructions

1. Check that NETLIFY_TOKEN is set:
```bash
[ -z "$NETLIFY_TOKEN" ] && echo "Error: NETLIFY_TOKEN not set. Run: export NETLIFY_TOKEN='your-token'" && exit 1
```

2. Confirm with the user how many deploys will be rejected:
```bash
echo "Will reject $(tail -n +2 /tmp/pending-deploys.tsv | wc -l | tr -d ' ') deploys"
```

3. Ask the user to confirm before proceeding.

4. If confirmed, run the reject script:
```bash
cd /tmp && ~/projects/dot-ai-config/dot_ai/para/resources/scripts/netlify-reject-deploys.sh
```

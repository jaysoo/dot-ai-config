#!/bin/bash
# Phase 2: Reject deploys from the curated TSV file

TOKEN="${NETLIFY_TOKEN}"
INPUT_FILE="pending-deploys.tsv"

if [ -z "$TOKEN" ]; then
  echo "Error: NETLIFY_TOKEN environment variable not set"
  echo "Set it with: export NETLIFY_TOKEN='your-token'"
  exit 1
fi

if [ ! -f "$INPUT_FILE" ]; then
  echo "Error: $INPUT_FILE not found"
  echo "Run netlify-pending-deploys.sh first"
  exit 1
fi

TOTAL=$(tail -n +2 "$INPUT_FILE" | wc -l | tr -d ' ')
echo "Found $TOTAL deploys to reject"
echo ""

COUNT=0
tail -n +2 "$INPUT_FILE" | while IFS=$'\t' read -r DEPLOY_ID DATE URL TITLE AUTHOR; do
  ((COUNT++))
  echo "[$COUNT/$TOTAL] Rejecting: $TITLE ($DATE)"

  RESULT=$(curl -s -X POST -H "Authorization: Bearer $TOKEN" \
    "https://api.netlify.com/api/v1/deploys/$DEPLOY_ID/cancel")

  STATE=$(echo "$RESULT" | jq -r '.state // "error"')
  echo "  -> $STATE"
  sleep 1
done

echo ""
echo "Done! Rejected $TOTAL deploys."

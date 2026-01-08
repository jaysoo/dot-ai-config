#!/bin/bash
# Phase 1: Export pending_review deploys to a TSV file for review

SITE_ID="${NETLIFY_SITE_ID:-97126ce8-23a6-4afa-81d5-cfd11be8f614}"
TOKEN="${NETLIFY_TOKEN}"
OUTPUT_FILE="pending-deploys.tsv"

if [ -z "$TOKEN" ]; then
  echo "Error: NETLIFY_TOKEN environment variable not set"
  echo "Set it with: export NETLIFY_TOKEN='your-token'"
  exit 1
fi

echo -e "DEPLOY_ID\tDATE\tURL\tTITLE\tAUTHOR" > "$OUTPUT_FILE"

PAGE=1
while true; do
  RESPONSE=$(curl -s -H "Authorization: Bearer $TOKEN" \
    "https://api.netlify.com/api/v1/sites/$SITE_ID/deploys?state=pending_review&per_page=100&page=$PAGE")

  COUNT=$(echo "$RESPONSE" | jq 'length')

  if [ "$COUNT" -eq 0 ]; then
    break
  fi

  echo "$RESPONSE" | jq -r '.[] | [
    .id,
    .created_at,
    .deploy_ssl_url,
    .title,
    (.committer // "unknown")
  ] | @tsv' >> "$OUTPUT_FILE"

  echo "Fetched page $PAGE ($COUNT deploys)"
  ((PAGE++))
done

# Sort by date (most recent first), keeping header
head -1 "$OUTPUT_FILE" > "$OUTPUT_FILE.sorted"
tail -n +2 "$OUTPUT_FILE" | sort -t$'\t' -k2 -r >> "$OUTPUT_FILE.sorted"
mv "$OUTPUT_FILE.sorted" "$OUTPUT_FILE"

TOTAL=$(tail -n +2 "$OUTPUT_FILE" | wc -l | tr -d ' ')
echo ""
echo "Done! Exported $TOTAL deploys to $OUTPUT_FILE"

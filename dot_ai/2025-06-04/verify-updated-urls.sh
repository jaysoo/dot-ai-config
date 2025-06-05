#!/bin/bash

# Script to verify that all new URLs in updated-docs.json exist on canary.nx.dev
# and return HTTP 200 status codes

echo "Starting URL verification against https://canary.nx.dev..."

# Get the script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/../.." && pwd )"

# Output file paths
OUTPUT_DIR="$SCRIPT_DIR"
VALID_URLS_FILE="$OUTPUT_DIR/verified-urls.md"
INVALID_URLS_FILE="$OUTPUT_DIR/invalid-urls.md"

# Initialize output files
cat > "$VALID_URLS_FILE" << EOF
# URL Verification Report

Generated on: $(date)

## Valid URLs (HTTP 200)

EOF

cat > "$INVALID_URLS_FILE" << EOF
## Invalid URLs (Redirects or 404)

### Redirects (HTTP 30x)

EOF

# Add 404 section header
echo -e "\n### Not Found (HTTP 404)\n" >> "$INVALID_URLS_FILE"

# Temporary files for collecting results
TEMP_VALID="/tmp/valid_urls.txt"
TEMP_REDIRECT="/tmp/redirect_urls.txt"
TEMP_NOT_FOUND="/tmp/not_found_urls.txt"

> "$TEMP_VALID"
> "$TEMP_REDIRECT"
> "$TEMP_NOT_FOUND"

# Counter variables
TOTAL_URLS=0
VALID_COUNT=0
REDIRECT_COUNT=0
NOT_FOUND_COUNT=0

# Function to check URL
check_url() {
    local url=$1
    local file_path=$2
    local full_url="https://canary.nx.dev${url}"
    
    # Use curl to check the URL (follow redirects to get final status)
    # -s: silent, -o /dev/null: discard output, -w: write out status code
    # -I: HEAD request only, -L: follow redirects
    local status_code=$(curl -s -o /dev/null -I -w "%{http_code}" "$full_url")
    
    # Check status without following redirects to detect redirects
    local initial_status=$(curl -s -o /dev/null -I -w "%{http_code}" --max-redirs 0 "$full_url")
    
    ((TOTAL_URLS++))
    
    if [[ "$initial_status" =~ ^2[0-9][0-9]$ ]]; then
        # Direct 200 response
        echo "$url" >> "$TEMP_VALID"
        ((VALID_COUNT++))
        echo "✓ Valid: $url"
    elif [[ "$initial_status" =~ ^3[0-9][0-9]$ ]]; then
        # Redirect detected
        echo "- \`$url\` - \`$file_path\`" >> "$TEMP_REDIRECT"
        ((REDIRECT_COUNT++))
        echo "→ Redirect ($initial_status): $url"
    elif [[ "$status_code" == "404" ]]; then
        # Not found
        echo "- \`$url\` - \`$file_path\`" >> "$TEMP_NOT_FOUND"
        ((NOT_FOUND_COUNT++))
        echo "✗ Not Found: $url"
    else
        # Other errors (treat as not found)
        echo "- \`$url\` - \`$file_path\` (Status: $status_code)" >> "$TEMP_NOT_FOUND"
        ((NOT_FOUND_COUNT++))
        echo "✗ Error ($status_code): $url"
    fi
}

# Parse the JSON file and extract unique new URLs with their file paths
echo "Extracting URLs from updated-docs.json..."

# Use jq to extract all new URLs with their file paths
# Format: URL|FILE_PATH
# The updated-docs.json file is in the .ai/2025-06-04/ directory
INPUT_FILE="$PROJECT_ROOT/.ai/2025-06-04/updated-docs.json"
jq -r 'to_entries | .[] | .key as $file | .value[] | "\(.[1])|\($file)"' "$INPUT_FILE" | sort -u > /tmp/urls_to_check.txt

# Check each URL
echo -e "\nChecking URLs...\n"

while IFS='|' read -r url file_path; do
    if [[ -n "$url" ]]; then
        check_url "$url" "$file_path"
    fi
done < /tmp/urls_to_check.txt

# Write valid URLs to output file
if [[ -s "$TEMP_VALID" ]]; then
    sort -u "$TEMP_VALID" | while read -r url; do
        echo "- \`$url\`" >> "$VALID_URLS_FILE"
    done
else
    echo "*No valid URLs found*" >> "$VALID_URLS_FILE"
fi

# Write redirect URLs to invalid file
if [[ -s "$TEMP_REDIRECT" ]]; then
    sort -u "$TEMP_REDIRECT" >> "$INVALID_URLS_FILE"
else
    sed -i '' '/### Redirects/a\
*No redirects found*
' "$INVALID_URLS_FILE"
fi

# Write not found URLs to invalid file
if [[ -s "$TEMP_NOT_FOUND" ]]; then
    sort -u "$TEMP_NOT_FOUND" >> "$INVALID_URLS_FILE"
else
    echo "*No 404 errors found*" >> "$INVALID_URLS_FILE"
fi

# Add summary to both files
SUMMARY=$(cat << EOF

## Summary

- Total URLs checked: $TOTAL_URLS
- Valid (HTTP 200): $VALID_COUNT
- Redirects (HTTP 30x): $REDIRECT_COUNT
- Not Found (HTTP 404): $NOT_FOUND_COUNT
EOF
)

echo "$SUMMARY" >> "$VALID_URLS_FILE"
echo "$SUMMARY" >> "$INVALID_URLS_FILE"

# Combine files into single report
cat > "$OUTPUT_DIR/url-verification-report.md" << EOF
# URL Verification Report

Generated on: $(date)
Base URL: https://canary.nx.dev

EOF

cat "$VALID_URLS_FILE" >> "$OUTPUT_DIR/url-verification-report.md"
echo "" >> "$OUTPUT_DIR/url-verification-report.md"
cat "$INVALID_URLS_FILE" >> "$OUTPUT_DIR/url-verification-report.md"

# Clean up temporary files
rm -f "$TEMP_VALID" "$TEMP_REDIRECT" "$TEMP_NOT_FOUND" /tmp/urls_to_check.txt
rm -f "$VALID_URLS_FILE" "$INVALID_URLS_FILE"

echo -e "\n✅ Verification complete!"
echo "Report saved to: $OUTPUT_DIR/url-verification-report.md"
echo -e "\nSummary:"
echo "- Total URLs checked: $TOTAL_URLS"
echo "- Valid (HTTP 200): $VALID_COUNT"
echo "- Redirects (HTTP 30x): $REDIRECT_COUNT"
echo "- Not Found (HTTP 404): $NOT_FOUND_COUNT"
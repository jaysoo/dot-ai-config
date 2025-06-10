#!/bin/bash

# Preview domain - can be overridden via BASE_URL environment variable
PREVIEW_DOMAIN="${BASE_URL:-https://nx.dev}"

# Output files
WORKING_URLS="working-urls.txt"
BAD_URLS="bad-urls.txt"
REDIRECT_URLS="redirect-urls.txt"

# Clear output files
> "$WORKING_URLS"
> "$BAD_URLS"
> "$REDIRECT_URLS"

# Counter variables
total=0
checked=0
working=0
redirects=0
bad=0

# Count total URLs
total=$(wc -l < nx-sitemap-urls.txt)

echo "Starting URL check for $total URLs..."
echo "This may take a while..."
echo ""

# Read each URL from the sitemap
while IFS= read -r url; do
    checked=$((checked + 1))
    
    # Extract the path from the URL
    path="${url#https://nx.dev}"
    
    # Build the preview URL
    preview_url="${PREVIEW_DOMAIN}${path}"
    
    # Check the URL (follow redirects with -L, get status code with -o /dev/null -s -w)
    status_code=$(curl -L -o /dev/null -s -w "%{http_code}" "$preview_url")
    
    # Categorize based on status code
    if [[ "$status_code" == "200" ]]; then
        echo "$url" >> "$WORKING_URLS"
        working=$((working + 1))
        echo -ne "\rProgress: $checked/$total | Working: $working | Redirects: $redirects | Bad: $bad"
    elif [[ "$status_code" =~ ^3[0-9][0-9]$ ]]; then
        echo "$url → Status: $status_code" >> "$REDIRECT_URLS"
        redirects=$((redirects + 1))
        echo -ne "\rProgress: $checked/$total | Working: $working | Redirects: $redirects | Bad: $bad"
    else
        echo "$url → Status: $status_code" >> "$BAD_URLS"
        bad=$((bad + 1))
        echo -ne "\rProgress: $checked/$total | Working: $working | Redirects: $redirects | Bad: $bad"
    fi
    
    # Add a small delay to avoid overwhelming the server
    sleep 0.05
    
done < nx-sitemap-urls.txt

echo ""
echo ""
echo "Check complete!"
echo "Total URLs checked: $checked"
echo "Working (200): $working"
echo "Redirects (30x): $redirects"
echo "Bad (404 or other errors): $bad"

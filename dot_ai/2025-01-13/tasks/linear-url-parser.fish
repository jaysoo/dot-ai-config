function linear
    # Parse Linear URL and extract issue ID
    set -l url $argv[1]
    
    # Extract the issue ID (segment after /issue/)
    set -l issue_id (echo $url | sed -n 's/.*\/issue\/\([^\/]*\).*/\1/p')
    
    if test -z "$issue_id"
        echo "Error: Could not extract issue ID from URL"
        return 1
    end
    
    echo "Extracted issue ID: $issue_id"
    jwt $issue_id
end
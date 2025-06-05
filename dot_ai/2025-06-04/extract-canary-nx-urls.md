# Extract All URLs from Canary Nx Documentation Site

## Task Description
Extract all URLs from the canary Nx documentation site (https://canary.nx.dev) to provide a comprehensive list of all available pages.

## Plan

### Step 1: Create URL extraction script
- Create a Node.js script that crawls the canary site
- Start with the sitemap at https://canary.nx.dev/sitemap-0.xml
- Parse the sitemap to get all URLs
- Optionally crawl pages to find additional internal links

### Step 2: Execute the script
- Run the script to extract all URLs
- Save results to a structured format (JSON/text)

### Step 3: Present results
- Provide the complete list of URLs
- Organize them in a readable format

## Implementation Details

The script will:
1. Fetch the sitemap XML from https://canary.nx.dev/sitemap-0.xml
2. Parse the XML to extract all `<loc>` elements
3. Clean and format the URLs
4. Save to output file
5. Display summary statistics

## Expected Outcome
- Complete list of all URLs available on the canary Nx documentation site
- Organized output showing the scope and structure of the documentation
- Ready-to-use URL list for further analysis or reference
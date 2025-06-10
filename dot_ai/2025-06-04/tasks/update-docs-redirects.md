# Update Documentation URLs Based on Redirect Rules

## Task Type
**Chore** - Update internal documentation URLs to match Next.js redirect rules

## Context
The nx-dev/nx-dev/redirect-rules.js file contains redirect mappings for documentation URLs. These redirects ensure old URLs continue to work, but we should update the documentation files to use the new URLs directly to avoid unnecessary redirects.

## Plan

### Step 1: Analyze redirect patterns and create URL mapping script
- Extract relevant redirects from `nxApiRedirects`, `nxRecipesRedirects`, and `nxModuleFederationConceptsRedirects`
- Handle Next.js wildcard syntax (`:slug*`)
- Create a Node.js script that can process markdown files

**Reasoning**: We need to understand the redirect patterns and create a reliable way to map old URLs to new ones. The script needs to handle wildcards properly.

### Step 2: Implement markdown URL finder and replacer
- Use glob to find all `.md` files under `docs/`
- Parse markdown content to find URLs (both inline links and reference-style links)
- Match URLs against redirect keys
- Replace with redirect values

**Reasoning**: We need to handle various markdown link formats and ensure we don't break valid links.

### Step 3: Handle edge cases and validation
- Ensure we don't replace partial URL matches
- Handle relative vs absolute URLs
- Validate that replacements are correct
- Create comprehensive logging

**Reasoning**: URL replacement can be error-prone. We need to be careful not to break working links or create invalid ones.

### Step 4: Generate tracking JSON file
- Track all modified files
- Record old URL → new URL mappings per file
- Format as JSON with file paths as keys

**Reasoning**: This provides an audit trail and allows for verification or rollback if needed.

### Step 5: Test and verify changes
- Run the script in dry-run mode first
- Review a sample of changes
- Ensure no markdown syntax is broken

**Reasoning**: Documentation is critical, so we need to ensure our changes don't break anything.

## Technical Details

### Redirect Pattern Examples
- Simple redirect: `/nx-api/devkit/:slug*` → `/reference/core-api/devkit/:slug*`
- Technology redirect: `/nx-api/angular/documents/:slug*` → `/technologies/angular/recipes/:slug*`
- Recipe redirect: `/recipes/module-federation/:slug*` → `/technologies/module-federation/recipes/:slug*`

### URL Matching Strategy
1. Extract base path from redirect key (before `:slug*`)
2. For each URL in markdown:
   - Check if it starts with any redirect key base path
   - If wildcard redirect, preserve the slug part
   - Replace with new base path + preserved slug

### Markdown Link Formats to Handle
- Inline: `[text](url)`
- Reference: `[text][ref]` with `[ref]: url`
- Auto-links: `<url>`
- Plain URLs in text

## Expected Outcome
1. A Node.js script that processes all markdown files and updates URLs
2. Updated markdown files with correct URLs (no more redirects needed)
3. A JSON file (`updated-docs.json`) tracking all changes:
   ```json
   {
     "docs/path/to/file.md": [
       ["/old/url", "/new/url"],
       ["/another/old", "/another/new"]
     ]
   }
   ```
4. No broken links or markdown syntax errors
5. Cleaner documentation that doesn't rely on redirects
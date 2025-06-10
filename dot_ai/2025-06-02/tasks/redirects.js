const fs = require('fs');
const path = require('path');

// Generate simple key-value redirects object
function generateSimpleRedirects() {
  const urlMatchesPath = path.join(__dirname, 'url-matches.json');
  
  if (!fs.existsSync(urlMatchesPath)) {
    console.error('❌ url-matches.json not found. Run the analysis scripts first.');
    return {};
  }
  
  const matchData = JSON.parse(fs.readFileSync(urlMatchesPath, 'utf8'));
  const { urlMatches } = matchData;
  
  const redirects = {};
  
  Object.entries(urlMatches).forEach(([oldUrl, matches]) => {
    const bestMatch = matches[0]; // Take the best match
    redirects[oldUrl] = bestMatch.newUrl;
  });
  
  return redirects;
}

// Export the redirects object
const nxRecipesRedirects = generateSimpleRedirects();

module.exports = { nxRecipesRedirects };

// If run directly, also save to a standalone file
if (require.main === module) {
  const redirectsContent = `// Auto-generated redirects for Nx recipes migration
// Generated on: ${new Date().toISOString()}

const nxRecipesRedirects = ${JSON.stringify(nxRecipesRedirects, null, 2)};

module.exports = { nxRecipesRedirects };
`;

  fs.writeFileSync('.ai/redirects-simple.js', redirectsContent);
  console.log('✅ Simple redirects exported to .ai/redirects-simple.js');
  console.log(`📊 Total redirects: ${Object.keys(nxRecipesRedirects).length}`);
} 
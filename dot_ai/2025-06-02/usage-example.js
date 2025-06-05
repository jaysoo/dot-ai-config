// Example usage of the nxRecipesRedirects object

const { nxRecipesRedirects } = require('./redirects-simple');

// Option 1: Use directly in your code
console.log('Total redirects:', Object.keys(nxRecipesRedirects).length);
console.log('Example redirect:', nxRecipesRedirects['/recipes/react/remix']);

// Option 2: Convert to Next.js redirects format if needed
function convertToNextjsFormat(redirectsObj) {
  return Object.entries(redirectsObj).map(([source, destination]) => ({
    source,
    destination,
    permanent: true
  }));
}

// Option 3: Use for checking if a URL needs redirect
function getRedirectUrl(path) {
  return nxRecipesRedirects[path] || null;
}

// Example usage
const testUrls = [
  '/recipes/react/remix',
  '/recipes/angular/migration',
  '/some/other/path'
];

testUrls.forEach(url => {
  const redirect = getRedirectUrl(url);
  if (redirect) {
    console.log(`${url} → ${redirect}`);
  } else {
    console.log(`${url} → No redirect needed`);
  }
});

module.exports = { convertToNextjsFormat, getRedirectUrl }; 
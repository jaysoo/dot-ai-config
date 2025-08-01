/* JavaScript for Cookiebot Banner */

// Function to handle "Allow all" button click
function allowAllCookies() {
  if (window.Cookiebot) {
    // Submit consent for all categories (statistics, marketing, preferences)
    window.Cookiebot.submitCustomConsent(true, true, true);
  }
}

// Function to handle "Deny" button click
function denyCookies() {
  if (window.Cookiebot) {
    // Deny all non-essential categories
    window.Cookiebot.submitCustomConsent(false, false, false);
  }
}

// Function to handle "Show details" link click
function showCookiebotDetails() {
  if (window.Cookiebot) {
    // Show the detailed consent dialog
    window.Cookiebot.renew();
  }
}

// Animation helper - add show class when dialog should be displayed
document.addEventListener('DOMContentLoaded', function() {
  // Watch for when Cookiebot displays the banner
  if (window.addEventListener) {
    window.addEventListener('CookiebotOnDialogDisplay', function() {
      var banner = document.getElementById('cookiebanner');
      if (banner) {
        // Add animation class after a small delay to ensure smooth animation
        setTimeout(function() {
          banner.classList.add('show');
        }, 100);
      }
    });
  }
});

// Optional: Hide banner with animation when consent is given
function hideBanner() {
  var banner = document.getElementById('cookiebanner');
  if (banner) {
    banner.classList.remove('show');
  }
}

// Listen for consent events to hide the banner
if (window.addEventListener) {
  window.addEventListener('CookiebotOnAccept', hideBanner);
  window.addEventListener('CookiebotOnDecline', hideBanner);
}
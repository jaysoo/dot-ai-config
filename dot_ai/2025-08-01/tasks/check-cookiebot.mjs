import puppeteer from 'puppeteer';

async function checkCookiebot() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    console.log('Browser console:', msg.type(), msg.text());
  });
  
  // Enable network logging
  page.on('response', response => {
    if (response.url().includes('cookiebot')) {
      console.log('Cookiebot network response:', response.status(), response.url());
    }
  });
  
  // Navigate to the page
  await page.goto('http://localhost:4200', { waitUntil: 'networkidle0' });
  
  // Check if Cookiebot is loaded
  const cookiebotLoaded = await page.evaluate(() => {
    return typeof window.Cookiebot !== 'undefined';
  });
  
  console.log('Cookiebot loaded:', cookiebotLoaded);
  
  // Check if cookie dialog is visible
  const dialogVisible = await page.evaluate(() => {
    const dialog = document.querySelector('#CybotCookiebotDialog');
    return dialog && window.getComputedStyle(dialog).display !== 'none';
  });
  
  console.log('Cookie dialog visible:', dialogVisible);
  
  // Get Cookiebot script details
  const scriptDetails = await page.evaluate(() => {
    const script = document.querySelector('script[id="Cookiebot"]');
    if (script) {
      return {
        src: script.src,
        dataCbid: script.getAttribute('data-cbid'),
        dataBlockingMode: script.getAttribute('data-blockingmode'),
        type: script.type,
        defer: script.defer
      };
    }
    return null;
  });
  
  console.log('Script details:', scriptDetails);
  
  // Wait a bit to see if dialog appears
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  await browser.close();
}

checkCookiebot().catch(console.error);
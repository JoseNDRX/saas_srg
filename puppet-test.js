const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  
  // Test body background color
  const bodyBg = await page.evaluate(() => {
    return window.getComputedStyle(document.body).backgroundColor;
  });
  console.log('Body BG Color:', bodyBg);
  
  // Test if Navbar is visible and its background
  const navBg = await page.evaluate(() => {
    const nav = document.querySelector('header');
    return nav ? window.getComputedStyle(nav).backgroundColor : 'not found';
  });
  console.log('Navbar BG Color:', navBg);
  
  // Check hero headline position/width
  const heroInfo = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    if (!h1) return 'No H1';
    const rect = h1.getBoundingClientRect();
    return { left: rect.left, width: rect.width, windowInnerWidth: window.innerWidth };
  });
  console.log('Hero H1 Rect:', heroInfo);

  // Output all computed styles for tailwind check
  const hasTailwind = await page.evaluate(() => {
    const el = document.createElement('div');
    el.className = 'bg-zinc-900 absolute hidden';
    document.body.appendChild(el);
    const bg = window.getComputedStyle(el).backgroundColor;
    return bg === 'rgb(24, 24, 27)'; // hex equivalent to zinc-900 in tailwind
  });
  console.log('Tailwind applied check (bg-zinc-900):', hasTailwind);

  await browser.close();
})();

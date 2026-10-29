import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto('http://localhost:5173/login');
  await page.locator('input[type="email"]').fill('student1@test.com');
  await page.locator('input[type="password"]').fill('StudPass123!');
  await page.locator('button[type="submit"]').click();
  await page.waitForURL('**/student/dashboard');

  await page.goto('http://localhost:5173/student/assistant');
  await page.waitForSelector('input');

  console.log('Sending question: Which layer does a router operate at?');
  const input = page.locator('input[placeholder*="Ask"]');
  await input.click();
  await input.fill('Which layer does a router operate at?');
  await page.locator('button[type="submit"]').click();

  // Wait for Gemini API response
  console.log('Waiting for AI response...');
  await page.waitForSelector('text=Router', { timeout: 12000 }).catch(() => {});
  await page.waitForTimeout(2000);

  const text = await page.innerText('body');
  console.log('--- Verification ---');
  console.log('Mentions Layer 3 or Network layer:', text.includes('Layer 3') || text.includes('Network layer') || text.includes('Network Layer'));
  console.log('Contains old static template:', text.includes('Core Concept**: Identify the foundational principles'));
  
  await browser.close();
})();

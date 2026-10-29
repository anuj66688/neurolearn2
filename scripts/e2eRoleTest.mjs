import { chromium } from 'playwright';

const baseUrl = 'http://localhost:5173';

const accounts = [
  { role: 'admin', email: 'admin@test.com', password: 'AdminPass123!', dashboardPath: '/admin/dashboard', dashboardText: 'ADMIN CONSOLE' },
  { role: 'teacher', email: 'teacher1@test.com', password: 'TeachPass123!', dashboardPath: '/teacher/dashboard', dashboardText: 'TEACHER PORTAL' },
  { role: 'student', email: 'student1@test.com', password: 'StudPass123!', dashboardPath: '/student/dashboard', dashboardText: 'STUDENT PORTAL' },
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const results = [];

  for (const acc of accounts) {
    try {
      await page.goto(`${baseUrl}/login`);
      await page.fill('input[type="email"]', acc.email);
      await page.fill('input[type="password"]', acc.password);
      await page.click('button[type="submit"]');
      await page.waitForURL(`${baseUrl}${acc.dashboardPath}`, { timeout: 8000 });
      await page.waitForSelector(`text=${acc.dashboardText}`, { timeout: 6000 });
      results.push({ role: acc.role, success: true, error: null });
      // log out
      const logoutBtn = await page.waitForSelector('button[data-testid="logout"]', { timeout: 4000 });
      if (logoutBtn) {
        await logoutBtn.click();
        await page.waitForURL(`${baseUrl}/login`, { timeout: 5000 });
      }
    } catch (e) {
      results.push({ role: acc.role, success: false, error: e.message });
    }
  }

  await browser.close();

  console.log('--- E2E Role Verification Results ---');
  results.forEach(r => {
    if (r.success) {
      console.log(`${r.role}: ✅`);
    } else {
      console.log(`${r.role}: ❌ – ${r.error}`);
    }
  });
})();

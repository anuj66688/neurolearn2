import { test, expect } from '@playwright/test';

test('Student Dashboard shows AI Suggested Topics', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.locator('input[type="email"]').fill('student1@test.com');
  await page.locator('input[type="password"]').fill('StudPass123!');
  await page.locator('button[type="submit"]').click();
  await page.waitForURL('**/student/dashboard');
  await page.waitForSelector('text=AI Suggested Topics');
  const card = page.locator('text=AI Suggested Topics');
  await expect(card).toBeVisible();
  await page.screenshot({ path: 'student_dashboard_ai_topics.png' });
});

test('Teacher Assessments generate AI quiz', async ({ page }) => {
  await page.goto('http://localhost:5173/login');
  await page.locator('input[type="email"]').fill('teacher1@test.com');
  await page.locator('input[type="password"]').fill('TeachPass123!');
  await page.locator('button[type="submit"]').click();
  await page.waitForURL('**/teacher/dashboard');
  await page.goto('http://localhost:5173/teacher/assessments');
  const button = page.locator('button', { hasText: /Generate AI Quiz/i });
  await expect(button).toBeVisible();
  page.on('dialog', async dialog => {
    console.log('Alert message:', dialog.message());
    await dialog.accept();
  });
  await button.click();
  await page.screenshot({ path: 'teacher_assessments_generate_quiz.png' });
});

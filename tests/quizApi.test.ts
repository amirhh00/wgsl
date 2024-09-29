import { test, expect } from '@playwright/test';
import { quizLevels } from '@/app/quiz/[level]/questions';

test.describe('Quiz API', () => {
  const baseUrl = 'http://localhost:3000';

  test.beforeEach(async ({ page }) => {
    // Clear cookies before each test
    await page.context().clearCookies();
  });

  test('should start a new quiz and submit first answer', async ({ page }) => {
    await page.goto(`${baseUrl}/quiz/1`);

    // Submit the first answer
    await page.click('input[name="answer"][value="1"]');
    await page.click('button[type="submit"]');

    // Check if redirected to the next question
    expect(page.url()).toBe(`${baseUrl}/quiz/2`);

    // Verify the quizId cookie is set
    const cookies = await page.context().cookies();
    const quizIdCookie = cookies.find((cookie) => cookie.name === 'quizId');
    expect(quizIdCookie).toBeTruthy();
  });

  test('should update existing quiz with subsequent answers', async ({ page }) => {
    // Start the quiz and submit first answer
    await page.goto(`${baseUrl}/quiz/1`);
    await page.click('input[name="answer"][value="1"]');
    await page.click('button[type="submit"]');

    // Submit second answer
    await page.click('input[name="answer"][value="2"]');
    await page.click('button[type="submit"]');

    // Check if redirected to the third question
    expect(page.url()).toBe(`${baseUrl}/quiz/3`);

    // Verify answer cookies are set
    const cookies = await page.context().cookies();
    expect(cookies.find((cookie) => cookie.name === 'answer-1')).toBeTruthy();
    expect(cookies.find((cookie) => cookie.name === 'answer-2')).toBeTruthy();
  });

  test('should complete quiz and redirect to score page', async ({ page }) => {
    for (let i = 1; i <= quizLevels.length; i++) {
      await page.goto(`${baseUrl}/quiz/${i}`);
      await page.click(`input[name="answer"][value="${(i % 4) + 1}"]`);
      await page.click('button[type="submit"]');
    }

    // Check if redirected to the score page
    expect(page.url()).toBe(`${baseUrl}/quiz/score`);

    // Verify score cookie is set
    const cookies = await page.context().cookies();
    const scoreCookie = cookies.find((cookie) => cookie.name === 'score');
    expect(scoreCookie).toBeTruthy();
  });

  test('should handle invalid quiz level', async ({ page }) => {
    const response = await page.goto(`${baseUrl}/quiz/999`);
    expect(response?.status()).toBe(404);
  });

  test('should handle missing answer submission', async ({ page }) => {
    await page.goto(`${baseUrl}/quiz/1`);

    // Submit form without selecting an answer
    await page.click('button[type="submit"]');

    // Check if still on the same page
    expect(page.url()).toBe(`${baseUrl}/quiz/1`);
  });
});

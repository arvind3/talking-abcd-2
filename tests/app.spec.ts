import { test, expect } from '@playwright/test';

test.describe('SIPs - Self-Describing ABCD', () => {
  test('should load the homepage and display 26 cards', async ({ page }) => {
    await page.goto('/');
    
    // Check title and header
    await expect(page).toHaveTitle(/SIPs - Self-Describing ABCD/);
    await expect(page.locator('h1')).toContainText('SIPs ABCD');
    
    // Should have exactly 26 alphabet cards
    const cards = page.locator('[id^="card-"]');
    await expect(cards).toHaveCount(26);

    // Verify the first card is 'A' for Apple
    const cardA = page.locator('#card-A');
    await expect(cardA).toContainText('A');
    await expect(cardA).toContainText('Apple', { ignoreCase: true });
  });

  test('should have a Play button on each card', async ({ page }) => {
    await page.goto('/');

    // Each card should have a Play button
    const cardA = page.locator('#card-A');
    const playButton = cardA.locator('button', { hasText: 'Play' });

    // Ensure the button is visible and interactive
    await expect(playButton).toBeVisible();
    await expect(playButton).toBeEnabled();

    // The Surprise Me button should be visible and enabled when nothing is playing
    const surpriseButton = page.locator('button', { hasText: 'Surprise Me!' });
    await expect(surpriseButton).toBeVisible();
    await expect(surpriseButton).toBeEnabled();
  });

  test('should trigger a random card when Surprise Me is clicked', async ({ page }) => {
    await page.goto('/');
    
    const surpriseButton = page.locator('button', { hasText: 'Surprise Me!' });
    await expect(surpriseButton).toBeVisible();
    await surpriseButton.click();

    // At least one card should now have a 'Stop' button (meaning it is playing)
    const stopButtons = page.locator('button', { hasText: 'Stop' });
    await expect(stopButtons).toHaveCount(1);
  });
});

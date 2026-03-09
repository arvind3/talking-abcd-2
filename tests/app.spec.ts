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
    await expect(cardA).toContainText('APPLE');
  });

  test('should play a story when a card is clicked', async ({ page }) => {
    await page.goto('/');
    
    // Click the Play button on the 'A' card
    const cardA = page.locator('#card-A');
    const playButton = cardA.locator('button', { hasText: 'Play' });
    
    // Ensure the button is visible and click it
    await expect(playButton).toBeVisible();
    await playButton.click();

    // The button should change to 'Stop' while playing
    const stopButton = cardA.locator('button', { hasText: 'Stop' });
    await expect(stopButton).toBeVisible();

    // The Surprise Me button should be disabled while a story is playing
    const surpriseButton = page.locator('button', { hasText: 'Surprise Me!' });
    await expect(surpriseButton).toBeDisabled();
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

import { test, expect } from '@playwright/test';

test.describe('Lesson Flow: First Lesson', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('should guide user through first lesson completion', async ({ page }) => {
        // 1. Navigate to Tutorials tab
        const tutorialsTab = page.getByRole('tab', { name: /tutorials/i });
        await tutorialsTab.click();
        await expect(tutorialsTab).toHaveAttribute('aria-selected', 'true');

        // 2. Select "Your First Emoji Program" lesson
        const lessonCard = page.locator('.lesson-card').filter({ hasText: /First Emoji Program/i });
        await lessonCard.click();

        // 3. Verify intro step
        await expect(page.locator('.tutorial-lesson-title')).toContainText('First Emoji Program');
        await expect(page.locator('.step-instruction')).toContainText(/Type this emoji code/i);

        // 4. Click "Try It" for the first step code
        await page.getByRole('button', { name: /try it/i }).click();

        // 5. Run the program (even if it's partial)
        await page.getByRole('button', { name: /run/i }).click();

        // 6. Navigate to next step
        await page.getByRole('button', { name: /next/i }).click();

        // 7. Second step
        await expect(page.locator('.step-instruction')).toContainText(/print the number/i);
        await page.getByRole('button', { name: /try it/i }).click();
        await page.getByRole('button', { name: /run/i }).click();

        // Verify output in console
        await expect(page.locator('.console-line')).toContainText('42');

        // 8. Final step
        await page.getByRole('button', { name: /next/i }).click();
        await expect(page.locator('.step-instruction')).toContainText(/stop the program/i);
        await page.getByRole('button', { name: /try it/i }).click();
        await page.getByRole('button', { name: /run/i }).click();

        // 9. Complete lesson
        const completeBtn = page.getByRole('button', { name: /Complete/i });
        await expect(completeBtn).toBeVisible();
        await completeBtn.click();

        // 10. Verify back at lesson list and lesson marked complete
        // The title "Tutorials" should appear
        const tutorialsHeading = page.locator('.tutorial-sidebar .panel-title');
        await expect(tutorialsHeading).toBeVisible({ timeout: 10000 });
        await expect(tutorialsHeading).toContainText('Tutorials');

        // Use a more specific locator for the completed check
        const completedLessonCard = page.locator('.lesson-card.lesson-completed').filter({ hasText: /First Emoji Program/i });
        await expect(completedLessonCard).toBeVisible();
    });
});

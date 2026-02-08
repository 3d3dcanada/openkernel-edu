import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility: OpenKernel EDU', () => {
    test('should pass basic accessibility checks on home page', async ({ page }) => {
        await page.goto('/');

        // Wait for content to load
        await expect(page.locator('.app-title')).toBeVisible();

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should pass accessibility checks on tutorials panel', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('tab', { name: /tutorials/i }).click();

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    test('should pass accessibility checks during lesson execution', async ({ page }) => {
        await page.goto('/');
        await page.getByRole('tab', { name: /tutorials/i }).click();
        await page.locator('.lesson-card').first().click();

        await expect(page.locator('.tutorial-lesson-title')).toBeVisible();

        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();

        expect(accessibilityScanResults.violations).toEqual([]);
    });
});

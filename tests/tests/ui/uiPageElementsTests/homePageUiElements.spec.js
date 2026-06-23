import { test, expect } from '@playwright/test';
import { HomePage } from '../../../pages/HomePage';

test.describe('Home page', () => {
    test.beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goTo();
    });

    test('should add a new goal', async ({ page }) => {
        const homePage = new HomePage(page);
        const title = 'Work on Playwright project';
        const timeframe = '1 week';
        const expectedSuccessMessage = `You have created a new goal: '${title}' to be completed in ${timeframe}`;
        await homePage.addGoal(title, timeframe);
        await expect(homePage.incompleteGoalsList.getByText(title)).toBeVisible();
        await expect(page.getByText(expectedSuccessMessage)).toBeVisible();
    });
});
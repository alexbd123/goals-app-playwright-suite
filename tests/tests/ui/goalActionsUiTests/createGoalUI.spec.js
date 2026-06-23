import { test, expect } from '@playwright/test';
import { HomePage } from '../../../pages/HomePage.js';
import { generateExpectedCreationSuccessMessage } from '../uiTestData/uiMessages.js';
import { generateRandomTitleTimeframe } from '../../../api/beHelper.js';

test.describe('Create goals UI tests', () => {
    test.beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goTo();
    });

    test('Create new goal', async ({ page }) => {
        const homePage = new HomePage(page);
        const { randomTitle, randomTimeframe } = generateRandomTitleTimeframe();
        const expectedSuccessMessage = generateExpectedCreationSuccessMessage(randomTitle, randomTimeframe);
        await homePage.addGoal(randomTitle, randomTimeframe);
        await expect(homePage.incompleteGoalsList.getByText(randomTitle)).toBeVisible();
        await expect(homePage.goalSubmissionMessage(expectedSuccessMessage)).toBeVisible();

        await homePage.deleteTestGoalFromUi(randomTitle)
    });
});
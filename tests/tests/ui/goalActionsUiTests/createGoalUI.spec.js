import { test, expect } from '@playwright/test';
import { HomePage } from '../../../pages/HomePage.js';
import { dynamicUiMessages } from '../uiTestData/uiMessages.js';
import { generateRandomTitleTimeframe, deleteGoalByTitle } from '../../../api/beHelper.js';

test.describe('Create goals UI tests', () => {
    test.beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goTo();
    });

    test('Create new goal', async ({ request, page }) => {
        const homePage = new HomePage(page);
        const { randomTitle, randomTimeframe } = generateRandomTitleTimeframe();

        const { creationSuccessMessage } = dynamicUiMessages(randomTitle, randomTimeframe);
        await homePage.addGoal(randomTitle, randomTimeframe);
        await expect(homePage.incompleteGoalsList.getByText(randomTitle)).toBeVisible();
        await expect(homePage.goalSubmissionMessage(creationSuccessMessage)).toBeVisible();

        await deleteGoalByTitle(request, randomTitle);
    });
});
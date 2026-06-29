import { test, expect } from '../../../fixtures.js';
import { HomePage } from '../../../pages/HomePage.js';
import { createGoalAndReturn, deleteGoalAndReturn } from '../../../api/requests.js';
import { createTestGoal } from '../../../factories/goalFactory.js';
import { request } from '@playwright/test';
import { trackGoal, generateRandomTitle, generateRandomTimeframe } from '../../../api/beHelper.js';
import { DeletedPage } from '../../../pages/DeletedPage.js';
import { dynamicUiMessages } from '../uiTestData/uiMessages.js';

test.describe('Delete goals UI test', () => {

    test.describe('Temporarily delete goals UI tests', () => {

        test('Temporarily delete goal', async ({ homePage, deletedPage, completedGoalForTest }) => {
            await homePage.goToHomeAndWaitForCompletedGoal(completedGoalForTest.title);
            const { tempDeleteGoalMessage } = dynamicUiMessages(completedGoalForTest.title);

            await homePage.clickTempDeleteButton(completedGoalForTest.id);
            await expect(deletedPage.deleteOrRestoreAlert).toHaveText(tempDeleteGoalMessage);
            await deletedPage.goToDeletedAndWaitForTempDeletedGoal(completedGoalForTest.title);

            await expect(homePage.incompleteGoalsList.getByText(completedGoalForTest.title)).not.toBeVisible()
            await expect(homePage.completedGoalsList.getByText(completedGoalForTest.title)).not.toBeVisible()
            await deletedPage.goTo();
            await expect(deletedPage.deletedGoalsList.getByText(completedGoalForTest.title)).toBeVisible()
        })

    })

    test.describe('Permanently delete goals UI tests', () => {

        test('Permanently delete goal', async ({ homePage, deletedPage, tempDeletedGoalForTest }) => {
            await deletedPage.goToDeletedAndWaitForTempDeletedGoal(tempDeletedGoalForTest.title);
            const { permaDeleteGoalMessage } = dynamicUiMessages(tempDeletedGoalForTest.title);

            await deletedPage.permaDeleteGoal(tempDeletedGoalForTest.id);

            await expect(deletedPage.deleteOrRestoreAlert).toHaveText(permaDeleteGoalMessage);
            await expect(deletedPage.deletedGoalsList.getByText(tempDeletedGoalForTest.title)).not.toBeVisible()
        });

    });
});
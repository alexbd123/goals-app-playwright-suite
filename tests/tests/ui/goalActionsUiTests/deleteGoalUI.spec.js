import { test, expect } from '@playwright/test';
import { HomePage } from '../../../pages/HomePage.js';
import { createGoalAndReturn, deleteGoalAndReturn } from '../../../api/requests.js';
import { createTestGoal } from '../../../factories/goalFactory.js';
import { request } from '@playwright/test';
import {
    addGoalIdToTeardownIfSuccess,
    getGoalIdsForTeardown,
    clearGoalIdsForTeardown,
    generateRandomTitle,
    generateRandomTimeframe,
    generateRandomTitleTimeframe
} from '../../../api/beHelper.js';
import { DeletedPage } from '../../../pages/DeletedPage.js';
import { generatePermaDeleteGoalMessage } from '../uiTestData/uiMessages.js';

test.describe('Delete goals UI test', () => {

    test.describe('Temporarily delete goals UI tests', () => {

        let goalIdsForTeardown = [];

        test.afterEach(async ({ request }) => {
            for (const goalId of getGoalIdsForTeardown()) {
                const { deletedStatus } =
                    await deleteGoalAndReturn(request, goalId);
                expect(deletedStatus).toBe(200);
            }
            clearGoalIdsForTeardown();
        });

        test('Temporarily delete goal', async ({ page, request }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal({
                title: generateRandomTitle(),
                timeframe: generateRandomTimeframe(),
                is_completed: 1
            }));
            addGoalIdToTeardownIfSuccess(createdGoal, createdStatus);
            const homePage = new HomePage(page);
            const deletedPage = new DeletedPage(page);
            await homePage.goToHomeAndWaitForCompletedGoal(createdGoal.title);

            homePage.clickTempDeleteButton(createdGoal.id);
            await expect(homePage.incompleteGoalsList.getByText(createdGoal.title)).not.toBeVisible()
            await expect(homePage.completedGoalsList.getByText(createdGoal.title)).not.toBeVisible()
            await deletedPage.goTo();
            await expect(deletedPage.deletedGoalsList.getByText(createdGoal.title)).toBeVisible()
        })
    })

    test.describe('Permanently delete goals UI tests', () => {
        test('Permanently delete goal', async ({ page, request }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal({
                title: generateRandomTitle(),
                timeframe: generateRandomTimeframe(),
                is_completed: 1,
                is_deleted: 1
            }));
            addGoalIdToTeardownIfSuccess(createdGoal, createdStatus);
            const expectedPermaDeleteMessage = generatePermaDeleteGoalMessage(createdGoal.title);
            const homePage = new HomePage(page);
            const deletedPage = new DeletedPage(page);
            await deletedPage.goToDeletedAndWaitForTempDeletedGoal(createdGoal.title);

            await deletedPage.permaDeleteGoal(createdGoal.id);
            await expect(deletedPage.deleteOrRestoreAlert).toHaveText(expectedPermaDeleteMessage);
            await expect(deletedPage.deletedGoalsList.getByText(createdGoal.title)).not.toBeVisible()
        });
    });
});
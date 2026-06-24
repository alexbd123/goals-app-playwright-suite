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

        test.afterEach(async ({ request, goalIdsForTeardown }) => {
            for (const goalId of goalIdsForTeardown) {
                const { deletedMessage, deletedStatus } = await deleteGoalAndReturn(request, goalId)
                expect(deletedStatus).toBe(200);
            };
        });

        test('Temporarily delete goal', async ({ page, request, goalIdsForTeardown }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal({
                title: generateRandomTitle(),
                timeframe: generateRandomTimeframe(),
                is_completed: 1
            }));
            trackGoal(goalIdsForTeardown, createdGoal, createdStatus);
            const { tempDeleteGoalMessage } = dynamicUiMessages(createdGoal.title);
            const homePage = new HomePage(page);
            const deletedPage = new DeletedPage(page);
            await homePage.goToHomeAndWaitForCompletedGoal(createdGoal.title);

            homePage.clickTempDeleteButton(createdGoal.id);
            await expect(deletedPage.deleteOrRestoreAlert).toHaveText(tempDeleteGoalMessage);
            await expect(homePage.incompleteGoalsList.getByText(createdGoal.title)).not.toBeVisible()
            await expect(homePage.completedGoalsList.getByText(createdGoal.title)).not.toBeVisible()
            await deletedPage.goTo();
            await expect(deletedPage.deletedGoalsList.getByText(createdGoal.title)).toBeVisible()
        })

    })

    test.describe('Permanently delete goals UI tests', () => {

        test('Permanently delete goal', async ({ page, request, goalIdsForTeardown }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal({
                title: generateRandomTitle(),
                timeframe: generateRandomTimeframe(),
                is_completed: 1,
                is_deleted: 1
            }));
            trackGoal(goalIdsForTeardown, createdGoal, createdStatus);
            const { permaDeleteGoalMessage } = dynamicUiMessages(createdGoal.title);
            const homePage = new HomePage(page);
            const deletedPage = new DeletedPage(page);
            await deletedPage.goToDeletedAndWaitForTempDeletedGoal(createdGoal.title);

            await deletedPage.permaDeleteGoal(createdGoal.id);
            await expect(deletedPage.deleteOrRestoreAlert).toHaveText(permaDeleteGoalMessage);
            await expect(deletedPage.deletedGoalsList.getByText(createdGoal.title)).not.toBeVisible()
        });

    });
});
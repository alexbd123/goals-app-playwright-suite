import { test, expect } from '../../../fixtures.js';
import { HomePage } from '../../../pages/HomePage.js';
import { DeletedPage } from '../../../pages/DeletedPage.js';
import { dynamicUiMessages } from '../uiTestData/uiMessages.js';
import { trackGoal, generateRandomTitle, generateRandomTimeframe } from '../../../api/beHelper.js';
import { createGoalAndReturn, deleteGoalAndReturn } from '../../../api/requests.js';
import { createTestGoal } from '../../../factories/goalFactory.js';

test.describe('Restore goals UI tests', () => {

    test('Temporarily deleted goal has restore button', async ({ tempDeletedGoalForTest, deletedPage }) => {
        await deletedPage.goToDeletedAndWaitForTempDeletedGoal(tempDeletedGoalForTest.title);

        await expect(deletedPage.goalCardRestoreButton(tempDeletedGoalForTest.id)).toBeVisible();
    })

    test('User can restore temporarily deleted goal', async ({ tempDeletedGoalForTest, homePage, deletedPage }) => {
        await deletedPage.goToDeletedAndWaitForTempDeletedGoal(tempDeletedGoalForTest.title);
        const { restoreGoalMessage } = dynamicUiMessages(tempDeletedGoalForTest.title);
        await deletedPage.goToDeletedAndWaitForTempDeletedGoal(tempDeletedGoalForTest.title);

        deletedPage.restoreGoal(tempDeletedGoalForTest.id);
        await expect(deletedPage.deleteOrRestoreAlert).toHaveText(restoreGoalMessage);
        await expect(deletedPage.deletedGoalsList.getByText(tempDeletedGoalForTest.title)).not.toBeVisible()
    })

})
import { test, expect } from '../../../fixtures.js';
import { HomePage } from '../../../pages/HomePage.js';
import { createGoalAndReturn, deleteGoalAndReturn } from '../../../api/requests.js';
import { createTestGoal } from '../../../factories/goalFactory.js';
import { request } from '@playwright/test';
import {
    trackGoal,
    generateRandomTitle,
    generateRandomTimeframe,
    generateRandomTitleTimeframe
} from '../../../api/beHelper.js';
import { staticUiMessages } from '../uiTestData/uiMessages.js';

test.describe('Update goals UI tests', () => {

    const { invalidTitleTimeframeEditMessage } = staticUiMessages();

    test.describe('Positive update goals UI tests', () => {

        test('User can update a goal with a new title and timeframe', async ({ incompleteGoalForTest, homePage }) => {
            await homePage.goToHomeAndWaitForIncompleteGoal(incompleteGoalForTest.title);
            const { randomTitle, randomTimeframe } = generateRandomTitleTimeframe();

            await homePage.updateGoal(incompleteGoalForTest.id, randomTitle, randomTimeframe);
            await expect(homePage.goalCardTitle(incompleteGoalForTest.id)).toHaveText(randomTitle);
            await expect(homePage.goalCardTimeframe(incompleteGoalForTest.id)).toHaveText(randomTimeframe);
        });

        test('User can update goal with only a new title', async ({ incompleteGoalForTest, homePage }) => {
            await homePage.goToHomeAndWaitForIncompleteGoal(incompleteGoalForTest.title);

            const randomTitle = generateRandomTitle();
            await homePage.updateGoal(incompleteGoalForTest.id, randomTitle, undefined);
            await expect(homePage.goalCardTitle(incompleteGoalForTest.id)).toHaveText(randomTitle);
            await expect(homePage.goalCardTimeframe(incompleteGoalForTest.id)).toHaveText(incompleteGoalForTest.timeframe);
        });

        test('User can update goal with only a new timeframe', async ({ incompleteGoalForTest, homePage }) => {
            await homePage.goToHomeAndWaitForIncompleteGoal(incompleteGoalForTest.title);

            const randomTimeframe = generateRandomTimeframe();
            await homePage.updateGoal(incompleteGoalForTest.id, undefined, randomTimeframe);
            await expect(homePage.goalCardTitle(incompleteGoalForTest.id)).toHaveText(incompleteGoalForTest.title);
            await expect(homePage.goalCardTimeframe(incompleteGoalForTest.id)).toHaveText(randomTimeframe);
        });
    })

    test.describe('Negative update goals UI tests', () => {

        test('Cannot update goal when title is empty space', async ({ incompleteGoalForTest, homePage }) => {
            await homePage.goToHomeAndWaitForIncompleteGoal(incompleteGoalForTest.title);

            await homePage.updateGoal(incompleteGoalForTest.id, " ", undefined);
            await expect(homePage.goalSubmissionAlert).toHaveText(invalidTitleTimeframeEditMessage);
            await expect(homePage.goalCardTitle(incompleteGoalForTest.id)).toHaveText(incompleteGoalForTest.title);
        });

        test('Cannot update goal when timeframe is empty space', async ({ incompleteGoalForTest, homePage }) => {
            await homePage.goToHomeAndWaitForIncompleteGoal(incompleteGoalForTest.title);

            await homePage.updateGoal(incompleteGoalForTest.id, undefined, " ");
            await expect(homePage.goalSubmissionAlert).toHaveText(invalidTitleTimeframeEditMessage);
            await expect(homePage.goalCardTimeframe(incompleteGoalForTest.id)).toHaveText(incompleteGoalForTest.timeframe);
        });

    })
});
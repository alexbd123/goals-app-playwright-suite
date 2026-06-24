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

    test.afterEach(async ({ request, goalIdsForTeardown }) => {
        for (const goalId of goalIdsForTeardown) {
            const { deletedMessage, deletedStatus } = await deleteGoalAndReturn(request, goalId)
            expect(deletedStatus).toBe(200);
        };
    });

    test.describe('Positive update goals UI tests', () => {

        test('User can update a goal with a new title and timeframe', async ({ page, request, goalIdsForTeardown }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal({
                title: generateRandomTitle(),
                timeframe: generateRandomTimeframe()
            }));
            trackGoal(goalIdsForTeardown, createdGoal, createdStatus);
            const homePage = new HomePage(page);
            await homePage.goToHomeAndWaitForIncompleteGoal(createdGoal.title);
            const { randomTitle, randomTimeframe } = generateRandomTitleTimeframe();

            await homePage.updateGoal(createdGoal.id, randomTitle, randomTimeframe);
            await expect(homePage.goalCardTitle(createdGoal.id)).toHaveText(randomTitle);
            await expect(homePage.goalCardTimeframe(createdGoal.id)).toHaveText(randomTimeframe);
        });

        test('User can update goal with only a new title', async ({ page, request, goalIdsForTeardown }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal({
                title: generateRandomTitle(),
                timeframe: generateRandomTimeframe()
            }));
            trackGoal(goalIdsForTeardown, createdGoal, createdStatus);
            const homePage = new HomePage(page);
            await homePage.goToHomeAndWaitForIncompleteGoal(createdGoal.title);

            const randomTitle = generateRandomTitle();
            await homePage.updateGoal(createdGoal.id, randomTitle, undefined);
            await expect(homePage.goalCardTitle(createdGoal.id)).toHaveText(randomTitle);
            await expect(homePage.goalCardTimeframe(createdGoal.id)).toHaveText(createdGoal.timeframe);
        });

        test('User can update goal with only a new timeframe', async ({ page, request, goalIdsForTeardown }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal({
                title: generateRandomTitle(),
                timeframe: generateRandomTimeframe()
            }));
            trackGoal(goalIdsForTeardown, createdGoal, createdStatus);
            const homePage = new HomePage(page);
            await homePage.goToHomeAndWaitForIncompleteGoal(createdGoal.title);

            const randomTimeframe = generateRandomTimeframe();
            await homePage.updateGoal(createdGoal.id, undefined, randomTimeframe);
            await expect(homePage.goalCardTitle(createdGoal.id)).toHaveText(createdGoal.title);
            await expect(homePage.goalCardTimeframe(createdGoal.id)).toHaveText(randomTimeframe);
        });
    })

    test.describe('Negative update goals UI tests', () => {

        test('Cannot update goal when title is empty space', async ({ page, request, goalIdsForTeardown }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal({
                title: generateRandomTitle(),
                timeframe: generateRandomTimeframe()
            }));
            trackGoal(goalIdsForTeardown, createdGoal, createdStatus);
            const homePage = new HomePage(page);
            await homePage.goToHomeAndWaitForIncompleteGoal(createdGoal.title);

            await homePage.updateGoal(createdGoal.id, " ", undefined);
            await expect(homePage.goalSubmissionAlert).toHaveText(invalidTitleTimeframeEditMessage);
            await expect(homePage.goalCardTitle(createdGoal.id)).toHaveText(createdGoal.title);
        });

        test('Cannot update goal when timeframe is empty space', async ({ page, request, goalIdsForTeardown }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal({
                title: generateRandomTitle(),
                timeframe: generateRandomTimeframe()
            }));
            trackGoal(goalIdsForTeardown, createdGoal, createdStatus);
            const homePage = new HomePage(page);
            await homePage.goToHomeAndWaitForIncompleteGoal(createdGoal.title);

            await homePage.updateGoal(createdGoal.id, undefined, " ");
            await expect(homePage.goalSubmissionAlert).toHaveText(invalidTitleTimeframeEditMessage);
            await expect(homePage.goalCardTimeframe(createdGoal.id)).toHaveText(createdGoal.timeframe);
        });

    })
});
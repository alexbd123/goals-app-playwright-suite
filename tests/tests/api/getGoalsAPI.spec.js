import { test, expect } from '@playwright/test';
import { getAllGoalsAndReturn, getGoalByIdAndReturn, createGoalAndReturn, deleteGoalAndReturn } from '../../api/requests.js';
import { createTestGoal } from '../../factories/goalFactory.js';
import { provideResponseMessages } from './apiTestData/responseMessages.js';
import { generateNonExistentId } from '../../api/beHelper.js';
import {
    addGoalIdToTeardownIfSuccess,
    getGoalIdsForTeardown,
    clearGoalIdsForTeardown
} from '../../api/beHelper.js';

test.describe('GET goals tests', () => {

    const {
        invalidGoalIdMessage,
        nonExistentIdMessage
    } = provideResponseMessages();

    test.afterEach(async ({ request }) => {
        for (const goalId of getGoalIdsForTeardown()) {
            const { deletedStatus } =
                await deleteGoalAndReturn(request, goalId);
            expect(deletedStatus).toBe(200);
        }

        clearGoalIdsForTeardown();
    });


    test.describe('Positive GET goals tests', () => {
        test('Get all goals', async ({ request }) => {
            const { goals, status } = await getAllGoalsAndReturn(request);
            expect(status).toBe(200);
            expect(Array.isArray(goals)).toBe(true);
        });

        test('Create goal and retrieve it by ID', async ({ request }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal());
            addGoalIdToTeardownIfSuccess(createdGoal, createdStatus);
            const { retrievedGoal, retrievedStatus } = await getGoalByIdAndReturn(request, createdGoal.id);
            expect(retrievedStatus).toBe(200);

            expect(retrievedGoal).toEqual(createdGoal);
        });
    })

    test.describe('Negative GET goals tests', () => {
        test('Cannot retrieve goal with non-numeric Id', async ({ request }) => {
            const { retrievedGoal, retrievedStatus } = await getGoalByIdAndReturn(request, "banana");

            expect(retrievedStatus).toBe(400);
            expect(retrievedGoal.error).toBe(invalidGoalIdMessage);
        });

        test('Cannot retrieve goal with non-existent ID', async ({ request }) => {
            const nonExistentId = await generateNonExistentId(request);
            const { retrievedGoal, retrievedStatus } = await getGoalByIdAndReturn(request, nonExistentId);

            expect(retrievedStatus).toBe(404);
            expect(retrievedGoal.error).toBe(nonExistentIdMessage);
        });
    })
})
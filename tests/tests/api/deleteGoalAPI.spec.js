import { test, expect } from '@playwright/test';
import { getAllGoalsAndReturn, getGoalByIdAndReturn, createGoalAndReturn, updateGoalAndReturn, deleteGoalAndReturn } from '../../api/requests.js';
import { createTestGoal } from '../../factories/goalFactory.js';
import { generateNonExistentId } from '../../api/beHelper.js';
import { provideResponseMessages } from './apiTestData/responseMessages.js';
import {
    addGoalIdToTeardownIfSuccess,
    getGoalIdsForTeardown,
    clearGoalIdsForTeardown
} from '../../api/beHelper.js';

test.describe('DELETE goal tests', () => {
    test.afterEach(async ({ request }) => {
        for (const goalId of getGoalIdsForTeardown()) {
            const { deletedStatus } =
                await deleteGoalAndReturn(request, goalId);

            expect(deletedStatus).toBe(200);
        }
        clearGoalIdsForTeardown();
    });

    const {
        deleteSuccessMessage,
        nonExistentIdMessage,
        invalidGoalIdMessage
    } = provideResponseMessages();

    test.describe('Positive delete goal API tests', () => {
        test('Delete an existing goal', async ({ request }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal());
            expect(createdStatus).toBe(201);
            const { deletedMessage, deletedStatus } = await deleteGoalAndReturn(request, createdGoal.id)

            expect(deletedStatus).toBe(200);
            expect(deletedMessage.message).toBe(deleteSuccessMessage);
        });
    })

    test.describe('Negative delete goal API tests', () => {
        test('Cannot delete goal with non-numeric ID', async ({ request }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal());
            expect(createdStatus).toBe(201);
            const { deletedMessage, deletedStatus } = await deleteGoalAndReturn(request, "Susan");

            expect(deletedStatus).toBe(400);
            expect(deletedMessage.error).toBe(invalidGoalIdMessage);
        })

        test('Cannot delete goal with non-existent ID', async ({ request }) => {
            const nonExistentId = await generateNonExistentId(request);
            const { deletedMessage, deletedStatus } = await deleteGoalAndReturn(request, nonExistentId);

            expect(deletedStatus).toBe(404);
            expect(deletedMessage.error).toBe(nonExistentIdMessage);
        })
    })
});
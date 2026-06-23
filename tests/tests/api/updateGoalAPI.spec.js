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

test.describe('Update goal API tests', () => {
    test.afterEach(async ({ request }) => {
        for (const goalId of getGoalIdsForTeardown()) {
            const { deletedStatus } =
                await deleteGoalAndReturn(request, goalId);

            expect(deletedStatus).toBe(200);
        }

        clearGoalIdsForTeardown();
    });

    const {
        invalidGoalIdMessage,
        nonExistentIdMessage,
        emptyTitleOrTimeframeUpdateMessage,
        invalidUpdatePayloadMessage,
        invalidCompletionValueMessage,
        invalidDeletionValueMessage,
        invalidDeleteBecauseNotCompletedMessage
    } = provideResponseMessages();

    test.describe('Positive update goals API tests', () => {
        test('Update an existing goal', async ({ request }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal());
            addGoalIdToTeardownIfSuccess(createdGoal, createdStatus);
            const updateExpected = createTestGoal({ title: "updated title", timeframe: "updated timeframe" });
            const { updatedGoal, updatedStatus } = await updateGoalAndReturn(request, createdGoal.id, updateExpected)
            expect(updatedStatus).toBe(200);

            expect(updatedGoal.id).toBe(createdGoal.id);
            expect(updatedGoal.title).toBe(updateExpected.title);
            expect(updatedGoal.timeframe).toBe(updateExpected.timeframe);
            expect(updatedGoal.is_completed).toBe(updateExpected.is_completed);
            expect(updatedGoal.is_deleted).toBe(updateExpected.is_deleted);
        });
    })

    test.describe('Negative update goals API tests', () => {
        test('Cannot update goal with non-numeric ID', async ({ request }) => {
            const { updatedGoal, updatedStatus } = await updateGoalAndReturn(request, "apple", createTestGoal());
            addGoalIdToTeardownIfSuccess(updatedGoal, updatedStatus);


            expect(updatedStatus).toBe(400);
            expect(updatedGoal.error).toBe(invalidGoalIdMessage);
        })

        test('Cannot update goal with non-existent ID', async ({ request }) => {
            const nonExistentId = await generateNonExistentId(request);
            const { updatedGoal, updatedStatus } = await updateGoalAndReturn(request, nonExistentId, createTestGoal());
            addGoalIdToTeardownIfSuccess(updatedGoal, updatedStatus);


            expect(updatedStatus).toBe(404);
            expect(updatedGoal.error).toBe(nonExistentIdMessage);
        })

        test('Cannot update goal with empty title', async ({ request }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal());
            addGoalIdToTeardownIfSuccess(createdGoal, createdStatus);
            const { updatedGoal, updatedStatus } = await updateGoalAndReturn(request, createdGoal.id,
                {
                    ...createdGoal,
                    title: ""
                });
            addGoalIdToTeardownIfSuccess(updatedGoal, updatedStatus);

            expect(updatedStatus).toBe(400);
            expect(updatedGoal.error).toBe(emptyTitleOrTimeframeUpdateMessage);

        })

        test('Cannot update goal with empty timeframe', async ({ request }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal());
            addGoalIdToTeardownIfSuccess(createdGoal, createdStatus);
            const { updatedGoal, updatedStatus } = await updateGoalAndReturn(request, createdGoal.id,
                {
                    ...createdGoal,
                    timeframe: ""
                });
            addGoalIdToTeardownIfSuccess(updatedGoal, updatedStatus);

            expect(updatedStatus).toBe(400);
            expect(updatedGoal.error).toBe(emptyTitleOrTimeframeUpdateMessage);

        })

        test('Cannot update goal with no title', async ({ request }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal());
            addGoalIdToTeardownIfSuccess(createdGoal, createdStatus);
            const { updatedGoal, updatedStatus } = await updateGoalAndReturn(request, createdGoal.id,
                {
                    ...createdGoal,
                    title: undefined
                });
            addGoalIdToTeardownIfSuccess(updatedGoal, updatedStatus);

            expect(updatedStatus).toBe(400);
            expect(updatedGoal.error).toBe(invalidUpdatePayloadMessage);

        })

        test('Cannot update goal with no timeframe', async ({ request }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal());
            addGoalIdToTeardownIfSuccess(createdGoal, createdStatus);
            const { updatedGoal, updatedStatus } = await updateGoalAndReturn(request, createdGoal.id,
                {
                    ...createdGoal,
                    timeframe: undefined
                });
            addGoalIdToTeardownIfSuccess(updatedGoal, updatedStatus);

            expect(updatedStatus).toBe(400);
            expect(updatedGoal.error).toBe(invalidUpdatePayloadMessage);

        })

        test('Cannot update goal with no completion status', async ({ request }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal());
            addGoalIdToTeardownIfSuccess(createdGoal, createdStatus);
            const { updatedGoal, updatedStatus } = await updateGoalAndReturn(request, createdGoal.id,
                {
                    ...createdGoal,
                    is_completed: undefined
                });
            addGoalIdToTeardownIfSuccess(updatedGoal, updatedStatus);

            expect(updatedStatus).toBe(400);
            expect(updatedGoal.error).toBe(invalidUpdatePayloadMessage);

        })

        test('Cannot update goal with no deletion status', async ({ request }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal());
            addGoalIdToTeardownIfSuccess(createdGoal, createdStatus);
            const { updatedGoal, updatedStatus } = await updateGoalAndReturn(request, createdGoal.id,
                {
                    ...createdGoal,
                    is_deleted: undefined
                });
            addGoalIdToTeardownIfSuccess(updatedGoal, updatedStatus);

            expect(updatedStatus).toBe(400);
            expect(updatedGoal.error).toBe(invalidUpdatePayloadMessage);

        })

        test('Cannot update goal with incorrect completion value', async ({ request }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal());
            addGoalIdToTeardownIfSuccess(createdGoal, createdStatus);
            const { updatedGoal, updatedStatus } = await updateGoalAndReturn(request, createdGoal.id,
                {
                    ...createdGoal,
                    is_completed: 2
                });
            addGoalIdToTeardownIfSuccess(updatedGoal, updatedStatus);

            expect(updatedStatus).toBe(400);
            expect(updatedGoal.error).toBe(invalidCompletionValueMessage);
        })

        test('Cannot update goal with incorrect deletion value', async ({ request }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal());
            addGoalIdToTeardownIfSuccess(createdGoal, createdStatus);
            const { updatedGoal, updatedStatus } = await updateGoalAndReturn(request, createdGoal.id,
                {
                    ...createdGoal,
                    is_deleted: 2
                });
            addGoalIdToTeardownIfSuccess(updatedGoal, updatedStatus);

            expect(updatedStatus).toBe(400);
            expect(updatedGoal.error).toBe(invalidDeletionValueMessage);
        })

        test('Cannot update goal to be deleted if goal is not completed', async ({ request }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal());
            addGoalIdToTeardownIfSuccess(createdGoal, createdStatus);
            const { updatedGoal, updatedStatus } = await updateGoalAndReturn(request, createdGoal.id,
                {
                    ...createdGoal,
                    is_deleted: 1
                });
            addGoalIdToTeardownIfSuccess(updatedGoal, updatedStatus);

            expect(updatedStatus).toBe(400);
            expect(updatedGoal.error).toBe(invalidDeleteBecauseNotCompletedMessage);
        })
    })
})
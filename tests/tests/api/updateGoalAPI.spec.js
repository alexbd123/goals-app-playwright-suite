import { test, expect } from '../../fixtures.js';
import { createGoalAndReturn, updateGoalAndReturn, deleteGoalAndReturn } from '../../api/requests.js';
import { createTestGoal } from '../../factories/goalFactory.js';
import { provideResponseMessages } from './apiTestData/responseMessages.js';
import { trackGoal, runBackendTeardown } from '../../api/beHelper.js';

test.describe('Update goal API tests', () => {

    test.afterEach(async ({ request, goalIdsForTeardown }) => {
        await runBackendTeardown(request, goalIdsForTeardown);
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

        test('Update an existing goal', async ({ request, goalIdsForTeardown }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal());
            trackGoal(goalIdsForTeardown, createdGoal, createdStatus);
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

        test('Cannot update goal with non-numeric ID', async ({ request, goalIdsForTeardown }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal());
            trackGoal(goalIdsForTeardown, createdGoal, createdStatus);
            const { updatedGoal, updatedStatus } = await updateGoalAndReturn(request, "apple", createdGoal);


            expect(updatedStatus).toBe(400);
            expect(updatedGoal.error).toBe(invalidGoalIdMessage);
        })

        test('Cannot update goal with non-existent ID', async ({ request, goalIdsForTeardown }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal());
            trackGoal(goalIdsForTeardown, createdGoal, createdStatus);
            const { updatedGoal, updatedStatus } = await updateGoalAndReturn(request, Number.MAX_SAFE_INTEGER, createdGoal);

            expect(updatedStatus).toBe(404);
            expect(updatedGoal.error).toBe(nonExistentIdMessage);
        })

        test('Cannot update goal with empty title', async ({ request, goalIdsForTeardown }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal());
            trackGoal(goalIdsForTeardown, createdGoal, createdStatus);
            const { updatedGoal, updatedStatus } = await updateGoalAndReturn(request, createdGoal.id,
                {
                    ...createdGoal,
                    title: ""
                });

            expect(updatedStatus).toBe(400);
            expect(updatedGoal.error).toBe(emptyTitleOrTimeframeUpdateMessage);

        })

        test('Cannot update goal with empty timeframe', async ({ request, goalIdsForTeardown }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal());
            trackGoal(goalIdsForTeardown, createdGoal, createdStatus);
            const { updatedGoal, updatedStatus } = await updateGoalAndReturn(request, createdGoal.id,
                {
                    ...createdGoal,
                    timeframe: ""
                });

            expect(updatedStatus).toBe(400);
            expect(updatedGoal.error).toBe(emptyTitleOrTimeframeUpdateMessage);

        })

        test('Cannot update goal with no title', async ({ request, goalIdsForTeardown }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal());
            trackGoal(goalIdsForTeardown, createdGoal, createdStatus);
            const { updatedGoal, updatedStatus } = await updateGoalAndReturn(request, createdGoal.id,
                {
                    ...createdGoal,
                    title: undefined
                });

            expect(updatedStatus).toBe(400);
            expect(updatedGoal.error).toBe(invalidUpdatePayloadMessage);

        })

        test('Cannot update goal with no timeframe', async ({ request, goalIdsForTeardown }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal());
            trackGoal(goalIdsForTeardown, createdGoal, createdStatus);
            const { updatedGoal, updatedStatus } = await updateGoalAndReturn(request, createdGoal.id,
                {
                    ...createdGoal,
                    timeframe: undefined
                });

            expect(updatedStatus).toBe(400);
            expect(updatedGoal.error).toBe(invalidUpdatePayloadMessage);

        })

        test('Cannot update goal with no completion status', async ({ request, goalIdsForTeardown }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal());
            trackGoal(goalIdsForTeardown, createdGoal, createdStatus);
            const { updatedGoal, updatedStatus } = await updateGoalAndReturn(request, createdGoal.id,
                {
                    ...createdGoal,
                    is_completed: undefined
                });

            expect(updatedStatus).toBe(400);
            expect(updatedGoal.error).toBe(invalidUpdatePayloadMessage);

        })

        test('Cannot update goal with no deletion status', async ({ request, goalIdsForTeardown }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal());
            trackGoal(goalIdsForTeardown, createdGoal, createdStatus);
            const { updatedGoal, updatedStatus } = await updateGoalAndReturn(request, createdGoal.id,
                {
                    ...createdGoal,
                    is_deleted: undefined
                });

            expect(updatedStatus).toBe(400);
            expect(updatedGoal.error).toBe(invalidUpdatePayloadMessage);

        })

        test('Cannot update goal with incorrect completion value', async ({ request, goalIdsForTeardown }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal());
            trackGoal(goalIdsForTeardown, createdGoal, createdStatus);
            const { updatedGoal, updatedStatus } = await updateGoalAndReturn(request, createdGoal.id,
                {
                    ...createdGoal,
                    is_completed: 2
                });

            expect(updatedStatus).toBe(400);
            expect(updatedGoal.error).toBe(invalidCompletionValueMessage);
        })

        test('Cannot update goal with incorrect deletion value', async ({ request, goalIdsForTeardown }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal());
            trackGoal(goalIdsForTeardown, createdGoal, createdStatus);
            const { updatedGoal, updatedStatus } = await updateGoalAndReturn(request, createdGoal.id,
                {
                    ...createdGoal,
                    is_deleted: 2
                });

            expect(updatedStatus).toBe(400);
            expect(updatedGoal.error).toBe(invalidDeletionValueMessage);
        })

        test('Cannot update goal to be deleted if goal is not completed', async ({ request, goalIdsForTeardown }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal());
            trackGoal(goalIdsForTeardown, createdGoal, createdStatus);
            const { updatedGoal, updatedStatus } = await updateGoalAndReturn(request, createdGoal.id,
                {
                    ...createdGoal,
                    is_deleted: 1
                });

            expect(updatedStatus).toBe(400);
            expect(updatedGoal.error).toBe(invalidDeleteBecauseNotCompletedMessage);
        })

    })
})
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

test.describe('API goal actions tests', () => {

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
        invalidGoalIdMessage,
        nonExistentIdMessage,
        emptyTitleOrTimeframeUpdateMessage,
        invalidUpdatePayloadMessage,
        invalidCompletionValueMessage
    } = provideResponseMessages();

    //Positive tests
    test('Create a new goal', async ({ request }) => {
        const goalExpected = createTestGoal();
        const { createdGoal, createdStatus } = await createGoalAndReturn(request, goalExpected);
        addGoalIdToTeardownIfSuccess(createdGoal, createdStatus);

        expect(createdGoal.title).toBe(goalExpected.title);
        expect(createdGoal.timeframe).toBe(goalExpected.timeframe);
        expect(createdGoal.is_completed).toBe(goalExpected.is_completed);
        expect(createdGoal.is_deleted).toBe(goalExpected.is_deleted);
    });

    //Negative tests
    test('Cannot create goal with empty title', async ({ request }) => {
        const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal({ title: "" }))

        expect(createdStatus).toBe(400);
        expect(createdGoal.error).toBe(emptyTitleOrTimeframeUpdateMessage);
    })

    test('Cannot create goal with empty tiimeframe', async ({ request }) => {
        const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal({ timeframe: "" }))
        addGoalIdToTeardownIfSuccess(createdGoal, createdStatus);


        expect(createdStatus).toBe(400);
        expect(createdGoal.error).toBe(emptyTitleOrTimeframeUpdateMessage);
    })

    test('Cannot create goal with empty title and tiimeframe', async ({ request }) => {
        const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal({
            title: "",
            timeframe: ""
        }))
        addGoalIdToTeardownIfSuccess(createdGoal, createdStatus);


        expect(createdStatus).toBe(400);
        expect(createdGoal.error).toBe(emptyTitleOrTimeframeUpdateMessage);
    })
});


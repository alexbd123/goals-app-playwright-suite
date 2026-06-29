import { test, expect } from '../../fixtures.js';
import { createGoalAndReturn, deleteGoalAndReturn } from '../../api/requests.js';
import { createTestGoal } from '../../factories/goalFactory.js';
import { provideResponseMessages } from './apiTestData/responseMessages.js';
import { trackGoal, runBackendTeardown } from '../../api/beHelper.js';

test.describe('API goal actions tests', () => {

    test.afterEach(async ({ request, goalIdsForTeardown }) => {
        await runBackendTeardown(request, goalIdsForTeardown);
    });

    const {
        emptyTitleOrTimeframeUpdateMessage,
        invalidUpdatePayloadMessage,
        invalidCompletionValueMessage
    } = provideResponseMessages();

    test.describe('Positive create goals API tests', () => {

        test('Create a new goal', async ({ request, goalIdsForTeardown }) => {
            const goalExpected = createTestGoal();
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, goalExpected);
            trackGoal(goalIdsForTeardown, createdGoal, createdStatus);

            expect(createdGoal.title).toBe(goalExpected.title);
            expect(createdGoal.timeframe).toBe(goalExpected.timeframe);
            expect(createdGoal.is_completed).toBe(goalExpected.is_completed);
            expect(createdGoal.is_deleted).toBe(goalExpected.is_deleted);
        });

    })

    test.describe('Negative create goals API tests', () => {

        test('Cannot create goal with empty title', async ({ request, goalIdsForTeardown }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal({ title: "" }))
            trackGoal(goalIdsForTeardown, createdGoal, createdStatus);

            expect(createdStatus).toBe(400);
            expect(createdGoal.error).toBe(emptyTitleOrTimeframeUpdateMessage);
        })

        test('Cannot create goal with empty tiimeframe', async ({ request, goalIdsForTeardown }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal({ timeframe: "" }))
            trackGoal(goalIdsForTeardown, createdGoal, createdStatus);
            expect(createdStatus).toBe(400);
            expect(createdGoal.error).toBe(emptyTitleOrTimeframeUpdateMessage);
        })

        test('Cannot create goal with empty title and tiimeframe', async ({ request, goalIdsForTeardown }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal({
                title: "",
                timeframe: ""
            }))
            trackGoal(goalIdsForTeardown, createdGoal, createdStatus);


            expect(createdStatus).toBe(400);
            expect(createdGoal.error).toBe(emptyTitleOrTimeframeUpdateMessage);
        })

    });
});


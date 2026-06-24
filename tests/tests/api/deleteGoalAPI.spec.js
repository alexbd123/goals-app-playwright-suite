import { test, expect } from '../../fixtures.js';
import { createGoalAndReturn, deleteGoalAndReturn } from '../../api/requests.js';
import { createTestGoal } from '../../factories/goalFactory.js';
import { provideResponseMessages } from './apiTestData/responseMessages.js';

test.describe('DELETE goal tests', () => {

    const {
        deleteSuccessMessage,
        nonExistentIdMessage,
        invalidGoalIdMessage
    } = provideResponseMessages();

    test.describe('Positive delete goal API tests', () => {

        test('Delete an existing goal', async ({ request }) => {
            const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal());
            const { deletedMessage, deletedStatus } = await deleteGoalAndReturn(request, createdGoal.id)

            expect(deletedStatus).toBe(200);
            expect(deletedMessage.message).toBe(deleteSuccessMessage);
        });

    })

    test.describe('Negative delete goal API tests', () => {

        test('Cannot delete goal with non-numeric ID', async ({ request }) => {
            const { deletedMessage, deletedStatus } = await deleteGoalAndReturn(request, "Susan");

            expect(deletedStatus).toBe(400);
            expect(deletedMessage.error).toBe(invalidGoalIdMessage);
        })

        test('Cannot delete goal with non-existent ID', async ({ request }) => {
            const { deletedMessage, deletedStatus } = await deleteGoalAndReturn(request, Number.MAX_SAFE_INTEGER);

            expect(deletedStatus).toBe(404);
            expect(deletedMessage.error).toBe(nonExistentIdMessage);
        })

    })
});
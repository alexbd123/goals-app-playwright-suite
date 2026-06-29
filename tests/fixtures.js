import { test as base, expect } from '@playwright/test';
import { createGoalAndReturn, deleteGoalAndReturn } from './api/requests';
import { generateRandomTitle, generateRandomTimeframe, deleteGoalByTitle } from './api/beHelper';
import { createTestGoal } from './factories/goalFactory';
import { HomePage } from './pages/HomePage';
import { DeletedPage } from './pages/DeletedPage';

export const test = base.extend({

    goalIdsForTeardown: async ({ }, use) => {
        const goalIds = [];

        await use(goalIds);
    },

    tempDeletedGoalForTest: async ({ request }, use) => {
        const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal({
            title: generateRandomTitle(),
            timeframe: generateRandomTimeframe(),
            is_completed: 1,
            is_deleted: 1
        }));
        expect(createdStatus).toBe(201);

        await use(createdGoal);

        await deleteGoalAndReturn(request, createdGoal.id);
    },

    incompleteGoalForTest: async ({ request }, use) => {
        const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal({
            title: generateRandomTitle(),
            timeframe: generateRandomTimeframe()
        }));
        expect(createdStatus).toBe(201);

        await use(createdGoal);

        await deleteGoalAndReturn(request, createdGoal.id);
    },

    completedGoalForTest: async ({ request }, use) => {
        const { createdGoal, createdStatus } = await createGoalAndReturn(request, createTestGoal({
            title: generateRandomTitle(),
            timeframe: generateRandomTimeframe(),
            is_completed: 1
        }));
        expect(createdStatus).toBe(201);

        await use(createdGoal);

        await deleteGoalAndReturn(request, createdGoal.id);
    },

    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);

        await use(homePage);
    },

    deletedPage: async ({ page }, use) => {
        const deletedPage = new DeletedPage(page);

        await use(deletedPage);
    },

    uiGoalData: async ({ request }, use) => {
        const data = { title: generateRandomTitle(), timeframe: generateRandomTimeframe() };

        await use(data);

        await deleteGoalByTitle(request, data.title);
    }

})

export { expect } from '@playwright/test';
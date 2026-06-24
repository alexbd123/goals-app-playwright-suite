import { test as base } from '@playwright/test';

export const test = base.extend({
    goalIdsForTeardown: async ({}, use) => {
        const goalIds = [];

        await use(goalIds);
    }
})

export { expect } from '@playwright/test';
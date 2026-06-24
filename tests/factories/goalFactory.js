import { generateRandomTitleTimeframe } from '../api/beHelper.js';

export function createTestGoal(overrides={}) {

    const { randomTitle, randomTimeframe } = generateRandomTitleTimeframe();

    return {
        title: randomTitle,
        timeframe: randomTimeframe,
        is_completed: 0,
        is_deleted: 0,
        ...overrides
    };
}
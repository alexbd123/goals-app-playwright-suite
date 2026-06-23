export function createTestGoal(overrides={}) {
    return {
        title: "Learn Playwright",
        timeframe: "1 week",
        is_completed: 0,
        is_deleted: 0,
        ...overrides
    };
}
import { expect } from '@playwright/test';
import { createTestGoal } from '../factories/goalFactory.js';

export async function getAllGoalsAndReturn(request) {
    const response = await request.get('http://localhost:3000/goals');
    return {
        goals: await response.json(),
        status: response.status()
    }
}

export async function getGoalByIdAndReturn(request, goalId) {
    const response = await request.get(`http://localhost:3000/goals/${goalId}`)
    return {
        retrievedGoal: await response.json(),
        retrievedStatus: response.status()
    };
}

export async function createGoalAndReturn(request, goalData) {
    const response = await request.post('http://localhost:3000/goals', {
        data: goalData
    });
    return {
        createdGoal: await response.json(),
        createdStatus: response.status()
    };
}

export async function updateGoalAndReturn(request, goalId, updatedData) {
    const response = await request.put(`http://localhost:3000/goals/${goalId}`, {
        data: updatedData
    });
    return {
        updatedGoal: await response.json(),
        updatedStatus: response.status()
    };
}

export async function deleteGoalAndReturn(request, goalId) {
    const response = await request.delete(`http://localhost:3000/goals/${goalId}`);
    return {
        deletedMessage: await response.json(),
        deletedStatus: response.status()
    };
}
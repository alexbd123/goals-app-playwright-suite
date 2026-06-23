import { expect } from '@playwright/test';
import { getAllGoalsAndReturn } from './requests.js';

export async function generateNonExistentId(request) {
  let nonExistentId = 0;
  const { goals, status } = await getAllGoalsAndReturn(request);
  expect(status).toBe(200);
  for (const goal of goals) {
    if (goal.id === nonExistentId) {
      nonExistentId++;
    }
  }
  return nonExistentId;
}

let goalIdsForTeardown = [];

export function addGoalIdToTeardownIfSuccess(goal, status) {
  if (status === 201) {
    goalIdsForTeardown.push(goal.id);
  }
}

export function getGoalIdsForTeardown() {
  return goalIdsForTeardown;
}

export function clearGoalIdsForTeardown() {
  goalIdsForTeardown = [];
}

export function generateRandomTitle() {
  return `autoTestGoal ${Math.floor(Math.random() * 100000)}`;
}

export function generateRandomTimeframe() {
  return `${Math.floor(Math.random() * 100) + 1} weeks`
}

export function generateRandomTitleTimeframe() {
  return {
    randomTitle: `autoTestGoal ${Math.floor(Math.random() * 100000)}`,
    randomTimeframe: `${Math.floor(Math.random() * 10) + 1} weeks`
  };
}
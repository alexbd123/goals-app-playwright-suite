import { expect } from '../fixtures.js';
import { getAllGoalsAndReturn, deleteGoalAndReturn } from './requests.js';

export function trackGoal(
  goalIdsForTeardown,
  goal,
  status
) {
  if (status === 201) {
    goalIdsForTeardown.push(goal.id);
  }
}

export function generateRandomTitle() {
  return `autoTestGoal-${crypto.randomUUID()}`;
}

export function generateRandomTimeframe() {
  return `${Math.floor(Math.random() * 100) + 1} weeks`
}

export function generateRandomTitleTimeframe() {
  return {
    randomTitle: generateRandomTitle(),
    randomTimeframe: generateRandomTimeframe()
  };
}

export async function deleteAllGoals(request) {
  const { goals, status } = await getAllGoalsAndReturn(request);
  expect(status).toBe(200);
  for (const goal of goals) {
    const { deletedStatus } = await deleteGoalAndReturn(request, goal.id)
    expect(deletedStatus).toBe(200);
  };
}

export async function deleteGoalByTitle(request, title) {
  const { goals, status } = await getAllGoalsAndReturn(request);
  expect(status).toBe(200);
  for (const goal of goals) {
    if (goal.title === title) {
    const { deletedStatus } = await deleteGoalAndReturn(request, goal.id)
    expect(deletedStatus).toBe(200);
    }
  }
}
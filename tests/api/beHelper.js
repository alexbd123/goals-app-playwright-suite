import { expect } from '../fixtures.js';
import { getAllGoalsAndReturn } from './requests.js';

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
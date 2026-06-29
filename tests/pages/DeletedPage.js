import { expect } from '@playwright/test';

export class DeletedPage {
    constructor(page) {
        this.page = page;
        this.deletedGoalsList = page.getByTestId('deleted-goals-list');
        this.deleteOrRestoreAlert = page.getByRole('alert');
    }

    async goTo() {
        await this.page.goto('http://localhost:5173/deleted');
    }

    goalCardById(goalId) {
        return this.page.getByTestId(`goal-card-${goalId}`);
    }

    goalCardByTitle(title) {
        return this.page
            .locator('.goal-card')
            .filter({ hasText: title });
    }

    goalCardRestoreButton(goalId) {
        return this.page.getByTestId(`restore-goal-${goalId}`);

    }

    goalCardPermaDeleteButton(goalId) {
        return this.goalCardById(goalId).getByTestId(`perma-delete-goal-${goalId}`);
    }

    async goToDeletedAndWaitForTempDeletedGoal(title) {
        await this.goTo();
        await expect(this.deletedGoalsList.getByText(title)).toBeVisible();
    }

    async permaDeleteGoal(goalId) {
        await this.goalCardPermaDeleteButton(goalId).click();
    }

    async restoreGoal(goalId) {
        await this.goalCardRestoreButton(goalId).click();
    }

}
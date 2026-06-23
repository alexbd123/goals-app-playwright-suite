import { expect } from '@playwright/test';

export class HomePage {
    constructor(page) {
        this.page = page;
        this.newGoalTitleInput = page.getByPlaceholder('Enter new goal here...');
        this.newGoalTimeframeInput = page.getByPlaceholder('Enter timeframe here...');
        this.addGoalButton = page.getByRole('button', { name: 'Submit new goal' });
        this.incompleteGoalsList = page.getByTestId('incomplete-goals-list');
        this.completedGoalsList = page.getByTestId('completed-goals-list');
        this.goalSubmissionAlert = page.getByRole('alert');
        this.editGoalTitleInput = page.getByTestId('edit-title-input');
        this.editGoalTimeframeInput = page.getByTestId('edit-timeframe-input');
        this.submitEditButton = page.getByTestId('submit-edit-btn');
    }

    async goTo() {
        await this.page.goto('http://localhost:5173/');
    }

    async addTitle(title) {
        await this.newGoalTitleInput.fill(title);
    }

    async addTimeframe(timeframe) {
        await this.newGoalTimeframeInput.fill(timeframe);
    }

    async clickSubmitNewGoal() {
        await this.addGoalButton.click();
    }

    async addGoal(title, timeframe) {
        await this.addTitle(title);
        await this.addTimeframe(timeframe);
        await this.clickSubmitNewGoal();
    }

    goalCardById(goalId) {
        return this.page.getByTestId(`goal-card-${goalId}`);
    }

    goalCardByTitle(title) {
        return this.page
            .locator('.goal-card')
            .filter({ hasText: title });
    }

    goalCardTitle(goalId) {
        return this.page.getByTestId(`goal-card-title-${goalId}`);
    }

    goalCardTimeframe(goalId) {
        return this.goalCardById(goalId).getByTestId(`goal-card-timeframe-${goalId}`);
    }

    goalCardCompletionCheckbox(goalId) {
        return this.goalCardById(goalId).getByTestId(`toggle-completion-${goalId}`);
    }

    goalCardEditButton(goalId) {
        return this.goalCardById(goalId).getByTestId(`edit-goal-${goalId}`);
    }

    goalCardTempDeleteButton(goalId) {
        return this.goalCardById(goalId).getByTestId(`temp-delete-goal-${goalId}`);
    }

    goalSubmissionMessage(expectedAlert) {
        return this.goalSubmissionAlert.getByText(expectedAlert);
    }

    async toggleCompleteByTitle(title) {
        await this.goalCardByTitle(title).locator('[data-testid*="toggle-completion-"]').click();
    }

    async clickTempDeleteButton(goalId) {
        await this.goalCardTempDeleteButton(goalId).click();
    }

    async tempDeleteGoalByTitle(title) {
        await this.goalCardByTitle(title).locator('[data-testid*="temp-delete-goal-"]').click();
    }

    async updateGoal(goalId, title, timeframe) {
        await this.goalCardEditButton(goalId).click();
        if (title !== undefined) {
            await this.editGoalTitleInput.fill(title);
        }
        if (timeframe !== undefined) {
            await this.editGoalTimeframeInput.fill(timeframe);
        }
        await this.submitEditButton.click();
    }

    async goToHomeAndWaitForIncompleteGoal(title) {
        await this.goTo();
        await expect(this.incompleteGoalsList.getByText(title)).toBeVisible();
    }

    async goToHomeAndWaitForCompletedGoal(title) {
        await this.goTo();
        await expect(this.completedGoalsList.getByText(title)).toBeVisible();
    }

    //Temporary until Deleted Goals page is made
    async deleteTestGoalFromUi(title) {
        await this.toggleCompleteByTitle(title);
        await this.tempDeleteGoalByTitle(title);
        await expect(this.incompleteGoalsList.getByText(title)).not.toBeVisible();
    }
};
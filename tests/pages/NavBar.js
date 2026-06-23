import { expect } from '@playwright/test';

export class NavBar {
    constructor(page) {
        this.page = page;
        this.homeLink = page.getByRole('link', { name: 'Home' });
        this.deletedGoalsLink = page.getByRole('link', { name: 'Deleted goals' });
        this.homePageUrl = 'http://localhost:5173/';
        this.deletedGoalsPageUrl = 'http://localhost:5173/deleted';
    }

    async navigateToHome() {
        await this.homeLink.click();
        await expect(this.page).toHaveURL(this.homePageUrl);
    }

    async navigateToDeletedGoals() {
        await this.deletedGoalsLink.click();
        await expect(this.page).toHaveURL(this.deletedGoalsPageUrl);
    }
};
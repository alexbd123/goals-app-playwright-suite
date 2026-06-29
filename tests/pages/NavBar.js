import { expect } from '@playwright/test';

export class NavBar {
    constructor(page) {
        this.page = page;
        this.homeLink = page.getByRole('link', { name: 'Home' });
        this.deletedGoalsLink = page.getByRole('link', { name: 'Deleted goals' });
        this.homePageUrl = 'http://localhost:5173/';
        this.deletedGoalsPageUrl = 'http://localhost:5173/deleted';
    }

    async clickHomeLink() {
        await this.homeLink.click();
    }

    async clickDeletedGoalsLink() {
        await this.deletedGoalsLink.click();
    }
};
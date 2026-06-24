import { test, expect } from '../../../fixtures.js';
import { HomePage } from '../../../pages/HomePage';

test.describe('Home page', () => {

    test.beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goTo();
    });

    test('Homepage has correct empty goal lists messages', async({page}) => {
        
    })

});
import { test, expect } from '../../../fixtures.js';
import { HomePage } from '../../../pages/HomePage.js';
import { deleteAllGoals } from '../../../api/beHelper.js';
import { staticUiMessages } from '../uiTestData/uiMessages.js';

test.describe.serial('Home page', () => {

    const { noIncompleteGoalsUiMessage, noCompletedGoalsUiMessage } = staticUiMessages();

    test('Incomplete goals list has correct heading', async({page}) => {
        const homePage = new HomePage(page);
        await homePage.goTo();

        await expect(homePage.incompleteGoalsListHeading).toBeVisible();
    })

    test('Completed goals list has correct heading', async({page}) => {
        const homePage = new HomePage(page);
        await homePage.goTo();

        await expect(homePage.completedGoalsListHeading).toBeVisible();
    })

    test('Homepage has correct no incomplete goals message', async ({ page, request }) => {
        await deleteAllGoals(request);
        const homePage = new HomePage(page);
        await homePage.goTo();

        await expect(homePage.noIncompleteGoalsMessage).toBeVisible();
        await expect(homePage.noIncompleteGoalsMessage).toHaveText(noIncompleteGoalsUiMessage);
    })

    test('Homepage has correct no completed goals message', async ({ page, request }) => {
        await deleteAllGoals(request);
        const homePage = new HomePage(page);
        await homePage.goTo();

        await expect(homePage.noCompletedGoalsMessage).toBeVisible();
        await expect(homePage.noCompletedGoalsMessage).toHaveText(noCompletedGoalsUiMessage);
    })

});
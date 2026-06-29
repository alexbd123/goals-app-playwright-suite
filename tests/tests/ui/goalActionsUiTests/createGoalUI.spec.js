import { test, expect } from '../../../fixtures.js';
import { HomePage } from '../../../pages/HomePage.js';
import { dynamicUiMessages, staticUiMessages } from '../uiTestData/uiMessages.js';
import { generateRandomTitleTimeframe, deleteGoalByTitle } from '../../../api/beHelper.js';

test.describe('Create goals UI tests', () => {

    test.describe('Positive create goals UI test', () => {

        test('Create new goal', async ({ uiGoalData, homePage }) => {
            const { creationSuccessMessage } = dynamicUiMessages(uiGoalData.title, uiGoalData.timeframe)
            await homePage.goTo();
            await homePage.addGoal(uiGoalData.title, uiGoalData.timeframe);

            await expect(homePage.goalSubmissionMessage(creationSuccessMessage)).toBeVisible();
            await expect(homePage.incompleteGoalsList.getByText(uiGoalData.title)).toBeVisible();
        });

    })

    test.describe('Negative create goals UI test', () => {

        test('Cannot create goal without inputting title', async ({ uiGoalData, homePage }) => {
            const { noTitleNewGoalMessage } = staticUiMessages();
            await homePage.goTo();
            await homePage.tryToAddGoalWithoutTitle(uiGoalData.timeframe);

            await expect(homePage.goalSubmissionMessage(noTitleNewGoalMessage)).toBeVisible();
        })

        test('Cannot create goal without inputting timeframe', async ({ uiGoalData, homePage }) => {
            const { noTimeframeNewGoalMessage } = staticUiMessages();
            await homePage.goTo();
            await homePage.tryToAddGoalWithoutTimeframe(uiGoalData.title);

            await expect(homePage.goalSubmissionMessage(noTimeframeNewGoalMessage)).toBeVisible();
        })

        test('Cannot create goal without inputting title and timeframe', async ({ homePage }) => {
            const { noTitleAndTimeframeNewGoalMessage } = staticUiMessages();
            await homePage.goTo();
            await homePage.clickSubmitNewGoal();

            await expect(homePage.goalSubmissionMessage(noTitleAndTimeframeNewGoalMessage)).toBeVisible();
        })

    })

});
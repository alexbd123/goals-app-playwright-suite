export function dynamicUiMessages(title, timeframe) {
    return {
        creationSuccessMessage: `You have created a new goal: '${title}' to be completed in ${timeframe}`,
        permaDeleteGoalMessage: `You have permanently deleted the goal '${title}'!`,
        updateSuccessMessage: `You have created a new goal: '${title}' to be completed in ${timeframe}`,
        tempDeleteGoalMessage: `You have deleted the goal '${title}'!`,
        restoreGoalMessage: `You have restored the goal '${title}'!`
    };
}

export function staticUiMessages() {
    return {
        noIncompleteGoalsUiMessage: "You have no incomplete goals!",
        noCompletedGoalsUiMessage: "You have no completed goals!",
        invalidTitleTimeframeEditMessage: "New title or timeframe cannot be an empty space!",
        noTitleNewGoalMessage: "You must enter a title for your new goal!",
        noTimeframeNewGoalMessage: "You must enter a timeframe for your new goal!",
        noTitleAndTimeframeNewGoalMessage: "You must enter a title and a timeframe for your new goal!"
    }
}
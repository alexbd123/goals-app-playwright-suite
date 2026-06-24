export function dynamicUiMessages(title, timeframe) {
    return {
        creationSuccessMessage: `You have created a new goal: '${title}' to be completed in ${timeframe}`,
        permaDeleteGoalMessage: `You have permanently deleted the goal '${title}'!`,
        updateSuccessMessage: `You have created a new goal: '${title}' to be completed in ${timeframe}`,
        tempDeleteGoalMessage: `You have deleted the goal '${title}'!`
    };
}

export function staticUiMessages() {
    return {
        noIncompleteGoalsUiMessage: "You have no incomplete goals!",
        noCompletedGoalsUiMessage: "You have no completed goals!",
        invalidTitleTimeframeEditMessage: "New title or timeframe cannot be an empty space!"
    }
}
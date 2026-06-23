export function generateExpectedCreationSuccessMessage(title, timeframe) {
    return `You have created a new goal: '${title}' to be completed in ${timeframe}`;
}

export function returnInvalidTitleTimeframeEditMessage() {
    return "New title or timeframe cannot be an empty space!";
}

export function generatePermaDeleteGoalMessage(title) {
    return `You have permanently deleted the goal '${title}'!`;
}

export function generateUpdateSuccessMessage(title, timeframe) {
    return `You have created a new goal: '${title}' to be completed in ${timeframe}`
}
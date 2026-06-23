export function provideResponseMessages() {
    return {
        deleteSuccessMessage: "Goal deleted successfully.",
        invalidGoalIdMessage: "Invalid goal ID. ID must be a number.",
        nonExistentIdMessage: "Goal not found.",
        emptyTitleOrTimeframeUpdateMessage: "Title and timeframe are required and cannot be empty.",
        invalidUpdatePayloadMessage: "All fields (title, timeframe, is_completed, is_deleted) must be provided for update.",
        invalidCompletionValueMessage: "is_completed must be either 0 or 1.",
        invalidDeletionValueMessage: "is_deleted must be either 0 or 1.",
        invalidDeleteBecauseNotCompletedMessage: "A goal cannot be marked as deleted if it is not completed."
    }
}
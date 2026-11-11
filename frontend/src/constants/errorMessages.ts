export const NETWORK_ERROR_MESSAGE = "Can't reach the admission server. Make sure it is running and try again.";
export const UNEXPECTED_ERROR_MESSAGE = "Something went wrong. Please try again.";

export const STATUS_ERROR_MESSAGES: Record<number, string> = {
  400: "Some of the information you entered is not valid.",
  403: "You are not allowed to do that.",
  404: "We couldn't find what you were looking for.",
  409: "That action conflicts with the current state. Please refresh and try again.",
  500: "The server had a problem. Please try again in a moment.",
};

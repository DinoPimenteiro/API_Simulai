export function sendError(
  res,
  message,
  statusCode = 500,
  error = errors.internal,
) {

  res.status(statusCode).json({
    success: false,
    error: {
      code: error,
      message,
    },
  });
}

export let errors = {
  data: "MISSING_DATA",
  internal: "INTERNAL_ERROR",
  auth: "AUTHENTICATION_ERROR",
  metadata: "MISSING_HEADERS",
  email: "EMAIL_ERROR",
  unexpected: "UNEXPECTED_ERROR",
  unauthorized: "UNAUTHORIZED"
};

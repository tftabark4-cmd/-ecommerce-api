// Central error handler. Must be registered LAST, after all routes.
// Never exposes stack traces, SQL text, or file paths to the client.
function errorHandler(error, req, res, next) {
  const status = error.status && Number.isInteger(error.status) ? error.status : 500;

  // Full details are only ever logged server-side, and only in development,
  // to avoid leaking internal information into shared/production logs.
  if (process.env.NODE_ENV !== "production") {
    console.error(`[ERROR] ${req.method} ${req.originalUrl} ->`, error);
  } else {
    console.error(`[ERROR] ${req.method} ${req.originalUrl} -> ${error.message}`);
  }

  const clientMessage =
    status < 500 && error.message ? error.message : "Internal server error";

  res.status(status).json({
    success: false,
    message: clientMessage
  });
}

module.exports = errorHandler;

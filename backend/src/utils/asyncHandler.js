const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    // Validate the status code
    const statusCode =
      typeof error.status === "number" && error.status >= 100 && error.status < 600
        ? error.status
        : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export { asyncHandler };

const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    // ApiError uses statusCode; plain errors may use status — check both
    const statusCode =
      (typeof error.statusCode === "number" && error.statusCode >= 100 && error.statusCode < 600)
        ? error.statusCode
        : (typeof error.status === "number" && error.status >= 100 && error.status < 600)
          ? error.status
          : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export { asyncHandler };

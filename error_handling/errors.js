exports.notFoundHandler = (req, res, next) => {
  res.status(404).json({
    error: 404,
    message: "Not found.",
  });
};

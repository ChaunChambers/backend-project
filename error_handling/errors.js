exports.getErrorHandler = (err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ message: "Bad request" });
  } else if (response) {
    response.status(404).send({ message: "Not found" });
  } else next();
};

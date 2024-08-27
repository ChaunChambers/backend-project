const express = require("express");
const app = express();
const { getAllTopics, getApi } = require("./controllers/news.controller");
const { notFoundHandler } = require("./error_handling/errors");

app.get("/api/topics", getAllTopics);

app.get("/api", getApi);
// CODE BELOW IS NOT WORKING

app.get("/api/*", function (req, res) {
  try {
    throw new Error("Not found");
  } catch (error) {
    // Handle the error
    res.status(404).send("Not found");
  }
});

app.use((err, request, response, next) => {
  if (response) {
    response.status(404).send({ message: "Not found" });
  } else next();
});

app.use(notFoundHandler);

// UNTIL HERE
module.exports = app;

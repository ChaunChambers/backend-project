const express = require("express");
const app = express();
const {
  getAllTopics,
  getApi,
  getArticleByArticleId,
} = require("./controllers/news.controller");
const { notFoundHandler } = require("./error_handling/errors");

app.get("/api/topics", getAllTopics);

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticleByArticleId);

app.use((err, request, response, next) => {
  if (err.code === "22P02") {
    response.status(400).send({ message: "Bad request" });
  } else if (response) {
    response.status(404).send({ message: "Not found" });
  } else next();
});

// CODE BELOW IS NOT WORKING

app.get("/api/*", function (req, res) {
  try {
    throw new Error("Not found");
  } catch (error) {
    // Handle the error
    res.status(404).send("Not found");
  }
});

app.use(notFoundHandler);

// UNTIL HERE
module.exports = app;

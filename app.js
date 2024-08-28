const express = require("express");
const app = express();
const {
  getAllTopics,
  getApi,
  getArticleByArticleId,
  getAllArticles,
} = require("./controllers/news.controller");
const { getErrorHandler } = require("./error_handling/errors");

app.get("/api/topics", getAllTopics);

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticleByArticleId);

app.get("/api/articles", getAllArticles);

app.use(getErrorHandler);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});

module.exports = app;

const express = require("express");
const app = express();
const {
  getAllTopics,
  getApi,
  getArticleByArticleId,
  getAllArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  updateArticleById,
  deleteByCommentId,
} = require("./controllers/news.controller");
const { getErrorHandler } = require("./error_handling/errors");

app.use(express.json());

app.get("/api/topics", getAllTopics);

app.get("/api", getApi);

app.get("/api/articles/:article_id", getArticleByArticleId);

app.get("/api/articles", getAllArticles);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", updateArticleById);

app.delete("/api/comments/:comment_id", deleteByCommentId);

app.use(getErrorHandler);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});

module.exports = app;

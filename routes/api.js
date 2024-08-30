const express = require("express");
const router = express.Router();
const {
  getAllTopics,
  getApi,
  getArticleByArticleId,
  getAllArticles,
  getCommentsByArticleId,
  postCommentByArticleId,
  updateArticleById,
  deleteByCommentId,
  getAllUsers,
  getUserByUsername,
} = require("../controllers/news.controller");

router.route("/").get(getApi);

router.route("/articles").get(getAllArticles);

router.route("/topics").get(getAllTopics);

router.route("/users").get(getAllUsers);

router.route("/users/:username").get(getUserByUsername);

router
  .route("/articles/:article_id")
  .get(getArticleByArticleId)
  .patch(updateArticleById);

router
  .route("/articles/:article_id/comments")
  .get(getCommentsByArticleId)
  .post(postCommentByArticleId);

router.route("/comments/:comment_id").delete(deleteByCommentId);

module.exports = router;

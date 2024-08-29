const {
  selectTopics,
  selectApi,
  selectArticle,
  getArticles,
  selectComments,
  createCommentByArticleId,
  updateArticle,
  deleteItem,
  selectUsers,
} = require("../models/news.model");

exports.getAllTopics = (request, response, next) => {
  selectTopics()
    .then((topics) => {
      response.status(200).send({ topics });
    })
    .catch((err) => next(err));
};

exports.getApi = (request, response, next) => {
  selectApi().then((data) => {
    response.status(200).send({ data });
  });
};

exports.getArticleByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  selectArticle(article_id)
    .then((article) => response.status(200).send({ article }))
    .catch((err) => {
      // console.log(err);
      next(err);
    });
};

exports.getAllArticles = (request, response, next) => {
  const { sort_by, order } = request.query;
  getArticles(sort_by, order)
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((err) => next(err));
};

exports.getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  selectComments(article_id)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch((err) => next(err));
};

exports.postCommentByArticleId = (request, response, next) => {
  const { body } = request;
  const { article_id } = request.params;
  createCommentByArticleId(body, article_id)
    .then((comment) => {
      response.status(201).send({ comment });
    })
    .catch((err) => next(err));
};

exports.updateArticleById = (request, response, next) => {
  const { body } = request;
  const { article_id } = request.params;
  updateArticle(body, article_id)
    .then((comments) => {
      response.status(200).send({ comments });
    })
    .catch((err) => next(err));
};

exports.deleteByCommentId = (request, response, next) => {
  const { comment_id } = request.params;
  deleteItem(comment_id)
    .then((deleted) => {
      response.status(204).send({ message: "No content" });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getAllUsers = (request, response, next) => {
  selectUsers().then((users) => {
    response.status(200).send({ users });
  });
};

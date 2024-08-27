const {
  selectTopics,
  selectApi,
  selectArticle,
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

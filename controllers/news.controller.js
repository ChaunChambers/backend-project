const { selectTopics, selectApi } = require("../models/news.model");

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

const db = require("../db/connection");
const fs = require("fs/promises");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((data) => {
    return data.rows;
  });
};

exports.selectApi = () => {
  return fs
    .readFile(
      `/Users/chaunchambers/Northcoders/backend/be-nc-news/endpoints.json`,
      "utf-8"
    )
    .then((endpoints) => {
      // console.log(endpoints);
      return endpoints;
    });
};

exports.selectArticle = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id=$1", [article_id])
    .then(({ rows }) => {
      //   console.log(rows[0]);
      return rows[0];
    });
};

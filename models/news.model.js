const db = require("../db/connection");
const fs = require("fs/promises");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((data) => {
    return data.rows;
  });
};

exports.selectApi = () => {
  return fs
    .readFile(`${__dirname}/../endpoints.json`, "utf-8")
    .then((endpoints) => {
      // console.log(endpoints);
      return endpoints;
    });
};

exports.selectArticle = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id=$1", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          message: "Article does not exist",
        });
      }
      return rows[0];
    });
};

exports.getArticles = () => {
  let queryString = `SELECT COUNT (comments.article_id) AS comment_count, articles.title, articles.topic, articles.author, articles.created_at, articles.votes,articles.article_img_url, comments.article_id FROM articles JOIN comments ON articles.article_id = comments.article_id 
GROUP BY articles.title, articles.topic, articles.author, articles.created_at, articles.votes,articles.article_img_url, comments.article_id 
ORDER BY created_at DESC;`;

  return db.query(queryString).then((data) => {
    // console.log(data);
    return data.rows;
  });
};

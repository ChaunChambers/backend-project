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

exports.selectComments = (article_id) => {
  let queryString = `SELECT comments.comment_id, 
comments.votes, comments.created_at, comments.author, comments.body, articles.article_id FROM comments JOIN articles ON articles.article_id = comments.article_id 
WHERE articles.article_id=$1
ORDER BY created_at DESC`;

  let queryValues = [article_id];

  return db.query(queryString, queryValues).then((data) => {
    if (data.rows.length === 0) {
      return Promise.reject({ status: 404, message: "Not found" });
    }
    return data.rows;
  });
};

exports.createCommentByArticleId = (body, article_id) => {
  const { username, content_body } = body;
  return db
    .query(
      `INSERT INTO comments 
        (author.username, body,article_id)
        VALUES 
    ($1,$2,$3) RETURNING *`,
      [username, content_body, article_id]
    )
    .then((data) => {
      console.log(data.rows);
      data.rows;
    });
};

exports.updateArticle = (body, article_id) => {
  const newVote = body.inc_votes;
  return db
    .query("SELECT * FROM articles WHERE articles.article_id = $1", [
      article_id,
    ])
    .then((doesDataExist) => {
      console.log(doesDataExist.rows);
      if (doesDataExist.rows.length === 0) {
        return Promise.reject({ status: 404, message: "Not found" });
      } else {
        return db
          .query(
            `UPDATE articles SET votes = votes + $1 WHERE articles.article_id = $2 RETURNING *`,
            [newVote, article_id]
          )
          .then((updatedComment) => {
            return updatedComment.rows[0];
          });
      }
    });
};

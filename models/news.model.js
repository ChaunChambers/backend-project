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
      return JSON.parse(endpoints);
    });
};

exports.selectArticle = (article_id) => {
  return db
    .query(
      "SELECT COUNT (comments.article_id)::int AS comment_count, articles.title, articles.topic, articles.author, articles.created_at, articles.votes,articles.article_img_url, articles.body, comments.article_id FROM articles JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.title, articles.topic, articles.author, articles.created_at, articles.body, articles.votes,articles.article_img_url, comments.article_id;",
      [article_id]
    )
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

exports.getArticles = (sort_by, order, topic, article_id) => {
  let queryValues = [];
  let queryStringTopic = "";
  if (topic) {
    queryStringTopic += ` WHERE topic = $1`;
    queryValues.push(topic);
  }

  let queryString =
    `SELECT COUNT (comments.article_id) AS comment_count, articles.title, articles.topic, articles.author, articles.created_at, articles.votes,articles.article_img_url, comments.article_id FROM articles JOIN comments ON articles.article_id = comments.article_id` +
    queryStringTopic +
    ` GROUP BY articles.title, articles.topic, articles.author, articles.created_at, articles.votes,articles.article_img_url, comments.article_id`;

  const allowedInputs = [
    "comment_count",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "article_img_url",
    "article_id",
  ];

  if (sort_by && !allowedInputs.includes(sort_by)) {
    return Promise.reject({ status: 404, message: "Invalid request" });
  }

  if (sort_by && order) {
    queryString += ` ORDER BY ${sort_by} ${order.toUpperCase()};`;
  } else if (sort_by) {
    queryString += ` ORDER BY ${sort_by} ASC;`;
  } else if (order) {
    queryString += ` ORDER BY created_at ${order.toUpperCase()};`;
  } else {
    queryString += ` ORDER BY created_at DESC`;
  }

  return db.query(queryString, queryValues).then((data) => {
    if (data.rows.length === 0) {
      return Promise.reject({ status: 404, message: "Invalid request" });
    }
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
        (author, body,article_id)
        VALUES 
    ($1,$2,$3) RETURNING *`,
      [username, content_body, article_id]
    )
    .then((data) => {
      return data.rows[0];
    });
};

exports.updateArticle = (body, article_id) => {
  const newVote = body.inc_votes;
  return db
    .query("SELECT * FROM articles WHERE articles.article_id = $1", [
      article_id,
    ])
    .then((doesDataExist) => {
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

exports.deleteItem = (comment_id) => {
  return db
    .query(`DELETE from comments WHERE comment_id=$1 RETURNING *`, [comment_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Bad request" });
      }
      return rows;
    });
};

exports.selectUsers = () => {
  return db.query("SELECT * FROM users;").then((data) => {
    return data.rows;
  });
};

exports.selectUser = (username) => {
  return db
    .query(`SELECT * FROM users WHERE username = $1`, [username])
    .then((data) => {
      if (data.rows.length === 0) {
        return Promise.reject({ status: 404, message: "Not Found" });
      }
      return data.rows[0];
    });
};

exports.selectComment = (comment_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Bad request" });
      }
      return rows[0];
    });
};

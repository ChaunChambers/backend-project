const db = require("../db/connection");
const fs = require("fs/promises");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics;").then((data) => {
    return data.rows;
  });
};

exports.selectApi = () => {
  return fs.readFile(`${__dirname}/endpoints.json`);
};

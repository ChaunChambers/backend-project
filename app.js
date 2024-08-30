const express = require("express");
const app = express();
const { getErrorHandler } = require("./error_handling/errors");

app.use(express.json());

app.use("/api", require("./routes/api"));

app.use(getErrorHandler);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});

module.exports = app;

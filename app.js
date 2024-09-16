const express = require("express");
const app = express();
const cors = require("cors");
const { getErrorHandler } = require("./error_handling/errors");

app.use(cors());

app.use(express.json());

app.use("/api", require("./routes/api"));

app.use(getErrorHandler);

app.all("*", (req, res) => {
  res.status(404).send({ msg: "Not found" });
});

module.exports = app;

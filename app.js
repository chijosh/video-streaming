const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.use(express.static(__dirname + "/public"));

module.exports = app;

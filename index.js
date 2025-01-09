const connetToMongo = require("./db");
const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", (req, res) => {
  res.send("hello Rahul Deshmukh");
});



connetToMongo();

app.listen(PORT, () => {
  console.log("Server Started at", PORT);
});

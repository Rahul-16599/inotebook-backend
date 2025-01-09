const connetToMongo = require("./db");
const express = require("express");
const app = express();
const PORT = 3000;


app.use(express.json())
// Available routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));



connetToMongo();

app.listen(PORT, () => {
  console.log("Server Started at", PORT);
});

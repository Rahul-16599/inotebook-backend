const mongoose = require("mongoose");
const mongoURI = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.4"

const connetToMongo = () => {
// mongodb connection
mongoose
.connect("mongodb://127.0.0.1:27017/First")
.then(() => console.log("mongodb Connected"))
.catch((err) => console.log("mongodb Error", err));
    }

module.exports = connetToMongo;
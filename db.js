const mongoose = require("mongoose");


const connetToMongo = () => {
// mongodb connection
mongoose
.connect("mongodb://127.0.0.1:27017/inotebook")
.then(() => console.log("mongodb Connected"))
.catch((err) => console.log("mongodb Error", err));
    }

module.exports = connetToMongo;
const express = require("express");
const bodyParser = require("body-parser");
const userControllers = require("./controllers/userControllers");
const questionControllers = require("./controllers/questionTestController");
const cors = require("cors");
const mongoose = require("mongoose");
var app = express();

mongoose.connect(
  "mongodb://localhost:27017/lxpDB",
  {
    useNewUrlParser: true,
  },
  (err) => {
    if (!err) {
      console.log("success");
    } else {
      console.log("erorr" + err);
    }
  }
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const domrouter = require("./models/domin/domain.router");
app.listen(5001, () => {
  console.log(" listenning in port 5001");
});

app.use(cors());
app.use("", [userControllers]);
app.use("", [questionControllers]);
app.use(domrouter);

app.use(express.static("public"));

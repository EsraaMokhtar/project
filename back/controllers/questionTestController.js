const express = require("express");
const fs = require("fs");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const Question = require("../models/QuestionTest.model");
const User = require("../models/user.model");
var user = new User();
user.points = 0;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

// get all Question that has the same domain
router.get("/question/:query", cors(), async (req, res) => {
  var query = req.params.query;
  Question.find(
    {
      $text: {
        $search: query,
      },
    },
    await function (err, domain) {
      if (err) throw err;
      if (domain) {
        res.json(domain);
      } else {
        res.send(
          JSON.stringify({
            error: "Error",
          })
        );
      }
    }
  );
});

// insert any Qustion
router.post("/question", async (req, res) => {
  console.log(req.body);
  if (!req.body.question._id) {
    const doc = await insertRecord(req, res);
    console.log(doc);
    res.send(doc);
  } else {
    res.send({ message: "erooor" });
  }
});

async function insertRecord(req, res) {
  var question = new Question();
  question.userId = req.body.userId;
  question.content = req.body.question.content;
  question.domain = req.body.question.domain;
  user = await question.save();
  return { question };
}

// get Question by its id
router.get("/getQuestionByID/:id", (req, res) => {
  const { id } = req.params;
  Question.find({}, function (err, questions) {
    const question = questions.find((ele) => {
      return ele._id == id;
    });
    res.send(question);
  });
});

// AddAnswer
router.put("/AddAnswer", (req, res) => {
  addAns(req, res);
  addPoints(req, res);
});

// function of ans
addAns = async (req, res) => {
  if (req.body.QuestionId) {
    const doc = await insertAnswer(req, res);
    console.log(
      "🚀 ~ file: questionTestController.js ~ line 95 ~ addAns= ~ doc",
      doc
    );
    return doc;
  } else {
    console.log(" this Question is not exist");
  }
};


//  insert Answer of Question
async function insertAnswer(req, res) {
  var question = await Question.findById(req.body.QuestionId);
  question.answers.push(req.body.answer);
  question.flag = true;
  question = await Question.findByIdAndUpdate(req.body.QuestionId, question);
  return { question };
}


// upload
async function upLoad(req, res) {
  var question = await Question.findById(req.body.QuestionId);
  console.log("file" + JSON.stringify(req.file));
  const file = req.file;
  const answerWriter = req.body.answerWriter;
  const time = req.body.time;
  const answer = { file, answerWriter, time };
  question.answers.push(answer);
  question.flag = true;
  question = await Question.findByIdAndUpdate(req.body.QuestionId, question);
  console.log("question ", question);
  return { question };
}

router.put("/upload", upload.single("avatar"), async function (req, res, next) {
  console.log(req.files);
  if (req.body.QuestionId) {
    const doc = await upLoad(req, res);
  } else {
    console.log(" this Question is not exist");
  }

  addUploadPoints(req, res);
});

// AddComment
router.put("/AddComment", async (req, res) => {
  if (req.body.QuestionId) {
    const doc = await insertComment(req, res);
    res.send(doc);
  } else {
    console.log(" this Answer is not exist");
  }
});

//  insert comment of Answer
async function insertComment(req, res) {
  var question = await Question.findById(req.body.QuestionId);
  var answers = question.answers;
  for (var i = 0; i < answers.length; i++) {
    if (answers[i]._id == req.body.AnswerId) {
      answer = question.answers[i].comments.push(req.body.comment);
      question = await Question.findByIdAndUpdate(
        req.body.QuestionId,
        question
      );
      return { question };
    } else {
      console.log("not found");
    }
  }
}

// AddLike
router.put("/AddLike", async (req, res) => {
  if (req.body.QuestionId) {
    const doc = await insertLike(req, res);
    res.send(doc);
  } else {
    console.log("this Answer is not exist");
  }
});

// insert like of Answer
async function insertLike(req, res) {
  var question = await Question.findById(req.body.QuestionId);
  var answers = question.answers;
  for (var i = 0; i < answers.length; i++) {
    if (answers[i]._id == req.body.AnswerId) {
      answers[i].react.like.numberOfLike = req.body.numberOfLike;
      answers[i].react.like.admires.push(req.body.admire); 
      question = await Question.findByIdAndUpdate(
        req.body.QuestionId,
        question
      );
      return { question };
    } else {
      console.log("not found");
    }
  }
}

// DelDisLike
router.put("/DelDisLike", async (req, res) => {
  if (req.body.QuestionId) {
    const doc = await DelDisLike(req, res);
    res.send(doc);
  } else {
    console.log(" this Answer is not exist");
  }
});

//  DelDisLike of Answer
async function DelDisLike(req, res) {
  var question = await Question.findById(req.body.QuestionId);
  var answers = question.answers;
  for (var i = 0; i < answers.length; i++) {
    if (answers[i]._id == req.body.AnswerId) {
      console.log(req.body.numberOfDisLike);
      answers[i].react.disLike.numberOfDisLike = req.body.numberOfDisLike;
      answers[i].react.disLike.haters.pop(req.body.hater); 
      question = await Question.findByIdAndUpdate(
        req.body.QuestionId,
        question
      );
      return { question };
    } else {
      console.log("not found");
    }
  }
}

// AddDisLike
router.put("/AddDisLike", async (req, res) => {
  if (req.body.QuestionId) {
    const doc = await insertDisLike(req, res);
    res.send(doc);
  } else {
    console.log(" this Answer is not exist");
  }
});

//  insert DisLike of Answer
async function insertDisLike(req, res) {
  var question = await Question.findById(req.body.QuestionId);
  var answers = question.answers;
  for (var i = 0; i < answers.length; i++) {
    if (answers[i]._id == req.body.AnswerId) {
      console.log(req.body.numberOfDisLike);
      answers[i].react.disLike.numberOfDisLike = req.body.numberOfDisLike;
      answers[i].react.disLike.haters.push(req.body.hater); 
      question = await Question.findByIdAndUpdate(
        req.body.QuestionId,
        question
      );
      return { question };
    } else {
      console.log("not found");
    }
  }
}

// DelLike
router.put("/DelLike", async (req, res) => {
  if (req.body.QuestionId) {
    const doc = await DelLike(req, res);
    res.send(doc);
  } else {
    console.log("this Answer is not exist");
  }
});

// DelLike of Answer
async function DelLike(req, res) {
  var question = await Question.findById(req.body.QuestionId);
  var answers = question.answers;
  for (var i = 0; i < answers.length; i++) {
    if (answers[i]._id == req.body.AnswerId) {
      console.log(req.body.numberOfLike);
      answers[i].react.like.numberOfLike = req.body.numberOfLike;
      answers[i].react.like.admires.pop(req.body.admire); 
      question = await Question.findByIdAndUpdate(
        req.body.QuestionId,
        question
      );
      return { question };
    } else {
      console.log("not found");
    }
  }
}


//  QuestionRate
router.put("/QuestionRate", async (req, res) => {
  if (req.body.QuestionId) {
    const doc = await insertQuestionRate(req, res);
    res.send(doc);
  } else {
    console.log(" this Question is not exist");
  }
});

//  insert QuestionRate
async function insertQuestionRate(req, res) {
  var question = await Question.findById(req.body.QuestionId);
  question.rate = req.body.QuestionRate;
  question = await Question.findByIdAndUpdate(req.body.QuestionId, question);
  return { question };
}

// get question by user id
router.get("/getQuestionByUserID/:id", (req, res) => {
  const { id } = req.params;
  Question.find({}, function (err, questions) {
    const question = questions.find((ele) => {
      return ele.userId == id;
    });
    res.send(question);
  });
});

// get ansQuestion by user id
router.get("/getAnswersByUserID/:id", (req, res) => {
  const { id } = req.params;
  Question.find({}, function (err, questions) {
    const question = questions.find((ele) => {
      for (var i = 0; i < ele.answers.length; i++) {
          return ele.answers[i].userId == id;
      }
    });
    res.send(question);
  });
}); 

module.exports = router;

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const _ = require("lodash");
const { Subject, validate } = require("../models/subject");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.post("/", async (req, res) => {
  if (Object.keys(req.body).length == 0)
    return res.status(400).send({
      error: "Request Body cannot be empty",
    });

  let topIndex = await Subject.find({}).count();
  //   topIndex = topIndex === 0 ? 1 : topIndex;
  try {
    const added = await Subject.create({
      id: topIndex + 1,
      ...req.body,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(400).send({
      response: false,
      message: err.message,
    });
  }

  const all = await Subject.find({});

  return res.status(200).send({
    response: true,
    docs: all,
    message: "Successfully Added Subject",
  });
});

// / post chapter

router.post("/:subjectid/chapter", async (req, res) => {
  // chapter must have a title and dlink
  const { title, dlink } = req.body;
  const subjectId = req.params.subjectid;

  let findSubject = await Subject.findOne({ id: subjectId });

  console.log(findSubject);

  if (findSubject == null)
    return res.status(404).send({
      response: false,
      message: "Message not found",
    });
  else {
    // console.log(typeof subjectId)
    console.log(findSubject);
    console.log(findSubject.chapters);
    const topIndex = findSubject.chapters.length;

    findSubject.chapters.push({
      id: topIndex + 1,
      name: title,
      link: dlink,
    });

    try {
      const updated = await Subject.findOneAndUpdate(
        {
          id: subjectId,
        },
        {
          chapters: findSubject.chapters,
        }
      );
      console.log(updated);

      const all = await Subject.find({}, { "chapters._id": 0, _id: 0 });

      return res.status(404).send({
        docs: all,
        response: true,
        message: "Successfully Added Chapter",
      });
    } catch (err) {
      return res.status(400).send({
        message: err.message,
      });
    }
  }
});

// update Chapter

router.patch("/:subjectId/chapter/:chapterid", async (req, res) => {
  if (Object.keys(req.body).length == 0)
    return res.status(400).send({
      error: "Request Body cannot be empty",
    });
  // chapter must have a title and dlink
  const { title, dlink } = req.body;
  const { subjectId, chapterid } = req.params;
  console.log(subjectId);

  try {
    const subject = await Subject.findOne({ id: subjectId });
    console.log(subject);
    const chapters = subject.chapters;

    console.log(chapters);

    console.log("Chapter ID: " + chapterid);

    const filterchapters = chapters?.filter(
      (chapter) => chapter.id != chapterid
    );

    console.log("FILTER CHAPTERS: ");
    console.log(filterchapters);

    filterchapters.push({
      id: chapterid,
      name: title,
      link: dlink,
    });
    filterchapters.sort(function (a, b) {
      return a.id - b.id;
    });
    console.log(filterchapters);
    const updatedSubject = await Subject.findOneAndUpdate(
      {
        id: subjectId,
      },
      {
        chapters: filterchapters,
      },
      { new: true }
    );
    console.log(updatedSubject);
    const all = await Subject.find({}, { "chapters._id": 0, _id: 0 });
    return res.status(200).send({
      response: true,
      docs: all,
      message: "Successfully updated chapter Details",
    });
  } catch (err) {
    return res.status(400).send({
      response: false,
      message: err.message,
    });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params.id;

  if (id === undefined || id == null) {
    return res.status(200).send({
      response: false,
      message: "Something went wrong , unable to delete",
    });
  }

  try {
    const updated = await Subject.findOneAndUpdate(
      {
        id: id,
      },
      {
        isDeleted: true,
      }
    );

    const all = await Subject.find({});

    return res.status(200).send({
      response: true,
      message: "Successfully delete Subject",
      docs: all,
    });
  } catch (err) {
    return res.status(200).send({
      response: false,
      message: "Something went wrong",
    });
  }
});

router.get("/", async (req, res) => {
  try{
    const all = await Subject.find({});
    return res.status(200).send({
      response : true ,
      message : "Successfully fetched results",
      docs : all
    })
  }
  catch(err){
    return res.status(404).send({
      response : false , 
      docs : [],
      message : "No content found "
    })
  }

});

module.exports = router;

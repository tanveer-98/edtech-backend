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
  try{
      const added = await Subject.create({
        id: topIndex+1,
        ...req.body,
      });

  }
  catch(err){
    console.log(err.message)
    return res.status(400).send({
        response: false, 
        message : err.message
    })
  }

  const all = await Subject.find({});

  return res.status(200).send({
    response: true,
    docs: all,
    message: "Successfully Added Subject",
  });
});


/// post chapter

router.post("/:subjectid/chapter", async (req, res) => {

    // chapter must have a title and dlink 
    const {title , dlink} = req.body;
    const subjectId = req.params.subjectid;

    let findSubject = await Subject.findOne({id : subjectId});
    
    console.log(findSubject);

    if(findSubject == null) return res.status(404).send({
        response : false ,
        message : "Message not found"
    })
    else{
        // console.log(typeof subjectId)
        console.log(findSubject);
        console.log(findSubject.chapters);

        findSubject.chapters.push({
            name : title, link : dlink
        });
        
        try{
            const updated = await Subject.findOneAndUpdate({
                id : subjectId
            },{
                chapters : findSubject.chapters
            })
            console.log(updated);

            return res.status(404).send({
                response : true  ,
                message : "Message not found"
            })
        }
        catch(err){
            return res.status(400).send({
                message : err.message
            })
        }
       
    
    } 


    console.log(subjectId);

    if (Object.keys(req.body).length == 0)
      return res.status(400).send({
        error: "Request Body cannot be empty",
      });


    return res.send({
        response : true ,
         message : "Successfully Added Chapter"
    })

  
    
  });
  
  




router.delete("/", async (req, res) => {});

router.get("/", async (req, res) => {});

module.exports = router;

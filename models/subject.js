const mongoose = require("mongoose");
const { Schema } = mongoose;

const chapterSchema = new Schema(
  {
    id: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      
    },
    link: {
      type: String,
      required: true,
      trim: true,
    },
    isDeleted : {
      type : Boolean, 
      default: false 
    }
  },
  { versionKey: 0 }
);

const subjectSchema = new Schema(
  {
    id: {
      type: Number,
      default: 0,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true
    },
    chapters: [chapterSchema],
    isDeleted:{
      type : Boolean ,
      default : false 
    }
  },
  {
    versionKey: 0,
  }
);

const Subject = mongoose.model("Subject", subjectSchema);
exports.Subject = Subject;

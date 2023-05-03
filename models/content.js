const mongoose = require('mongoose');
const {Schema} = mongoose;

const chapterSchema = new Scheam({
    link : {
        type : String , 
        required : true
    }
})

const subjectSchema = new Schema({
    name : {
        type : String ,
        required : true
    },
    chapters : [chapterSchema]
})


const Subject = mongoose.model("Subject", subjectSchema);
exports.Subject = Subject;


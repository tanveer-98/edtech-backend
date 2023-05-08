const mongoose = require('mongoose');
const {Schema} = mongoose;
const Joi = require('joi');

const autoIncrement = require('mongoose-auto-increment');

// const CounterSchema = new Schema({
//     _id : {type : String , required: true},
//     seq : {type : Number, default : 0}
// })

// let noticeCounter = mongoose.model('noticecounter', CounterSchema);

const noticeSchema = new Schema({
    id : {
        type : Number
    },

    notice : {
        type : String ,
        required : true,
        trim : true
    }
})
const Notice = mongoose.model("notice", noticeSchema);

//initialize the plugin 
// autoIncrement.initialize(mongoose.connection);

// noticeSchema.plugin(autoIncrement.plugin ,{
//     model : 'notice',
//     field : 'id',
//     startAt : 1,
//     incrementBy : 1
// })

// noticeSchema.pre('save' , function(next){
//     var notice = this;
//     const value = noticeCounter.find({}, {id:1});
//     console.log(value);
    
//     console.log(value)
//     // this.id = notice
//     next();
// })

function validateUser(notice) {
    const schema = Joi.object({
      notice: Joi.string().min(5).max(50).required(),
    });
  
    return schema.validate(notice);
  }
  

exports.Notice = Notice;
exports.validate = validateUser;


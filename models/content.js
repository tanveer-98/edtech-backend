const mongoose = require('mongoose');


const contentSchema = new mongoose.Schema({
    mail : {type : String ,unique : true},
    name : {type : String},
    password : {type : String}
})


module.exports  = mongoose.model("user",userSchema);
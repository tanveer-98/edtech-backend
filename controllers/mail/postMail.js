const User = require('../../models/user');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

const sendMail = async (req,res)=>{
    const data = req.body;
    try{
        console.log(data)

    }
    catch(err){
        return res.status(500).send("Error occured . Please try again."+err)
    }


    // return res.send('Register route');
}

module.exports = sendMail; 


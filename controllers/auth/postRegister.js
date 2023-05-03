const User = require('../../models/user');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const generateJWT =  (user) =>{
    // create JWT and send via response 
    
    const token= jwt.sign({
        userId : user._id,
        mail : user.mail
    },
    process.env.SECRET_KEY,
    {
        expiresIn : "1h" // expires in 1 hr 
    })

    // const token = 'JWT_TOKEN';
    return {
        mail : user.mail ,
        token : token , 
        name : user.name
    }
}
const postRegister = async (req,res)=>{
    try {    
        const {name , mail , password} = req.body;
        console.log(name);
        console.log(mail);
        console.log(password);

        // check if the user is the first to register 
        // Make the user an admin 

        const found  = await User.find({});
        
        if(found.length==0){
            const encryptedPassword   = await bcrypt.hash(password, 10)
            const user = await User.create({
                name :name, 
                mail: mail.toLowerCase(),
                password : encryptedPassword,
                isAdmin : true 
            })
          
            const response = generateJWT(user);
            return res.status(200).send(response);
        }
        else{
            // if list of users not empty
            // check if user already exists 

            const userExists = await User.exists({
                mail
            })
           
            if(userExists){
                throw new Error('E-mail already in use.')
            }

            // if not exists
            // create the new user but not
            const encryptedPassword = await bcrypt.hash(password, 10)
            const user = await User.create({
                name :name, 
                mail: mail.toLowerCase(),
                password : encryptedPassword,
            })

          
            const response =  generateJWT(user);
            return res.status(200).send(response);
        }
    }
    catch(err){
        return res.status(500).send("Error occured . Please try again."+err)
    }
}

module.exports = postRegister; 


const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next){
    const token = req.header("Authorization").replace('Bearer ','');
    if(!token) return res.status(400).send('Access Denied. No token provided');

    try{
        const decoded = jwt.verify(token, config.get('SECRET_KEY'));
        req.user = decoded;
        next();
    }
    catch(ex){
        res.status(400).send('Invalid token');
    }
}

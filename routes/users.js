const bcrypt = require('bcrypt');
const jwt = require ('jsonwebtoken');
const config = require('config');
const _ = require('lodash');
const { User, validate } = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth')
const admin = require('../middleware/admin')

router.get('/me' , [auth , admin], async (req,res)=>{
    // get admin details
    const user = await User.findById(req.user.id).select('-password');
    return res.status(200).send(user);
})

router.post('/sign-up' , async (req,res)=>{

    // if body is empty
    if(Object.keys(req.body).length == 0 ) return res.status(400).send({
        error : "Request Body cannot be empty"
    })

    const { error } = validate(req.body);
    
    if(error) return res.status(400).send({error : error.details[0].message})


    // check if user already exists

    let user = await User.findOne({mail : req.body.mail});
    console.log("user")
    console.log(user)
    if(user!==null) return res.status(400).send({
        error : "User already Registered"
    })

    // if user not registered

    user = new User(_.pick(req.body, ['name', 'mail', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.isAdmin = false;

    await user.save();

    const token = "Bearer "+ await user.generateAuthToken();

    return res.status(201).header('Authorization',token ).send(_.pick(
        user , ['_id' , 'name' , 'mail']
    ))


})

router.post('/sign-up-admin' , async (req,res)=>{

    // if body is empty
    if(Object.keys(req.body).length == 0 ) return res.status(400).send({
        error : "Request Body cannot be empty"
    })

    const { error } = validate(req.body);
    
    if(error) return res.status(400).send({error : error.details[0].message})


    // check if user already exists

    let user = await User.findOne({mail : req.body.mail});

    console.log(user)

    if(user!==null) return res.status(400).send({
        error : "User already Registered"
    })

    // if user not registered

    user = new User(_.pick(req.body, ['name', 'mail', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user.isAdmin = true;

    await user.save();

    const token = "Bearer "+ await user.generateAuthToken();

    return res.status(201).header('Authorization',token ).send(_.pick(
        user , ['_id' , 'name' , 'mail']
    ))


})

module.exports = router;
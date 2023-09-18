const config = require('config');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const mongoose = require('mongoose');
const {User} = require('../models/user');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    const {error}= validate(req.body);
    if(error)  return res.status(400).send(error.details[0].message);

   let user = await User.findOne({email:req.body.email});
   if (!user) return res.status(400).send('Invalid email or password');

   const ValidPassword= await bcrypt.compare(req.body.password, user.password);
   if(!ValidPassword) return res.status(400).send('Invalid email or password');

   const token = user.generateAuthToken();
   res.send(token);
});

function validate(req){
    const schema = Joi.object({
        password: Joi.string().min(5).max(255).required(),
        email: Joi.string().min(5).max(255).required().email(),
})
return schema.validate(req);
};

module.exports=router;


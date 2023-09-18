const config = require('config');
const jwt = require('jsonwebtoken')
const Joi = require('joi');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024,
    },
    email: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255,
        unique: true
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = () => {
    const token = jwt.sign({_id:this._id, isAdmin:this.isAdmin},config.get('jwtPrivateKey'));
    return token;
}
const User = mongoose.model("User",userSchema);

function validateUsers(user){
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        password: Joi.string().min(5).max(255).required(),
        email: Joi.string().min(5).max(255).required().email(),
})
return schema.validate(user);

};

exports.User= User;
exports.validate= validateUsers;
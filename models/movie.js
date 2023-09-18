const Joi = require('joi');
const mongoose = require('mongoose');
const{genreSchema} = require('./genre');

const movieSchema= new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 5,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        minlength: 0,
        maxlength: 225
    },
    dailyRentalRates:{
        type: Number,
        required: true,
        minlength: 0,
        maxlength: 225
    }
});

const Movie = mongoose.model("Movie", movieSchema);

function validateMovies(movie){
    const schema = Joi.object({
        title: Joi.string().min(5).max(255).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).max(255).required(),
        dailyRentalRates: Joi.number().min(0).max(255).required(),
})

return schema.validate(movie);
};

exports.movieSchema= movieSchema;
exports.Movie= Movie;
exports.validate= validateMovies;
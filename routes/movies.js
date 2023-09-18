const {Movie, validate} = require('../models/movie');
const{Genre} = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const movies = await Movie.find().sort('name');
    res.send(movies);
});

router.post('/', async (req, res) => {
    const {error}= validate(req.body);
    if(error)  return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.params.genreId);
    if(!genre) return res.status(404).send('Invalid Genre');

  const movie = new Movie ({ 
    title: req.body.title,
    genre: {
        _id:genre._id,
        name:genre.name
    },
    numberInStock:req.body.numberInStock,
    dailyRentalRates:req.body.dailyRentalRates
    });   
  await movie.save();
  res.send(movie);
});

router.get('/:id', async(req,res)=>{
    const genre = await Movie.findById(req.params.id);
    if(!genre) return res.status(404).send('Movie Not Found');
    res.send(movie);
})

router.put('/:id',async (req,res)=>{
    const {error} = validate(req.body);
    if (error)  return res.status(400).send(error.details[0].message);

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(404).send("Invalid Genre");

    const movie= await movie.findByIdAndUpdate(req.params.id, 
        {
         title: req.body.title,
         genre: {
                _id:genre._id,
                name:genre.name
            },
        numberInStock:req.body.numberInStock,
        dailyRentalRates:req.body.dailyRentalRates
    },
       {new: true});
   
    if(!Movie) return res.status(404).send('Movie Not Found');
    res.send(Movie);
});

router.delete('/:id', async(req,res)=>{
    const movie= await Movie.findByIdAndRemove(req.params.id);
    if(!movie) return res.status(404).send('Movie Not Found');
    res.send(movie);
});

module.exports = router;
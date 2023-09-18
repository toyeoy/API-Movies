const Fawn = require('fawn');
const {Rental, validate} = require('../models/rental');
const{Movie} = require('../models/movie');
const {Customer}= require('../models/customer')
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

Fawn.init('mongodb://localhost:27017/');

router.get('/', async (req, res) => {
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});

router.post('/', async (req, res) => {
    const {error}= validate(req.body);
    if(error)  return res.status(400).send(error.details[0].message);

    const customer = await Customer.findById(req.body.customerId);
    if (!customer) return res.status(404).send("Invalid Customer");

    const movie = await Movie.findById(req.body.movieId);
    if (!movie) return res.status(404).send("No Movie like That");

    if (movie.numberInStock == 0) return res.status(400).send('Movie not in stock');

  let rental = new Rental ({ 
    customer: {
        _id:customer._id,
        name:customer.name,
        phone:customer.phone
    },
    movie:{
        _id:movie._id,
        title:movie.title,
        dailyRentalRate:movie.dailyRentalRate
    },
    });

    try{
        new fawn.Task()
        .save('rentals',rental)
        .update('movies',{_id:movie._id}, 
        {$inc:{numberInStock:-1}
    })
    .run()
  res.send(rental);
      }
      catch(ex){
        res.status(500).send("Something Failed");
        console.log(err);
      }
});

router.get('/:id', async(req,res)=>{
    const genre = await Movie.findById(req.params.id);
    if(!genre) return res.status(404).send('Invalid ID');

    res.send(movie);
});

router.put('/:id',async (req,res)=>{
    const {error} = validate(req.body);
    if (error)  return res.status(400).send(error.details[0].message);

    const movie= await movie.findByIdAndUpdate(req.params.id, 
        {
            customer: {
                _id:customer._id,
                name:customer.name,
                phone:customer.phone
            },
            movie:{
                _id:movie._id,
                title:movie.title,
                dailyRentalRate:movie.dailyRentalRate
            },
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
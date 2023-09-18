const {customer, validate} = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

router.post('/', async (req, res) => {
    const {error}= validate(req.body);
    if(error)  return res.status(400).send(error.details[0].message);

  const customer = new Customer ({ 
    name: req.body.name,
    phone: req.body.phone, 
    isGold: req.body.isGold
     });
  await customer.save();
  res.send(customer);
});

router.put('/:id',async (req,res)=>{
    const {error} = validate(req.body);
    if (error)  return res.status(400).send(error.details[0].message);

    const customer= await customer.findByIdAndUpdate(req.params.id, 
        {
         name: req.body.name,
         phone: req.body.phone,
         isGold: req.body.isGold
    },
       {new: true});
   
    if(!customer) return res.status(404).send('The customer with the given ID not found');
    res.send(customer);
});

router.delete('/:id', async(req,res)=>{
    const customer= await Customer.findByIdAndRemove(req.params.id);
    if(!customer) return res.status(404).send('The customer with the given ID not found');

    res.send(customer);
});

router.get('/:id', async(req,res)=>{
    const genre = await Customer.findById(req.params.id);
    if(!genre) return res.status(404).send('The customer with the given ID not found');

    res.send(customer);
});

module.exports = router;
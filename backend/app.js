//mongodb+srv://jon:<password>@piiquante.9kwsg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');


mongoose.connect('mongodb+srv://jon:bluebirds1927@piiquante.9kwsg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  })
  .catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});


app.use('/api/sauces', (req, res, next) => {
  const sauces = [
    {
      userId: '',
      name: '',
      manufacturer: '',
      description: '',
      maiPepper: '',
      imaUrl: '',
      heat: '',
      likes: '',
      dislikes: '',
      usersLiked: '',
      usersDisliked: ''
    },
  ];
  res.status(200).json(sauces);
});


app.use((req, res, next) => {
  console.log('Request received!');
  next();
});

app.use((req, res, next) => {
  res.status(201);
  next();
});

app.use((req, res, next) => {
  res.json({ message: 'Your request was successful!' });
  next();
});

app.use((req, res, next) => {
  console.log('Response sent successfully!');
});

app.use('/api/auth', userRoutes);

module.exports = app;
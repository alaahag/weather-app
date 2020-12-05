const express = require('express');
const api = require('./server/routes/api.js');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use('/', api);

mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://localhost/WeatherAppDB', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

app.listen(port, function(){
    console.log(`server is running on port: '${port}'`);
});
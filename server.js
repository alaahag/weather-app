const express = require('express');
const api = require('./server/routes/api.js');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const URI = process.env.MONGODB_URI || 'mongodb://localhost/WeatherAppDB';

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use('/', api);

mongoose.set('useCreateIndex', true);
mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

app.listen(PORT, function(){
    console.log(`server is running on port: ${PORT}`);
});
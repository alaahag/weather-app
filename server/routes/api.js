const express = require('express');
const router = express.Router();
const axios = require('axios');
const moment = require('moment');
const City = require('../models/City.js');
const API_KEY = "b7ccccddb421f13c7a2a6da8f86761b4";


router.get('/sanity', function(req, res){
    //200 = OK
    res.sendStatus(200);
});

const helperData = function(cityData){
    return{
        name: cityData.data.name,
        temperature: cityData.data.main.feels_like,
        condition: cityData.data.weather[0].description,
        conditionPic: cityData.data.weather[0].icon,
        updatedAt: moment.unix(cityData.data.dt).format("YYYY-MM-DD HH:mm")
    };
};

router.get('/city/:lat/:lon', async function(req, res){
    //This route should take a lat lon coords parameter and return the city data in a response
    try{
        const cityData = await axios.get(encodeURI(`http://api.openweathermap.org/data/2.5/weather?lat=${req.params.lat}&lon=${req.params.lon}&appid=${API_KEY}&units=metric`));
        const filteredData = helperData(cityData);
        res.send(filteredData);
    }
    catch(err){
        console.log(err);
        res.send(null);
    }
});

router.get('/city/:cityName', async function(req, res){
    //This route should take a cityName parameter and return the city data in a response.
    //http://api.openweathermap.org/data/2.5/weather?q=London&appid=b7ccccddb421f13c7a2a6da8f86761b4
    //http://openweathermap.org/img/wn/10n@2x.png
    try{
        const cityData = await axios.get(encodeURI(`http://api.openweathermap.org/data/2.5/weather?q=${req.params.cityName}&appid=${API_KEY}&units=metric`));
        const filteredData = helperData(cityData);
        res.send(filteredData);
    }
    catch(err){
        console.log(err);
        res.send(null);
    }
});

router.get('/cities', async function(req, res){
    //This route should find all of the city data saved in your DB, and send it to the client
    await City.find({}).sort({name: 1}).exec(function(err, cities){
        res.send(cities);
    });
});

router.post('/city', async function(req, res){
    //This route should save a new City to your DB
    try{
        const city = new City({...req.body});
        await city.save();
        res.send(city);
    }
    catch(err){
        console.log(err);
        res.send(null);
    }
});

router.put('/city/:cityName', async function(req, res){
    //This route should take a cityName parameter and delete the correct city from your DB
    try{
        const cityData = await axios.get(encodeURI(`http://api.openweathermap.org/data/2.5/weather?q=${req.params.cityName}&appid=${API_KEY}&units=metric`));
        const filteredData = helperData(cityData);
        await City.findOneAndUpdate({ name: req.params.cityName }, filteredData, {new: true}, function(err, city){
            if (city)
                res.send(city);
            else
                res.send(filteredData);
        });
    }
    catch(err){
        console.log(err);
        res.send(null);
    }
});

router.delete('/city/:cityName', async function(req, res){
    //This route should take a cityName parameter and delete the correct city from your DB
    try{
        await City.findOneAndDelete({ name: req.params.cityName }, function(err, city){
            res.send(city);
        });
    }
    catch(err){
        console.log(err);
        res.send(null);
    }
});

module.exports = router;
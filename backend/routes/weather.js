const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const WeatherHistory = require('../models/WeatherHistory');

const router = express.Router();

const fetchOpenMeteo = async (lat = 40.7128, lon = -74.0060, isPast = false) => {
    let url = '';
    if (isPast) {
        // Fetch last 14 days of historical data
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        url = `https://archive-api.open-meteo.com/v1/archive?latitude=${lat}&longitude=${lon}&start_date=${startDate}&end_date=${endDate}&daily=temperature_2m_mean,precipitation_sum,rain_sum,snowfall_sum&timezone=auto`;
    } else {
        // Fetch current and forecast
        url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation&daily=temperature_2m_max,temperature_2m_min,weathercode,precipitation_sum,uv_index_max&timezone=auto`;
    }
    
    const response = await axios.get(url, { timeout: 10000 });
    return response.data;
};

router.get('/current', async (req, res) => {
    try {
        const lat = req.query.lat || 40.7128;
        const lon = req.query.lon || -74.0060;
        
        const data = await fetchOpenMeteo(lat, lon, false);
        
        // Save to mongo in background without awaiting, to prevent hanging if DB is stalled
        if (data.current_weather && mongoose.connection.readyState === 1) {
             const newHistory = new WeatherHistory({
                 location: req.query.location || `Lat: ${lat}, Lon: ${lon}`,
                 latitude: lat,
                 longitude: lon,
                 temperature: data.current_weather.temperature,
                 windspeed: data.current_weather.windspeed,
                 weathercode: data.current_weather.weathercode,
                 isHistorical: false
             });
             newHistory.save().catch(e => console.log("Mongo save skipped"));
        }

        res.json(data);
    } catch (err) {
        console.error('Error fetching current weather:', err.message, err.stack);
        res.status(500).json({ error: 'Failed to fetch current weather data', details: err.message, stack: err.stack });
    }
});

router.get('/history-api', async (req, res) => {
    try {
         const lat = req.query.lat || 40.7128;
         const lon = req.query.lon || -74.0060;
         const data = await fetchOpenMeteo(lat, lon, true);
         res.json(data);
    } catch(err) {
         console.error('Error fetching history:', err.message);
         res.status(500).json({ error: 'Failed to fetch historical weather data', details: err.message });
    }
});

module.exports = router;

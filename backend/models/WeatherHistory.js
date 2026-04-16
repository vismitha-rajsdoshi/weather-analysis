const mongoose = require('mongoose');

const weatherHistorySchema = new mongoose.Schema({
    location: {
        type: String,
        required: true,
        default: 'Global' // To index general queries
    },
    latitude: {
        type: Number,
        required: true
    },
    longitude: {
        type: Number,
        required: true
    },
    temperature: {
        type: Number,
        required: true
    },
    windspeed: {
        type: Number
    },
    weathercode: {
        type: Number
    },
    isHistorical: {
        type: Boolean,
        default: false
    },
    dateRecorded: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('WeatherHistory', weatherHistorySchema);

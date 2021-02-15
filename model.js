const mongoose = require('mongoose');

const Result = new mongoose.Schema({
    title: { type: String, required: true },
    publicationName: { type: String, required: true },
    url: { type: String, required: true },
    date: { type: Date, required: true }
})

module.exports = mongoose.model('Result', Result)
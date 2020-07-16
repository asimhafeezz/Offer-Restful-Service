const mongoose = require('mongoose')

const offerSchema = new mongoose.Schema({
    offerName: String,
    offerLocation: String,
    offerImagePath: String,
    offerDescription: String
    })

const Offer = mongoose.model('Offers', offerSchema)

module.exports.offerSchema = offerSchema 
module.exports.Offer = Offer 
const mongoose = require('mongoose')

const connectionString = "mongodb+srv://user1:user1@cluster0.bszad.mongodb.net/OfferDB?retryWrites=true&w=majority"

module.exports = mongoose.connect(connectionString, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log("Mongodb is Connected")
    })
    .catch(err => {
        console.log(err)
    })

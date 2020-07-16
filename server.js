const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()
//body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//cors
app.use(cors())

//import db connection
require('./connection')

//import schema and model
const {Offer} = require('./schema')




//add new offer
app.post('/offer', (req, res) => {

    let {offerName , offerLocation , offerImagePath , offerDescription} = req.body

    let addOffer = async () => {
    const offer = new Offer({
    offerName: 'offerName',
    offerLocation: 'offerLocation',
    offerImagePath: 'offerImagePath',
    offerDescription: 'offerDescription'
    })
    
    const result = await offer.save()
    console.log(result)
    }

    addOffer()

    res.end('Data saved')
})

//get all offers offer
app.post('/alloffer', (req, res) => {

    let getOffers = async () => {
        const result_offers = await Offer.find()
        console.log(result_offers)
    }

    getOffers()

    res.end('Data saved')
})

//find by id 
app.post('/offerfindbyid', (req, res) => {

    let getOffersByID = async () => {
        const result_offers = await Offer.findById(req.body.id)
        console.log(result_offers)
    }

    getOffersByID()

    res.end('Data saved')
})

//update offer by id 
app.post('/updateofferbyid', (req, res) => {

    let { offerName , offerLocation , offerImagePath , offerDescription , id} = req.body
    

    let updateCourse = async () => {

    const result_offer = await Offer.findById(id)
    if (!result_offer) return
    
    result_offer.offerName = offerName
    result_offer.offerDescription = offerLocation
    result_offer.offerImagePath = offerImagePath
    result_offer.offerDescription = offerDescription


    const updatedResult = await result_offer.save()
    
    console.log(updatedResult)
    }
    
    updateCourse()

    res.end('Data Updated')
})


//find by id and delete 
app.post('/deleteofferbyid', (req, res) => {

    let getOffersByID = async () => {
        const deletedResult = await Offer.deleteOne({_id:req.body.id})
        console.log(deletedResult)
    }

    getOffersByID()

    res.end('Data Deleted')
})



app.listen(5000 , () => console.log('server started...'))
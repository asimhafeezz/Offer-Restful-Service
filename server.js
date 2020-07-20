const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const multer =require('multer')
const path=require('path');
const directory = '../../carrentalmanagement/public/offerImages';
var fname = null
const storage=multer.diskStorage({
        destination:function(req,file,cb){
                //define the directory
                cb(null,directory);
        },
        filename:function(req,file,cb){
                fname = new Date().toISOString().replace(/:/g, '-')+file.originalname
                cb(null,fname);
        }
});
const upload=multer({storage:storage});

const app = express()


//body-parser
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())

//cors
app.use(cors())

//import db connection
require('./connection')

//import schema and model
const {
    Offer
} = require('./schema')


//upload images
app.post('/uploadFile', upload.single('offerImage'), (req, res) => {
    let offerImagePath = req.file.originalname

    console.log("offerimagepath",offerImagePath)
    console.log("offerbody",req.body)
    let {
        offerName,
        offerLocation,
        offerDescription
    } = req.body

    let addOffer = async () => {
        const offer = new Offer({
            offerName: offerName,
            offerLocation: offerLocation,
            offerImagePath: fname,
            offerDescription: offerDescription
        })

        const result = await offer.save()
        console.log(result.offerImagePath)
    }

    addOffer()

    res.end('Data saved')
})

app.get('/getImage',(req,res)=>{
    const {offerImage}=req.body;

    res.send(path.resolve(directory+offerImage));
})


//add new offer
app.post('/offer', (req, res) => {

    let {
        offerName,
        offerLocation,
        offerImagePath,
        offerDescription
    } = req.body

    let addOffer = async () => {
        const offer = new Offer({
            offerName: offerName,
            offerLocation: offerLocation,
            offerImagePath: offerImagePath,
            offerDescription: offerDescription
        })

        const result = await offer.save()
        console.log(result)
    }

    addOffer()

    res.end('Data saved')
})

//get all offers offer
app.get('/alloffer', (req, res) => {

    Offer.find().then(resp => res.status(200).json({ 'data': resp }))
    .catch(err => console.log(err.message))
})

//find by id 
app.get('/offerfindbyid/:id', (req, res) => {

    Offer.findById(req.params.id).then(resp => {
        res.status(200).json({ 'data': resp })
        res.end()
    })
    .catch(err => console.log(err.message))
})

//update offer by id 
app.put('/updateofferbyid/:id', (req, res) => {

    let {
        offerName,
        offerLocation,
        offerImagePath,
        offerDescription
    } = req.body


    let updateCourse = async () => {

        const result_offer = await Offer.findById(req.params.id)
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
app.delete('/deleteofferbyid/:id', (req, res) => {

    let getOffersByID = async () => {
        const deletedResult = await Offer.deleteOne({
            _id: req.params.id
        })
        console.log(deletedResult)
    }

    getOffersByID()

    res.end('Data Deleted')
})



//testing
app.get('/test', (req, res) => {
    console.log("body" , req.body)
    console.log("req",req)
})


app.listen(5000, () => console.log('server started...'))
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const { v4: uuidv4 } = require('uuid');

const fs = require('fs')
const multer =require('multer')
const path=require('path');
const directory = './public/offerImages';
var fname = null




const storage=multer.diskStorage({
        destination:function(req,file,cb){
                //define the directory
                cb(null,directory);
        },
        filename:function(req,file,cb){
                fname = uuidv4() +file.originalname
                cb(null,fname);
        }
});
const upload=multer({storage:storage});

const app = express()


app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/offerImages')));

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
app.post('/offer', upload.single('offerImage'), (req, res) => {
    // let offerImagePath = req.file.originalname

    // console.log("offerimagepath",offerImagePath)
    // console.log("offerbody",req.body)
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
    const filename=req.file.originalname;

    res.send(path.resolve(directory+filename));
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
app.put('/updateofferbyid/:id', upload.single('offerImage') , (req, res) => {

    let {
        offerName,
        offerLocation,
        offerDescription
    } = req.body


    let updateCourse = async () => {

        const result_offer = await Offer.findById(req.params.id)
        if (!result_offer) return
        else if (req.file === undefined) {
        result_offer.offerName = offerName
        result_offer.offerDescription = offerLocation
        result_offer.offerImagePath = result_offer.offerImagePath
        result_offer.offerDescription = offerDescription
        }
        else {
            fs.unlink('D:/code/project/backend/offer services/public/offerImages' + "/" + result_offer.offerImagePath, function (err) {
                if (err) throw err;
                // if no error, file has been deleted successfully
                console.log('File deleted!');
            });
    
            result_offer.offerName = offerName
            result_offer.offerDescription = offerLocation
            result_offer.offerImagePath = fname
            result_offer.offerDescription = offerDescription
        }
        

        

        const updatedResult = await result_offer.save()

        console.log(updatedResult)
    }

    updateCourse()

    res.end('Data Updated')
})


//find by id and delete 
app.delete('/deleteofferbyid/:id', (req, res) => {

    let getOffersByID = async () => {
        const result_offer = await Offer.findById(req.params.id)

        if(result_offer)
        fs.unlink('D:/code/project/backend/offer services/public/offerImages' + "/" + result_offer.offerImagePath, function (err) {
            if (err) throw err;
            // if no error, file has been deleted successfully
            console.log('File deleted!');
        });

        await Offer.deleteOne({
            _id: req.params.id
        })
    }

    getOffersByID()

    res.end('Data Deleted')
})



//testing
app.get('/test', (req, res) => {
var stats = fs.statSync("D:/code/project/carrentalmanagement/public/offerImages");
    console.log('File Size in Bytes:- ' + stats.size);
    getSize("D:/code/project/carrentalmanagement/public/offerImages", (err, size) => {
  if (err) { throw err; }
 
  console.log(size + ' bytes');
//   console.log((size / 1024 / 1024).toFixed(2) + ' MB');
});
})


app.listen(5000, () => console.log('server started...'))
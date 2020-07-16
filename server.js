const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

//import db connection
require('./connection')

const app = express()
//body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//cors
app.use(cors())

app.post('/send', (req, res) => {
    
})

app.listen(5000 , () => console.log('server started...'))
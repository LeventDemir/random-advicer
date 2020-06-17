const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

const app = express()

const user = require('./routes/user')
const mmtv = require('./routes/mmtv')


mongoose.connect(process.env.DB || 'mongodb://localhost/random-advicer', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})

mongoose.connection.on("open", () => console.log("✔ Connected to mongodb"));
mongoose.connection.on("error", err => console.log({ mongooseError: err }));


app.use(bodyParser.json())
app.use('/user', user)
app.use('/mmtv', mmtv)


module.exports = app
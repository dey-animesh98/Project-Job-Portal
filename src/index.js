const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const route = require('./Routers/routes')
const port = process.env.PORT || 5500

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect("mongodb+srv://animesh-dey98:9I9JRLwql3bINqUX@cluster0.vhmqo.mongodb.net/project-Job-Portal", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDB is Connected..."))
    .catch((err) => console.log(err.message))

app.use('/', route)

app.listen(port, function () {
    console.log("Express app is running on ", port)
})
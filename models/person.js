const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.mongodbURL

console.log('connecting to', url)

mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to MongoDB', error.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    date: Date,
    important: Boolean,
})

module.exports = mongoose.model('Person', personSchema)
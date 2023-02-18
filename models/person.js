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
    name: {
        type: String,
        minLength: 3
    },
    number: {
        type: String,
        minLength: 8,
        validate: {
            validator: function(v) {
                let dashIndex = v.indexOf('-')
                if (dashIndex === -1) {
                    return true
                } else if (dashIndex !== v.lastIndexOf('-')) {
                    return false
                }
                return /\d{2,3}-\d{6,}(?!\w)/.test(v)
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    date: Date,
    important: Boolean,
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)
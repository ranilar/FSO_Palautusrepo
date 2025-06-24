const mongoose = require('mongoose')

const url = process.env.MONGODB_URI
console.log(url)

mongoose.set('strictQuery', false)
mongoose.connect(url)

console.log('connecting to', url)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB', result)
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })



const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function(x) {
        return /^\d{2,3}-\d{5,}$/.test(x)
      },
      message: 'Incorrect number format'
    },
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)

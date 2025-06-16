const mongoose = require("mongoose")

const url = process.env.MONGODB_URI
console.log(url)

mongoose.set("strictQuery", false)
mongoose.connect(url)

console.log("connecting to", url)
mongoose.connect(url)
  .then(result => {
    console.log("connected to MongoDB")
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message)
  })


const personsSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model("Person", personsSchema)

personsSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("Person", personsSchema)
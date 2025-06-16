
const mongoose = require("mongoose")

if (process.argv.length < 3) {
  console.log("give password as argument")
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://ilariranin:${password}@cluster0.megjfez.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set("strictQuery", false)
mongoose.connect(url)

const personsSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model("Persons", personsSchema)


const createNew = () => {
    const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
    })
    person
    .save()
    .then(result => {
    console.log("person saved!")
    mongoose.connection.close()
    })
}

const findAll = () => {
    Person
    .find({})
    .then(result => {
    console.log("Phonebook")
    result.forEach(person => {
        console.log(`${person.name}, ${person.number}`)
    })
    mongoose.connection.close()
    })
}

if (process.argv.length === 3) {
  findAll()
}

if (process.argv.length === 5) {
  createNew()
}

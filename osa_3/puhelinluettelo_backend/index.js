require('dotenv').config()
const express = require("express")
const cors = require('cors')
const app = express()
const Person = require("./models/person")

app.use(express.static("dist"))
app.use(express.json())

app.get("/", (request, response) => {
    response.send("<h1>Hello World!</h1>")
})


app.get("/api/persons", (request, response) => {
    Person
    .find({})
    .then(persons => {
      response.json(persons)
    })
})

app.get("/api/persons/:id", (request, response) => {
  const id = request.params.id
  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      }
    })
})

app.delete('/api/persons/:id', (request, response) => {
  console.log("persons before delete:", Person)
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end()
    })

  console.log("persons after delete:", Person)
  response.status(204).end()
})

app.post("/api/persons", (request, response) => {
    console.log("persons before post:", Person)
    if (!request.body.name || !request.body.number) {
        return response.status(400).json({
            error: "name and/or number missing"
        })
    }
    Person.findOne({ name: request.body.name })
    .then(existingPerson => {
      if (existingPerson) {
        return response.status(400).json({
          error: "person already added"
        })
      }
    })

    const person = new Person({
    name: request.body.name,
    number: request.body.number
    })
    person
    .save()
    .then(savedPerson => {
    console.log("persons after post:", Person)
    response.json(savedPerson)
    })    
})

app.get("/info", (request, response) => {
    const date = new Date()
    response.send(`
            <p>Phonebook has info for ${Person.length} people</p>
            ${date.toLocaleTimeString("fi-FI")}
            `)
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
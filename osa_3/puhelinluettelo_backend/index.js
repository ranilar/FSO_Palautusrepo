require('dotenv').config()
const express = require("express")
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
    .catch(error => next(error))
})

app.get("/api/persons/:id", (request, response, next) => {
  const id = request.params.id
  Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  Person.findByIdAndDelete(id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post("/api/persons", (request, response, next) => {
    if (!request.body.name || !request.body.number) {
        const error = new Error("Name and/or number missing")
        error.name = "MissingInfo"
        return next(error)
    }
    Person.findOne({ name: request.body.name })
    .then(existingPerson => {
      if (existingPerson) {
        const error = new Error("Person already added")
        error.name = "DuplicatePerson"
        return next(error)
      }
    })

    const person = new Person({
    name: request.body.name,
    number: request.body.number
    })
    person
    .save()
      .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))

})

app.put("/api/persons/:id", (request, response, next) => {
  const { number } = request.body

  if (!number) {
    const error = new Error("Number missing")
    error.name = "MissingInfo"
    return next(error)
  }

  Person.findByIdAndUpdate(
    request.params.id,
    { number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      if (!updatedPerson) {
        return response.status(404).json({ error: "Person not found" })
      }
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.get("/info", (request, response) => {
    const date = new Date()
    response.send(`
            <p>Phonebook has info for ${Person.length} people</p>
            ${date.toLocaleTimeString("fi-FI")}
            `)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === "MissingInfo") {
    return response.status(400).json({ error: "name and/or number missing" })
  }

  if (error.name === "DuplicatePerson") {
    return response.status(400).json({ error: "person already added" })
  }

  if (error.name === "CastError") {
    return response.status(400).json({ error: "malformatted id" })
  }

  return response.status(500).json({ error: "internal server error" })
}

app.use(errorHandler)


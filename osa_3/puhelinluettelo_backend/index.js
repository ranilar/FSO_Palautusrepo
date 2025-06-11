const express = require("express")
const cors = require('cors')
const app = express()

app.use(express.static("dist"))
app.use(express.json())
app.use(cors())

let persons = [
    { 
      "name": "Arto Hellas", 
      "number": "040-123456",
      "id": "1"
    },
    { 
      "name": "Ada Lovelace", 
      "number": "39-44-5323523",
      "id": "2"
    },
    { 
      "name": "Dan Abramov", 
      "number": "12-43-234345",
      "id": "3"
    },
    { 
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122",
      "id": "4"
    }
  ]

app.get("/", (request, response) => {
    response.send("<h1>Hello World!</h1>")
})


app.get("/api/persons", (request, response) => {
    response.send(persons)
})

app.get("/api/persons/:id", (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)
    response.send(person)
    console.log("found persom:", person)
})

app.delete('/api/persons/:id', (request, response) => {
  console.log("persons before delete:", persons)
  const id = request.params.id
  persons = persons.filter(person => person.id !== id)

  console.log("persons after delete:", persons)
  response.status(204).end()
})

app.post("/api/persons", (request, response) => {
    console.log("persons before post:", persons)
    if (!request.body.name || !request.body.number) {
        return response.status(400).json({
            error: "name and/or number missing"
        })
    }
    if (persons.some((person) => person.name.toLowerCase() === request.body.name.toLowerCase())) {
        return response.status(400).json({
            error: "person already added"        
    })
}

    const person = {
        name: request.body.name,
        number: request.body.number,
        id: String(Math.floor(Math.random() * 10000))
    }
    persons = persons.concat(person)
    
    console.log("persons after post:", persons)
    response.json(person)
})

app.get("/info", (request, response) => {
    const date = new Date()
    response.send(`
            <p>Phonebook has info for ${persons.length} people</p>
            ${date}
            `)
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
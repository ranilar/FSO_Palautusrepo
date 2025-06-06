import { useState, useEffect } from "react"
import axios from "axios"
import personService from "../services/personService"
import Notification from "../components/Notification"
import "./index.css"

const ShowPersons = ({ persons, handleDeletion }) => {
  return (
    <div>
      {persons.map((person) => (
        <p key={person.name}>
          {person.name} {person.number} <button onClick={() => handleDeletion(person.id)}>delete</button>

        </p>
      ))}
    </div>
  )
}

const Filter = ({ newSearch, handleNameSearch }) => {
  return (
    <div>
      filter shown with:
      <input value={newSearch} onChange={handleNameSearch} />
    </div>
  )
}

const PersonForm = ({
  newName,
  newNumber,
  handleNameChange,
  handleNumberChange,
  handleAddName,
}) => {
  return (
    <form onSubmit={handleAddName}>
      <div>
        name: <input value={newName} onChange={handleNameChange} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const App = () => {

useEffect(() => {
  personService
    .getAll()
    .then(initialPersons => {
      setPersons(initialPersons)
    })
}, [])

  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState("")
  const [newNumber, setNewNumber] = useState("")
  const [newSearch, setNewSearch] = useState("")

  const handleNameSearch = (event) => {
    setNewSearch(event.target.value)
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleDeletion = (id) => {
    if (window.confirm("Are you sure you want to remove this person?")) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        setSuccessMessage(
            "Deletion succesful"
          )
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        })
        .catch(error => {
        setErrorMessage(
            "That person was already removed from the server"
          )
          setPersons(persons.filter(n => n.id !== id))
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
    })
  } else {
    window.alert("k then")
  }}


  const handleAddName = (event) => {
    event.preventDefault()
    if (!persons.some((person) => person.name.toLowerCase() === newName.toLowerCase())) {
      const nameObject = {
        name: newName,
        number: newNumber,
      }
      personService
        .create(nameObject)
        .then((returnedName) => {
      setPersons(persons.concat(returnedName))
      setNewName("")
      setNewNumber("")
      setSuccessMessage(
          `'${newName}' was added`
        )
        setTimeout(() => {
          setSuccessMessage(null)
        }, 5000)
      })
    } else {
      if ( window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(({ name }) => name.toLowerCase() === newName.toLowerCase())      
        const nameObject = {
          name: person.name,
          number: newNumber
        }
        personService
        .update(person.id, nameObject)
        .then((returnedName) => {
          setPersons(
          persons.map((p) => (p.id !== returnedName.id ? p : returnedName)))
        setSuccessMessage(
            "Number succesfully changed"
          )
          setTimeout(() => {
            setSuccessMessage(null)
          }, 5000)
        })
      }
      setNewName("")
      setNewNumber("")
    }
  }

  const personsToShow =
    newSearch === ""
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(newSearch.toLowerCase())
        )

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification.success message={successMessage}/>
      <Notification.error message={errorMessage}/>
      <Filter newSearch={newSearch} handleNameSearch={handleNameSearch} />
    
      <h3>Add a new</h3>

      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        handleAddName={handleAddName}
      />

      <h3>Numbers</h3>

      <ShowPersons persons={personsToShow} handleDeletion={handleDeletion} />
    </div>
  )
}

export default App

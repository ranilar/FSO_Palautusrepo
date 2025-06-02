import { useState } from 'react'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState(
    'New note...'
  )

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  
  const handleAddName = (event) => {
    event.preventDefault()
    const nameObject = {
      name: newName
    }
    setPersons(persons.concat(nameObject))
    setNewName("")
  }

  const ShowPerson = (props) => {
    return (
      <div>
          {props.persons.map(person =>
            <p key={person.name}> 
            {person.name}
            </p>
          )}
      </div>
    )
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={handleAddName} >
        <div>
          name: <input value={newName}
          onChange={handleNameChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ShowPerson key={persons.name} persons={persons} />
    </div>
  )

}

export default App
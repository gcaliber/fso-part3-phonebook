import { useEffect, useState } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import bookService from './services/phonebook'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterName, setNewFilter] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    bookService
      .getAll()
      .then(initialPersons => setPersons(initialPersons))
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const person = persons.find(e => e.name === newName)
    const changedPerson = {...person, number: newNumber}
      if (person) {
        if (window.confirm(`${newName} already exists. Update phone number to ${newNumber}?`)) {
          bookService
            .update(person.id, changedPerson)
            .then(returnedPerson => {
              setPersons(persons.map(p => p.id !== person.id ? p : returnedPerson))
            setNotification({message: `Successfully updated ${person.name}.`, type: 'success'})
            setTimeout(() => {
              setNotification(null)
            }, 5000)
            })
            .catch(error => {
              setNotification({message: `Unable to update ${person.name}, name not found.`, type: 'error'})
              setTimeout(() => {
                setNotification(null)
              }, 5000)
            })
        }
    }
    else {
      const personObject = { name: newName, number: newNumber }
      bookService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setNotification({message: `Successfully added ${personObject.name}.`, type: 'success'})
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
    }
  }

  const deletePerson = (event) => {
    const id = parseInt(event.target.id)
    const name = persons.find(p => p.id === id).name
    if (window.confirm(`Delete ${name}?`)) {
      bookService
      .remove(id)
      .then(() => 
        setPersons(persons.filter(p => p.id !== id))
      )
    }
  }

  const handleFilterChange = (event) => setNewFilter(event.target.value)
  const handleNameChange = (event) => setNewName(event.target.value)
  const handleNumberChange = (event) => setNewNumber(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <Filter value={filterName} handle={handleFilterChange} />
      <h2>Add new contact</h2>
      <PersonForm 
        submitHandle={addPerson}
        nameValue={newName} 
        nameHandle={handleNameChange}
        numberValue={newNumber}
        numberHandle={handleNumberChange}
      />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filterName} handleDelete={deletePerson} />
    </div>
  )
}

export default App
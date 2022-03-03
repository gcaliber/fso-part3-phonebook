require('dotenv').config()
const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(morgan((tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens['response-time'](req, res), 'ms -',
    tokens.res(req, res, 'content-length'),
    JSON.stringify(req.body)
  ].join(' ')
}))
app.use(express.json())

const Person = require('./models/person')

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/info', (request, response) => {
  Person.find({}).then(persons => {
    response.send(`The phonebook has info for ${persons.length} people<br> ${Date()}`)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person =>
      response.json(person)
    )
    .catch(error => {
      response.status(404).end()
    })
})

app.post('/api/persons', (request, response) => {
  const {name, number} = request.body

  if (!request.body) {
    return response.status(400).json({error: 'request body missing'})
  }

  if (!name) {
    return response.status(400).json({error: 'name required'})
  }

  if (!number) {
    return response.status(400).json({error: 'number required'})
  }

  // Person.findOne({ name: name })
  //   .then(found => {
  //     if (found) {
  //       return response.status(400).json({error: 'name must be unique'})
  //     }
  //     else {
  //       const person = new Person({
  //         name: name,
  //         number: number,
  //       })
      
  //       person.save().then(savedPerson => {
  //         return response.json(savedPerson)
  //       })
  //     }
  // })

  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then(savedPerson => {
    return response.json(savedPerson)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id, (error) => {
      if (error) {
        console.log(error)
      }
      else {
        console.log("Successful deletion")
      }
  })  
  response.status(204).end()
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})
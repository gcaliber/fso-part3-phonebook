require('dotenv').config()
const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const app = express()

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
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

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)


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
    .then(person => {
      if (person) {
        response.json(person)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

const validateRequest = (request) => {
  const {name, number} = request.body

  if (!request.body) 
    return { valid: false, error: {error: 'request body missing'}}

  if (!name)
    return { valid: false, error: {error: 'name required'}}

  if (!number)
    return { valid: false, error: {error: 'number required'}}

  return { valid: true, error: {}}
}

app.post('/api/persons', (request, response) => {
  const {valid, error} = validateRequest(request)
  if (!valid)
    return response.status(400).json(error)

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
    name: request.body.name,
    number: request.body.number,
  })

  person.save().then(savedPerson => {
    return response.json(savedPerson)
  })
})

app.put('/api/persons/:id', (request, response) => {
  const {valid, error} = validateRequest(request)
  if (!valid)
    return response.status(400).json(error)
  
  const { name, number } = request.body
  Person.findByIdAndUpdate(request.params.id, {name: name, number: number})
    .then(person => {
      return response.json({name: name, number: number, id: request.params.id})
    })
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(
      response.status(204).end()
    )
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`)
})
require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()

const unkownEndpoint = (request, response) => {
    console.log('unkownEndpoint')
    response.status(404).send({ error: 'unkown endpoint' })
}

const errorHandler = (error, request, response, next) => {
    console.log('errorHandler', error.message)

    if (error.name === 'CastError') {
        response.status(404).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens['body'](req, res)
    ].join(' ')
}))

app.use(express.json())
app.use(express.static('build'))

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id).then(person => {
        console.log('person', person)
        if (person) {
            response.json(person)
        } else {
            response.status(404).end()
        }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const name = request.body.name,
          number = request.body.number,
          id = Math.floor(Math.random() * 9999),
        //   nameExists = Person.find(person => person.name === name),
          handleError = (msg) => response.status(400).json({ error: msg })
    if (!name) {
        return handleError('Name Required')
    }
    if (!number) {
        return handleError('Number Required')
    }
    // if (nameExists) {
    //     return handleError('Name must be unique')
    // }
    const person = new Person({
        id: id,
        name: name,
        number: number,
        important: false
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const person = {
        id: body.id,
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(request.params.id, person, { new: true }).then(updatedPerson => {
        console.log('person', updatedPerson)
        response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id).then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
    Person.find({}).then(persons => {
        response.send(`
            <div>Phonebook has info for ${persons.length} people</div>
            </br>
            <div>${new Date}</div>
        `)
    })
})

app.use(unkownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
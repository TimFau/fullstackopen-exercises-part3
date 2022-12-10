const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2],
      name = process.argv[3],
      number = process.argv[4]

const url = `mongodb+srv://timfau:${password}@cluster0.q0msdh2.mongodb.net/phonebookApp?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  date: Date,
  important: Boolean,
})

const Person = mongoose.model('Person', personSchema)

mongoose
  .connect(url)
  .then((result) => {
    console.log('connected')

    if (name && number) {
      // Add New Person
      const person = new Person({
        name: name,
        number: number,
        date: new Date(),
        important: true,
      })
  
      return person.save().then(() => {
        console.log('added ' + name + ' number ' + number + ' to phonebook')
      })
    }

    // Get All People
    console.log('phonebook:')
    return Person.find({}).then(result => {
      result.forEach(person => {
        console.log(person.name, person.number)
      })
    })
  })
  .then(() => {
    console.log('connection closed')
    return mongoose.connection.close()
  })
  .catch((err) => console.log(err))

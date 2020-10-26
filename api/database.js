const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const db = low(new FileSync('./data/db.json'))

// Set some defaults (required if your JSON file is empty)
db.defaults({ zones: [] })
  .write()

module.exports = { db }

const bodyParser = require('body-parser')
const express = require('express')
const http = require('http')
const morgan = require('morgan')
const rpio = require('rpio')
rpio.init({ mapping: 'gpio' })

const api = require('./api')
const websockets = require('./api/websockets')
const cookerManager = require('./api/cooker-manager')

const port = process.env.PORT || 4201
const app = express()
const server = http.createServer(app)

// Logging
app.use(morgan(':method :url :status :response-time ms - :res[content-length]'))

// Static Website
app.use(express.static('website-dev'))

// API Routes
app.use(bodyParser.json())
app.use('/api', api)

// Setup Modules
cookerManager.start()

// Start Server
server.listen(port, () => console.info(`Listening on Port ${port}`))
websockets.listen(server)

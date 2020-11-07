const express = require('express')
const air = require('./air')
const pool = require('./pool')
const zones = require('./zones')

const api = express.Router()

// Pool Temperature
api.get('/pool/temperature', pool.getTemperature)
api.get('/pool/history', pool.getHistory)

// Air Temperature
api.get('/air/temperature', air.getTemperature)
api.get('/air/history', air.getHistory)

// Zones
api.get('/zones', zones.getAll)
api.post('/zones', zones.create)
api.get('/zones/:id', zones.getById)
api.put('/zones/:id', zones.update)
api.delete('/zones', zones.remove)

module.exports = api

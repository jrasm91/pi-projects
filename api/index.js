const express = require('express');
const zones = require('./zones');
const sensors = require('./sensors');

const api = express.Router();

// Sensors
api.get('/sensors/pool', sensors.getPoolTemp);
api.get('/sensors/air', sensors.getAirTemp);

// Zones
api.get('/zones', zones.getAll);
api.post('/zones', zones.create);
api.get('/zones/:id', zones.getById);
api.put('/zones/:id', zones.update);
api.delete('/zones', zones.remove);

module.exports = api;

const express = require('express');
const zones = require('./zones');
const sensors = require('./sensors');

const api = express.Router();

// Sensors
api.get('/sensors/live/pool', sensors.getPoolTemp);
api.get('/sensors/live/air', sensors.getAirTemp);
api.get('/sensors/history/air', sensors.getAirHistory);
api.get('/sensors/history/pool', sensors.getPoolHistory);

// Zones
api.get('/zones', zones.getAll);
api.post('/zones', zones.create);
api.get('/zones/:id', zones.getById);
api.put('/zones/:id', zones.update);
api.delete('/zones', zones.remove);

module.exports = api;

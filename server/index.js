const express = require('express');
const commands = require('./commands');

const Sensors = {
  POOL: '28-000009640cfd',
  AIR: '28-000009640cfd',
};

const api = express.Router();

// Pool Temperature
api.get('/sensors/pool', async (req, res) => {
  try {
    const { temperature, date } = await commands.getSensorTemp(Sensors.POOL);
    return res.send({ temperature, date });
  } catch (error) {
    return res.status(500).send('Unable to get pool temperature');
  }
});

// Outside Temperature
api.get('/sensors/air', async (req, res) => {
  try {
    const { temperature, date } = await commands.getSensorTemp(Sensors.AIR);
    return res.send({ temperature, date });
  } catch (error) {
    return res.status(500).send('Unable to get air temperature');
  }
});

module.exports = api;

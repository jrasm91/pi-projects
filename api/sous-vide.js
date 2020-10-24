const _ = require('lodash');
const commands = require('./commands');
const config = require('./config');
const websockets = require('./websockets');
const { Cooker, STATE } = require('./cooker');

const cookers = config.cookers.map(({ name, sensorId, relayId }) => {
  return new Cooker(name, sensorId, relayId);
});

function cookerMiddleware() {
  return function (req, res, next) {
    const cookerId = +(req.params.id) - 1;
    const cooker = cookers[cookerId];
    if (!cooker) {
      return res.status(404).send({ error: true, message: `Cooker not found: ${cookerId}` });
    }
    req.cooker = cooker;
    next();
  }
}

const getAll = (req, res) => res.send(cookers);
const getById = (req, res) => res.send(req.cooker);

const turnOn = (req, res) => {
  const { duration, temperature } = req.body;
  if (!duration || !temperature) {
    return res.status(400).send({ error: true, message: 'Bad Request: body.duration and body.temperature are required.' });
  }
  req.cooker.turnOn(duration, temperature);
  return res.sendStatus(201);
}
const startCooking = (req, res) => req.cooker.startCooking() && res.sendStatus(201);
const turnOff = (req, res) => req.cooker.turnOff() && res.sendStatus(201);

// Update temperature
setInterval(async () => {
  for (const cooker of cookers) {
    const { temperature } = await commands.getSensorTemp(cooker.sensorId).catch(() => 213);
    cooker.temperature = temperature;
    cooker.lastUpdated = new Date();
  }
}, config.intervals.TEMP_UPDATE * 1000);

// Update relay and state
setInterval(async () => {
  for (const cooker of cookers) {
    await cooker.update();
  }
}, config.intervals.MAIN_LOOP * 1000);

// Send cooker to web
setInterval(() => {
  for (const cooker of cookers) {
    websockets.sendMessage('cooker_update', cooker.export());
  }

}, config.intervals.WEB_UPDATE * 1000);

module.exports = {
  cookerMiddleware,
  getAll,
  getById,
  turnOn,
  turnOff,
  startCooking,
};


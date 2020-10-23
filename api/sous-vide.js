const _ = require('lodash');
const commands = require('./commands');
const { STATE, DEFAULT_COOKER } = require('./constant');
const config = require('./config');
const { dateDiff } = require('./helper');
const websockets = require('./websockets');

const cookers = config.cookers.map(({ name, sensorId, gpio }) => {
  return { name, sensorId, gpio, ...DEFAULT_COOKER };
});

// Main decision loop for sous vide cooker
async function mainLoop(cooker) {
  suveLog(`Starting ${cooker.name}`);
  const previous = _.cloneDeep(cooker);

  const { temperature } = await commands.getSensorTemp(cooker.sensorId);
  const now = new Date();
  cooker.temperature = temperature;
  cooker.lastUpdated = now;

  const isAboveTemp = cooker.temperature >= cooker.settings.temperature;
  const isBelowTemp = cooker.temperature < (cooker.settings.temperature - config.MAX_TEMPERATURE_DROP);
  const isBelowSafeTemp = cooker.temperature < config.SAFE_TEMPERATURE;

  const isRelayCool = dateDiff(now, cooker.timestamps.heating) > config.MIN_HEATING_COOLDOWN;
  const isDoneCooking = cooker.timestamps.cooking && dateDiff(now, cooker.timestamps.cooking) > cooker.settings.duration;

  function heating(onoff) {
    cooker.heating = onoff;
    cooker.timestamps.heating = now;
  }

  function toCooling() {
    cooker.state = COOLING;
    cooker.timestamps.cooling = now;
  }

  function toWarming() {
    cooker.state = STATE.WARMING;
    cooker.timestamps.warming = now;
    heating(true);
  }

  function toReady() {
    cooker.state = STATE.READY;
    cooker.timestamps.ready = now;
    heating(false);
  }

  function toCooking() {
    cooker.state = STATE.COOKING;
    cooker.timestamps.cooking = now;
  }

  function toCooling() {
    cooker.state = STATE.COOLING;
    cooker.timestamps.cooling = now;
    heating(false);
  }

  function toOff() {
    cooker.state = STATE.OFF;
    cooker.timestamps.end = now;
  }

  switch (cooker.state) {
    case STATE.START_WARMING:
      toWarming();
      break;
    case STATE.WARMING:
      if (isAboveTemp) {
        toReady();
      }
      break;
    case STATE.START_COOKING:
      toCooking();
      break;
    case STATE.READY:
    case STATE.COOKING:
      if (isDoneCooking) {
        toCooling();
        break;
      }

      if (!cooker.heating && isBelowTemp) {
        if (isRelayCool) {
          heating(true);
        } else {
          suveLog(`Needs heat, but hasn't met cooldown period.`);
        }
        break;
      }

      if (cooker.heating && isAboveTemp) {
        heating(false);
      }

      break;
    case STATE.START_COOLING:
      toCooling();
      break;
    case STATE.COOLING:
      if (isBelowSafeTemp) {
        toOff();
      }
      break;
    case STATE.OFF:
      if (cooker._intervalId) {
        clearInterval(cooker._intervalId);
      }
      break;
  }

  if (previous.state !== cooker.state) {
    suveLog(`Changed from ${previous.tate} to ${cooker.state}`)
  }

  if (previous.heating !== cooker.heating) {
    suveLog(`Changed heating from ${previous.heating} to ${cooker.heating}`)
  }

  const cookerUpdate = Object.assign({}, cooker);
  delete cookerUpdate._intervalId;
  websockets.sendMessage('cooker_update', cookerUpdate);
}

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

function turnOn(req, res) {
  const { duration, temperature } = req.body;
  if (!duration || !temperature) {
    return res.status(400).send({ error: true, message: 'Bad Request: body.duration and body.temperature are required.' });
  }

  const cooker = req.cooker;
  if (cooker.state !== STATE.OFF) {
    return res.status(400).send({ error: true, message: 'Bad Request: cooker is not stopped' });
  }

  cooker.settings = { temperature, duration, minTemperature: temperature - config.TEMPERATURE_THRESHOLD }
  cooker.state = STATE.START_WARMING;

  if (!cooker._intervalId) {
    cooker._intervalId = setInterval(async () => {
      try {
        await mainLoop(cooker)
      } catch (error) {
        console.error('Problem with sous-vide main loop, aborting.');
        console.error(error);
        clearInterval(cooker._intervalId);
      }
    }, config.LOOP_INTERVAL * 1000);
  }

  sendUpdate(cooker);
  return res.sendStatus(201);
}

function turnOff(req, res) {
  const cooker = req.cooker;
  cooker.state = STATE.START_COOLING;
  Object.assign(cooker.settings, DEFAULT_COOKER.settings);
  sendUpdate(cooker);
  return res.sendStatus(201);
}

function pause(req, res) {
  const cooker = req.cooker;
  if (this._intervalId) {
    clearInterval(this._intervalId);
  }
  sendUpdate(cooker);
  return res.sendStatus(201);
}

function resume(req, res) {
  const cooker = req.cooker;
  if (!this._intervalId) {
    cooker._intervalId = setTimeout()
  }
  sendUpdate(cooker);
  return res.sendStatus(201);
}

function startCooking(req, res) {
  const cooker = req.cooker;
  cooker.state = STATE.START_COOKING;
  sendUpdate(cooker);
  return res.sendStatus(201);
}

function sendUpdate(cooker) {
  const clean = { ...cooker };
  delete clean._intervalId;
  websockets.sendMessage('cooker_update', clean);
}

function suveLog(message) {
  console.log('cooker>' + message);
}

module.exports = {
  cookerMiddleware,
  getAll,
  getById,
  turnOn,
  turnOff,
  pause,
  resume,
  startCooking,
};


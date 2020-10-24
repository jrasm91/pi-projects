
const config = require('./config');
const { dateDiff, bindGPIO } = require('./helper');

const STATE = {
  OFF: 'OFF',
  PREHEATING: 'PREHEATING',
  READY: 'READY',
  COOKING: 'COOKING',
  WARMING: 'WARMING',
  COOLING: 'COOLING',
};

class Cooker {
  constructor(name, sensorId, relayId) {
    this.name = name;
    this.sensorId = sensorId;
    this.relayId = relayId;
    this._relay = bindGPIO(this.relayId);
    this.reset();
  }

  reset() {
    const now = new Date();
    this.temperature = null;
    this.lastUpdated = now;
    this.relayOn = false;
    this.relayStart = now;
    this.relayDelayed = 0;
    this.state = STATE.OFF;
    this.startStart = now;
    this.events = [];
    this.settings = {
      duration: null,
      temperature: null,
    };
  }

  turnOn(duration, temperature) {
    this.reset();
    this.settings = { duration, temperature };
    this.nextState(STATE.PREHEATING);
  }

  startCooking() {
    this.nextState(STATE.COOKING);
  }

  turnOff() {
    this.nextState(STATE.COOLING);
  }

  async update() {
    switch (this.state) {
      case STATE.OFF:
        break;

      case STATE.PREHEATING:
        if (this.isDonePreHeating()) {
          this.nextState(STATE.READY);
        }
        break;

      case STATE.READY:
        // transition from READY to COOKING via user input
        break;

      case STATE.COOKING:
        if (this.isDoneCooking()) {
          this.nextState(STATE.WARMING);
        }
        break;

      case STATE.WARMING:
        // transition from WARMING to COOLING via user input
        break;

      case STATE.COOLING:
        if (this.isDoneCooling()) {
          this.nextState(STATE.OFF);
        }
        break;
    }

    switch (this.state) {
      case STATE.PREHEATING:
      case STATE.READY:
      case STATE.COOKING:
      case STATE.WARMING:
        if (this.isUnderTemperature()) {
          await this.turnOnRelay();
        }

        if (this.isAtTemperature()) {
          await this.turnOffRelay();
        }
        break;

      default:
        await this.turnOffRelay();
    }
  }

  nextState(nextState) {
    const now = new Date();
    console.log(`[Cooker] STATE => Changed from ${this.state} to ${nextState}`);
    this.events.push({ state: this.state, start: this.stateStart, end: now });
    this.state = nextState;
    this.stateStart = now;
  }

  async turnOnRelay() {
    if (this.relayOn) {
      return;
    }

    const minCooldown = config.MIN_RELAY_COOLDOWN;
    const currentCooldown = dateDiff(new Date(), this.relayStart);
    this.relayDelayed = Math.max(0, minCooldown - currentCooldown);
    if (this.relayDelayed > 0) {
      console.log(`[Cooker] RELAY:${this.relayId} => Turning on in ${this.relayDelayed}s`);
      return;
    }

    await this._relay.write(config.GPIO_ON);
    this.relayOn = true;
    this.relayStart = new Date();
    console.log(`[Cooker] RELAY:${this.relayId} => Turned ON`);
  }

  async turnOffRelay() {
    if (!this.relayOn) {
      return;
    }
    await this._relay.write(config.GPIO_OFF);
    this.relayOn = false;
    console.log(`[Cooker] RELAY:${this.relayId}  => Turned Off`);
  }

  cleanup() {
    if (this._relay) {
      this._relay.writeSync(config.GPIO_OFF);
      this._relay.unexport();
    }
  }

  isDonePreHeating() {
    return this.state === STATE.PREHEATING && this.isAtTemperature();
  }

  isDoneCooking() {
    return this.state === STATE.COOKING && dateDiff(new Date(), this.stateStart) >= this.settings.duration;
  }

  isDoneCooling() {
    return this.state === STATE.COOLING && this.temperature <= config.SAFE_TEMPERATURE;
  }

  isUnderTemperature() {
    return this.temperature < (this.settings.temperature - config.MAX_TEMPERATURE_DROP);
  }

  isAtTemperature() {
    return this.temperature >= this.settings.temperature;
  }

  export() {
    const clean = { ...this };
    delete clean._relay;
    return clean;
  }
}

module.exports = { Cooker, STATE };

const rpio = require('rpio')
const commands = require('./commands')
const config = require('./config')
const { dateDiff } = require('./helper')

const STATE = {
  OFF: 'OFF',
  PREHEATING: 'PREHEATING',
  READY: 'READY',
  COOKING: 'COOKING',
  WARMING: 'WARMING',
  COOLING: 'COOLING'
}

class Cooker {
  constructor (name, sensorId, relayId, cookerId) {
    this.name = name
    this.sensorId = sensorId
    this.relayId = relayId
    this.cookerId = cookerId

    rpio.open(relayId, rpio.OUTPUT, rpio.HIGH)

    const now = new Date()
    this.temperature = null
    this.lastUpdated = now
    this.relayOn = false
    this.relayStart = null
    this.relayDelayed = 0
    this.state = STATE.OFF
    this.stateStart = now
    this.events = []
    this.settings = {
      duration: null,
      temperature: null
    }
  }

  turnOn (duration, temperature) {
    this.events = []
    this.settings = { duration, temperature }
    this.nextState(STATE.PREHEATING)
  }

  startCooking () {
    this.nextState(STATE.COOKING)
  }

  turnOff () {
    this.nextState(STATE.COOLING)
  }

  async updateTemperature () {
    try {
      const { temperature } = await commands.getSensorTemp(this.sensorId)
      this.temperature = temperature
    } catch (error) {
      console.warn('Error getting sensor temperature', error)
      this.temperature = 213
    } finally {
      this.lastUpdated = new Date()
    }
  }

  updateState () {
    switch (this.state) {
      case STATE.OFF:
        break

      case STATE.PREHEATING:
        if (this.isDonePreHeating()) {
          this.nextState(STATE.READY)
        }
        break

      case STATE.READY:
        // transition from READY to COOKING via user input
        break

      case STATE.COOKING:
        if (this.isDoneCooking()) {
          this.nextState(STATE.WARMING)
        }
        break

      case STATE.WARMING:
        // transition from WARMING to COOLING via user input
        break

      case STATE.COOLING:
        if (this.isDoneCooling()) {
          this.nextState(STATE.OFF)
        }
        break
    }

    switch (this.state) {
      case STATE.PREHEATING:
      case STATE.READY:
      case STATE.COOKING:
      case STATE.WARMING:
        if (this.isUnderTemperature()) {
          this.turnOnRelay()
        }

        if (this.isAtTemperature()) {
          this.turnOffRelay()
        }
        break

      default:
        this.turnOffRelay()
    }
  }

  nextState (nextState) {
    const now = new Date()
    console.log(`[Cooker] STATE => Changed from ${this.state} to ${nextState}`)
    this.events.push({ state: this.state, start: this.stateStart, end: now })
    this.state = nextState
    this.stateStart = now
  }

  turnOnRelay () {
    if (this.relayOn) {
      return
    }

    if (this.relayStart !== null) {
      const minCooldown = config.MIN_RELAY_COOLDOWN
      const currentCooldown = dateDiff(new Date(), this.relayStart)
      this.relayDelayed = Math.max(0, minCooldown - currentCooldown)
      if (this.relayDelayed > 0) {
        console.log(`[Cooker] RELAY:${this.relayId} => Turning on in ${this.relayDelayed}s`)
        return
      }
    }

    rpio.write(this.relayId, rpio.LOW)
    this.relayOn = true
    this.relayStart = new Date()
    console.log(`[Cooker] RELAY:${this.relayId} => Turned ON`)
  }

  turnOffRelay () {
    if (!this.relayOn) {
      return
    }
    rpio.write(this.relayId, rpio.HIGH)
    this.relayOn = false
    console.log(`[Cooker] RELAY:${this.relayId}  => Turned Off`)
  }

  isDonePreHeating () {
    return this.state === STATE.PREHEATING && this.isAtTemperature()
  }

  isDoneCooking () {
    return this.state === STATE.COOKING && dateDiff(new Date(), this.stateStart) >= this.settings.duration
  }

  isDoneCooling () {
    return this.state === STATE.COOLING && this.temperature <= config.SAFE_TEMPERATURE
  }

  isUnderTemperature () {
    return this.temperature < (this.settings.temperature - config.MAX_TEMPERATURE_DROP)
  }

  isAtTemperature () {
    return this.temperature >= this.settings.temperature
  }
}

module.exports = { Cooker, STATE }


const config = require('./config')
const websockets = require('./websockets')
const { Cooker } = require('./cooker')

class CookerManager {
  constructor () {
    this.cookers = []
    this.cookerId = 0
  }

  nextId () {
    return `cooker${++this.cookerId}`
  }

  getById (cookerId) {
    return this.cookers.find(cooker => cooker.cookerId === cookerId)
  }

  start () {
    setInterval(() => this.cookers.forEach(cooker => cooker.updateState()), config.loop.STATE)
    setInterval(() => this.cookers.forEach(cooker => cooker.updateTemperature()), config.loop.TEMPERATURE)
    setInterval(() => websockets.sendMessage('cooker:update', this.cookers), config.loop.UPDATE)

    websockets.addHandler('cooker:new', (...args) => manager.onNew(...args))
    websockets.addHandler('cooker:turnOn', (...args) => manager.onTurnOn(...args))
    websockets.addHandler('cooker:turnOff', (...args) => manager.onTurnOff(...args))
    websockets.addHandler('cooker:startCooking', (...args) => manager.onStartCooking(...args))

    config.cookers.forEach(({ name, sensorId, relayId }) => {
      this.cookers.push(new Cooker(name, sensorId, relayId, this.nextId()))
    })
  }

  onNew (message, socket) {
    const { name, sensorId, relayId } = message
    if (!name || !sensorId || !relayId) {
      return socket.emit('cooker:notification', { level: 'error', message: 'Bad Request (turnOn: name/sensorId/relayId)' })
    }
    this.cookers.push(new Cooker(name, sensorId, relayId, this.nextId()))
  }

  onTurnOn (message, socket) {
    const { cookerId } = message
    const cooker = this.getById(cookerId)
    if (!cooker) {
      return socket.emit('cooker:notification', { level: 'error', message: `Cooker not found: ${cookerId}` })
    }
    const { duration, temperature } = message
    if (!duration || !temperature) {
      return socket.emit('cooker:notification', { level: 'error', message: 'Bad Request (turnOn: duration/temperature)' })
    }
    cooker.turnOn(duration, temperature)
  }

  onTurnOff (message, socket) {
    const { cookerId } = message
    const cooker = this.getById(cookerId)
    if (!cooker) {
      return socket.emit('notification', { level: 'error', message: `Cooker not found: ${cookerId}` })
    }
    cooker.turnOff()
  }

  onStartCooking (message, socket) {
    const { cookerId } = message
    const cooker = this.getById(cookerId)
    if (!cooker) {
      return socket.emit('notification', { level: 'error', message: `Cooker not found: ${cookerId}` })
    }
    cooker.startCooking()
  }
}

const manager = new CookerManager()

module.exports = manager

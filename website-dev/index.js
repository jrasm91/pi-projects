const socket = io()

const app = new Vue({
  el: '#app',
  data: {
    update: 1,
    page: 2,
    cookers: []
  },
  mounted() {
    this.$options.timer = window.setTimeout(() => this.updateElapsedTime(), 250);
  },
  beforeDestroy() {
    window.clearTimeout(this.$options.timer);
  },
  methods: {
    updateElapsedTime() {
      this.cookers.forEach((cooker, i) => {
        cooker._elapsedTime = elapsedTime(cooker.stateStart)
        Vue.set(this.cookers, i, cooker)
      })
      this.$options.timer = window.setTimeout(() => this.updateElapsedTime(), 250);
    },
    turnOn: function (cooker) {
      const temperature = document.getElementById(`${cooker.cookerId}-temperature`).value
      const duration = document.getElementById(`${cooker.cookerId}-duration`).value
      const cookerId = cooker.cookerId
      socket.emit('cooker:turnOn', { cookerId, temperature, duration })
    },
    startCooking: function (cooker) {
      const cookerId = cooker.cookerId
      socket.emit('cooker:startCooking', { cookerId })
    },
    turnOff: function (cooker) {
      const cookerId = cooker.cookerId
      socket.emit('cooker:turnOff', { cookerId })
    }
  }
})

socket.on('cooker:update', cookers => {
  cookers.forEach(cooker => {
    cooker._stateClass = getStateClass(cooker)
    cooker._heatingClass = getHeatingClass(cooker)
    cooker._temperatureIcon = getTemperatureIcon(cooker)
    cooker._elapsedTime = elapsedTime(cooker.stateStart)
  })
  app.cookers = cookers
})

socket.on('cooker:notification', notification => {
  const { level, message } = notification
  console.info(`[Notification] [${level}]`, message)
})

function getStateClass(cooker) {
  switch (cooker.state) {
    case 'OFF':
      return 'text-default'
    case 'PREHEATING':
      return 'text-warning'
    case 'READY':
      return 'text-success'
    case 'COOKING':
      return 'text-danger'
    case 'WARMING':
      return 'text-warning'
    case 'COOLING':
      return 'text-info'
    default:
      return ''
  }
}

function getHeatingClass(cooker) {
  return cooker.relayOn ? 'text-danger' : ''
}

function getTemperatureIcon(cooker) {
  const temperature = cooker.temperature
  if (temperature > 175) {
    return 'fa-thermometer-full'
  } else if (temperature > 150) {
    return 'fa-thermometer-three-quarters'
  } else if (temperature > 125) {
    return 'fa-thermometer-half'
  } else if (temperature > 100) {
    return 'fa-thermometer-quarter'
  } else {
    return 'fa-thermometer-empty'
  }
}

function elapsedTime(time) {
  const seconds = getElapsedSeconds(time)

  const second = 1;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const month = day * 30;

  const timeFormats = [
    [second, minute],
    [minute, hour],
    [hour, day],
    [day, month],
  ]

  let display = ''
  for (const [secondsPerUnit, maxUnits, label] of timeFormats) {
    const units = Math.floor(seconds / secondsPerUnit);
    const xx = `${units % maxUnits}`.padStart(2, 0);
    if (xx === '00' && secondsPerUnit === day) {
      continue
    }
    display = display ? `${xx}:${display}` : xx
  }
  return display
}

function getElapsedSeconds(time) {
  if (time === null) {
    return 0;
  }
  switch (typeof time) {
    case 'number':
      break
    case 'string':
      time = +new Date(time)
      break
    case 'object':
      if (time.constructor === Date) {
        time = time.getTime()
      }
      break
    default:
      time = +new Date()
  }
  return (+new Date() - time) / 1000
}

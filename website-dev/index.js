const app = new Vue({
  el: '#app',
  data: {
    update: 1,
    page: 2,
    inputTemperature: 95,
    inputDuration: 10,
    cooker: {
      name: '--',
      sensorId: '--',
      relayId: '--',
      temperature: '--',
      lastUpdate: null,
      relayOn: null,
      relayStart: null,
      relayDelayed: 0,
      state: '--',
      stateStart: null,
      events: [],
      settings: { duration: '--', temperature: '--' },
    },
  },
  computed: {
    stateTimeAgo: function () {
      // This line causes the computed value to get updated every second
      const updateCount = this.update;
      return timeAgo(this.cooker.stateStart);
    },
    stateClass: function () {
      switch (this.cooker.state) {
        case 'OFF':
          return 'text-default';
        case 'PREHEATING':
          return 'text-warning';
        case 'READY':
          return 'text-success';
        case 'COOKING':
          return 'text-danger';
        case 'WARMING':
          return 'text-warning';
        case 'COOLING':
          return 'text-info';
        default:
          return '';
      }
    },
    heatingClass: function () {
      return this.cooker.relayOn ? 'text-danger' : '';
    },
    temperatureIcon: function () {
      const temperature = this.cooker.temperature;
      if (temperature > 175) {
        return 'fa-thermometer-full'
      } else if (temperature > 150) {
        return 'fa-thermometer-three-quarters';
      } else if (temperature > 125) {
        return 'fa-thermometer-half';
      } else if (temperature > 100) {
        return 'fa-thermometer-quarter';
      } else {
        return 'fa-thermometer-empty';
      }
    },
  },
  methods: {
    turnOn: function () {
      callAPI('/api/sous-vide/cookers/1/turnOn', { temperature: this.inputTemperature, duration: this.inputDuration });
    },
    startCooking: function () {
      callAPI('/api/sous-vide/cookers/1/start-cooking');
    },
    turnOff: function () {
      callAPI('/api/sous-vide/cookers/1/turnOff');
    },
  }
});

const socket = io();
socket.on('cooker_update', cooker => {
  console.log('cooker_update', cooker);
  app.cooker = cooker;
})

const timer = setInterval(() => {
  app.update += 1;
}, 5000);

/* --------------- Helper Functions ------------------- */
function callAPI(url, data, method) {
  return fetch(url, {
    method: method || 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}

function timeAgo(time) {
  if (time === null) {
    return 'N/A';
  }
  switch (typeof time) {
    case 'number':
      break;
    case 'string':
      time = +new Date(time);
      break;
    case 'object':
      if (time.constructor === Date) {
        time = time.getTime();
      }
      break;
    default:
      time = +new Date();
  }
  const timeFormats = [
    [60, 'seconds', 1],
    [3600, 'minutes', 60],
    [86400, 'hours', 3600],
    [604800, 'days', 86400],
    [2419200, 'weeks', 604800],
    [29030400, 'months', 2419200],
    [2903040000, 'years', 29030400],
    [58060800000, 'centuries', 2903040000],
  ];

  let seconds = (+new Date() - time) / 1000;
  if (seconds < 15) {
    return 'Just now';
  }

  for (const [threshold, label, exact] of timeFormats) {
    if (seconds < threshold) {
      return `${Math.floor(seconds / exact)} ${label}`;
    }
  }
  return time;
}

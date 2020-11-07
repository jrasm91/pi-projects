const config = {
  POOL_SENSOR_ID: '28-000009640cfd',
  AIR_SENSOR_ID: '28-000009640cfd',

  MAX_TEMPERATURE_DROP: 3, // in degrees
  MIN_RELAY_COOLDOWN: 60, // in seconds
  SAFE_TEMPERATURE: 85, // in degrees
  LOOP_INTERVAL: 5, // in seconds,

  GPIO_ON: 0,
  GPIO_OFF: 1,

  loop: {
    STATE: 1,
    TEMPERATURE: 5 * 1000,
    UPDATE: 2 * 1000
  },

  cookers: [
    { name: 'Cooker #1', sensorId: '28-00000976e714', relayId: 21 }
    // { name: 'Cooker #2', sensorId: '28-0000096578cc', relayId: 20 },
    // { name: 'Cooker #3', sensorId: '28-000009763e8a', relayId: 26 }
  ]
}

module.exports = config

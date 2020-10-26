const commands = require('./commands')
const config = require('./config')

async function getTemperature (req, res) {
  try {
    const { temperature, date } = await commands.getSensorTemp(config.AIR_SENSOR_ID)
    return res.send({ temperature, date })
  } catch (error) {
    console.error(error)
    return res.status(500).send('Unable to get air temperature')
  }
}

async function getHistory (req, res) {
  try {
    const results = await commands.readCSV('./data/air_temp_history.csv')
    results.forEach(result => {
      result[0] = parseFloat(result[0])
    })
    return res.send(results)
  } catch (error) {
    console.error(error)
    return res.status(500).send(`Unable to get air history: ${error}`)
  }
}

module.exports = { getTemperature, getHistory }

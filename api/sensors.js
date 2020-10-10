const commands = require('./commands');

const Sensors = {
	POOL: '28-000009640cfd',
	AIR: '28-000009640cfd',
};

async function getAirTemp(req, res) {
	try {
		const { temperature, date } = await commands.getSensorTemp(Sensors.AIR);
		return res.send({ temperature, date });
	} catch (error) {
		return res.status(500).send('Unable to get air temperature');
	}
}

async function getPoolTemp(req, res) {
	try {
		const { temperature, date } = await commands.getSensorTemp(Sensors.POOL);
		return res.send({ temperature, date });
	} catch (error) {
		return res.status(500).send('Unable to get pool temperature');
	}
}

// Outside Temperature
module.exports = {
	getAirTemp,
	getPoolTemp,
};

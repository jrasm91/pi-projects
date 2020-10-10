const { db } = require('./database');

const zones = db.get('zones');

function getAll(req, res) {
	return res.send(db.get('zones').value());
}

function create(req, res) {
	const { id, name } = req.body;
	if (!id || !name) {
		return res.status(400).send({ error: true, message: `Bad Request: ${error}` });
	}

	const zone = { id, name };
	zones.push(zone).write();
	return res.send(zone);
}

function getById(req, res) {
	const zoneId = req.params.id;
	const zone = zones.find({ id: zoneId }).value();
	if (!zone) {
		return res.status(404).send({ error: true, message: `Zone not found: ${zoneId}` });
	}
	return res.send(zone);
}

function update(req, res) {
	const { name } = req.body;
	if (!name) {
		return res.status(400).send({ error: true, message: `Bad Request: ${error}` })
	}

	const id = req.params.id;
	const zone = zones.find({ id }).value();
	if (!zone) {
		return res.status(404).send({ error: true, message: `Zone not found: ${id}` });
	}

	const updatedZone = zones.chain().find({ id }).assign(zone).value();
	return res.status(200).send(updatedZone)
}

function remove(req, res) {
	const zoneId = req.params.id;
	const zone = zones.find({ id: zoneId }).value();
	if (!zone) {
		return res.status(404).send({ error: true, message: `Zone not found: ${zoneId}` });
	}
	zones.remove({ id: req.params.id }).write();
	return res.status(200).send({ message: `Zone removed: ${zone.id}` });
}

module.exports = { create, getAll, update, getById, remove };


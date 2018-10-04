var utils = require('../utils');
var globals = require('../globals');
var mongoose = require('mongoose');

var exports = module.exports = {};

var dbconnection;
var schemas = {};


function connect() {
	return new Promise((resolve, reject) => {
		mongoose.connect(globals.url_local_clients).then((ret) => {
			console.log('connected to mongodb server');
			resolve(ret);
		}).catch((error) => {
			console.log('error: ', error)
			reject(error);
		});
	});
}

function init() {
	connect().then((ret) => {
		dbconnection = ret;
		// dbconnection.on('error', console.error.bind(console, 'MongoDB connection error:'));
	}).catch((err) => {
		console.log(err);
		throw new Error('could not stabilish connection. error');
	});

	// DEFINE SCHEMAS
	schemas.client = new mongoose.Schema({
		name: { type: String, required: true },
		cpf: { type: String, require: true, unique: true },
		age: { type: Number, min: [18, 'you need to be of age, sorry'], required: true },
		birthday: { type: Date, required: true },
		marital_status: { type: String, required: true, enum: ['never married', 'married', 'widowed', 'divorced', 'separated'] },
		address: { type: String, required: true },
		formal_school: { type: String, required: true, enum: ['no formal', 'incomplete primary', 'complete primary', 'incomplete high school', 'complete high school', 'incomplete graduation', 'graduated', 'masters degree', 'doctorship', 'post doctor'] },
	});

	schemas.client.path('cpf').set((value) => {
		return utils.validate_cpf(value)
	});

	// exporting models instances
	exports.clientModel = mongoose.model('ClientModel', schemas.client);
}

// exporting
exports.init = init;
exports.connect = connect;
exports.schemas = schemas;

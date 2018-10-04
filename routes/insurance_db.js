var utils = require('../utils');
var globals = require('../globals');
var mongoose = require('mongoose');

var exports = module.exports = {};

var dbconnection;
var schemas = {};


function connect() {
	return new Promise((resolve, reject) => {
		mongoose.connect(globals.url_local_insurances).then((ret) => {
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
	schemas.insurance = new mongoose.Schema({
		type: { type: String, required: true, enum: ['auto', 'bike'] },
		owner_cpf: { type: String, require: true },
		insurance_value: { type: Number, required: true },
		asset_value: { type: Number, required: true },
		agreement_date: { type: Date, required: true, default: Date.now() },
		conclusion_date: { type: Date, required: true },
		grace_periodo: { type: Number, required: true, default: 30 }, // in days
		contract: { type: String, required: true },
		product_description: { type: String, required: true },
	});

	schemas.insurance.path('owner_cpf').set((value) => {
		return utils.validate_cpf(value);
	});

	schemas.insurance.path('grace_periodo').set((value) => {
		return value >= 0;
	});

	// exporting models instances
	exports.insuranceModel = mongoose.model('InsuranceModel', schemas.insurance);
}

// exporting
exports.init = init;
exports.connect = connect;
exports.schemas = schemas;

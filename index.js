const utils = require('./utils');
const globals = require('./globals');
const mongoose = require('mongoose');
const route_client = require('./rotues/client');

var dbconnection;
var schemas = {};

function connect() {
	console.log('globals.url_local: ', globals.url_local)
	mongoose.connect(globals.url_local).then((ret) => {
		console.log('connected to mongodb server');
		console.log(ret);
	}).catch((error) => {
		console.log('error: ', error)
	});
}

function init() {
	dbconnection = mongoose.connection;
	dbconnection.on('error', console.error.bind(console, 'MongoDB connection error:'));


	// DEFINE SCHEMAS
	schemas.client = new mongoose.Schema({
		name: { type: String, required: true },
		cpf: { type: String, require: true },
		age: { type: Number, min: [18, 'you need to beof age, sorry'], required: true },
		birthday: { type: Date, required: true },
		marital_status: { type: String, required: true, enum: ['never married', 'married', 'widowed', 'divorced', 'separated'] },
		address: { type: String, required: true },
		formal_school: { type: String, required: true, enum: ['no formal', 'incomplete primary', 'complete primary', 'incomplete high school', 'complete high school', 'incomplete graduation', 'graduated', 'masters degree', 'doctorship', 'post doctor'] },
	});

	schemas.client.path('cpf').set((value) => {
		return utils.validate_CPF(value)
	});
	schemas.client.path('age').set((value) => {
		return Date.now() - birthday >= 18;
	});

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
		return utils.validate_CPF(value)
	});

	// COMPILE MODEL FORM SCHEMA
	// var client = mongoose.model('client', clientSchema);
	// var insurance = mongoose.model('insurance', insuranceSchema);
}


init();
connect();
route_client.init();

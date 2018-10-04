// imports
var http = require('http');
var database = require('./insurance_db');
var globals = require('../globals');
var paths = require('./paths');
var utils = require('../utils');
var express = require('express');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');
var server;

// open db connection
// database.init();

//starting
var app;
app = express();
app.use(bodyparser.json()); //application/json
app.use(bodyparser.urlencoded({ extended: true }));


// defining routes
app.post(paths.insurance, (req, res) => {
	let typeEnum = ['auto', 'bike'];
	let msg;
	var errorcode = 400;
	var conclusionDate;
	var agreementDate;

	// validation
	if(!utils.validate_datetime(req.body.conclusion_date)) {
		msg = '"conclusion_date" date field format, must be ' + utils.get_datetime_format() + '.';
	} else {
		conclusionDate = utils.date_exists(req.body.conclusion_date);
		if(conclusionDate == undefined) {
			msg = '"conclusion_date" date is invalid.';
		}
	}
	if(msg == undefined) {
		if(req.body.agreement_date != undefined && !utils.validate_datetime(req.body.agreement_date)) {
			msg = '"agreement_date" date field format, must be ' + utils.get_datetime_format() + '.';
		} else {
			agreementDate = utils.date_exists(req.body.agreement_date);
			if (agreementDate == undefined) {
				msg = '"agreement_date" date is invalid.';
			}
		}
		if (msg == undefined) {
			if(conclusionDate == undefined) {
				msg = '"conclusion_date" data field is invalid'
			} else if(req.body.owner_cpf == undefined) {
				msg = 'missing cpf field';
			} else if(req.body.insurance_value == undefined) {
				msg = 'missing cpf field';
			} else if(typeEnum.indexOf(req.body.type) < 0) {
				msg = '"marital_status" fild must be in [' + typeEnum.join() + '] options';
			}
		}
	}

	res.setHeader('Content-Type', 'application/json');
	if(msg == undefined) {
		let insurance = new database.insuranceModel();
		insurance.type = req.body.type;
		insurance.owner_cpf = req.body.owner_cpf;
		insurance.insurance_value = req.body.insurance_value;
		insurance.asset_value = req.body.asset_value;
		insurance.agreement_date = agreementDate;
		insurance.conclusion_date = conclusionDate
		insurance.grace_periodo = req.body.grace_periodo;
		insurance.contract = req.body.contract;
		insurance.product_description = req.body.product_description;

		// checking user existency
		http.get(
			"http://" + globals.domain_local + ":" + globals.api_port[0] + paths.client + '/' + req.body.owner_cpf + ':cpf',
			(ret) => {
				ret.setEncoding('utf8');
				ret.on('data', function (user) {
					if(user != undefined) {
						// save new insurance
						insurance.save().then((doc) => {
							// success!
							res.status(200);
							res.send();
						}).catch((error) => {
							// insurance already exists
							msg = 'insurance already exists, try updating'
							res.status(403);
							res.send(JSON.stringify({ 'error': error }, null, 2));
						});
					} else {
						res.status(400);
						res.send(JSON.stringify({ 'error': 'this user is not registrated or your cpf is wrong' }, null, 2));
					}
				});

		}).on('error', function (err) {
			res.status(errorcode);
			res.send(JSON.stringify({ 'error': 'could not acess the client service' }, null, 2));
		});
	} else {
		// input invalid
		res.status(errorcode);
		res.send(JSON.stringify({ 'error': msg }, null, 2));
	}
});


// exports
var exports = module.exports = {};

exports.init = function () {
	database.init();
	server = app.listen(globals.api_port[1].toString());
}

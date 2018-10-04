// imports
var database = require('./client_db');
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
var app = express();
app.use(bodyparser.json()); //application/json
app.use(bodyparser.urlencoded({ extended: true }));


// defining routes
app.post(paths.client, (req, res) => {
	let maritalEnum = ['never married', 'married', 'widowed', 'divorced', 'separated'];
	let schoolEnum = ['no formal', 'incomplete primary', 'complete primary', 'incomplete high school', 'complete high school', 'incomplete graduation', 'graduated', 'masters degree', 'doctorship', 'post doctor'];
	let msg;
	let birthday;
	var errorcode = 400;

	// validation
	if(!utils.validate_datetime(req.body.birthday)) {
		msg = 'wrong date format, must be ' + utils.get_datetime_format() + '.';
	} else {
		birthday = utils.date_exists(req.body.birthday);
	}
	if(msg == undefined) {
		if(birthday == null) {
			msg = 'birthday date is invalid';
		} else if(utils.date_diff_year(Date.now(), birthday) < 18) {
			msg = 'your must be of age';
		} else if(req.body.name == undefined) {
			msg = 'missing name field';
		} else if(req.body.cpf == undefined) {
			msg = 'missing cpf field';
		} else if(req.body.birthday == undefined) {
			msg = 'missing birthday field';
		} else if(req.body.marital_status == undefined) {
			msg = 'missing marital_status field';
		} else if(req.body.address == undefined) {
			msg = 'missing address field';
		} else if(req.body.formal_school == undefined) {
			msg = 'missing formal_school field';
		} else if(!utils.validate_cpf(req.body.cpf)) {
			msg = 'cpf id invalid';
		} else if(maritalEnum.indexOf(req.body.marital_status) < 0) {
			msg = '"marital_status" fild must be in [' + maritalEnum.join() + '] options' ;
		} else if(schoolEnum.indexOf(req.body.formal_school) < 0) {
			msg = '"marital_status" fild must be in [' + schoolEnum.join() + '] options' ;
		} else if(req.body.address == '') {
			msg = '"adress" muts contain something' ;
		}
	}

	res.setHeader('Content-Type', 'application/json');
	if(msg == undefined) {
		let user = new database.clientModel();
		user.name = req.body.name;
		user.cpf = req.body.cpf;
		user.birthday = birthday;
		user.marital_status = req.body.marital_status;
		user.address = req.body.address;
		user.formal_school = req.body.formal_school;
		user.age = utils.date_diff_year(Date.now(), birthday);

		// save new user
		user.save().then((doc) => {
			// success!
			res.status(200);
			res.send();
		}).catch((error) => {
			// user already exists
			msg = 'user already exists, try updating'
			res.status(403);
			res.send(JSON.stringify({ 'error': error }, null, 2));
		});
	} else {
		// input invalid
		res.status(errorcode);
		res.send(JSON.stringify({ 'error': msg }, null, 2));
	}
});

app.get(paths.client + '/:cpf', (req, res) => {
	let errorcode = 400;
	let msg;
	let response;

	// validation
	if(req.params.cpf == undefined) {
		msg = 'cpf id invalid';
		res.send(JSON.stringify({"msg": "missing cpf on get"}, null, 2));
	}else if (!utils.validate_cpf(req.params.cpf)) {
		msg = 'cpf id invalid';
	}

	res.setHeader('Content-Type', 'application/json');
	if (msg == undefined) {
		// input validated
		// check if user already exists
		database.clientModel.findOne({ cpf: req.params.cpf }).then((doc) => {
			res.status(200);
			res.send(JSON.stringify(doc, null, 2));
		}).catch((error) => {
			res.status(500);
			res.send(JSON.stringify({ 'erro': error }, null, 2));
		});
	} else {
		// input invalid
		res.status(errorcode);
		res.send(JSON.stringify({ 'erro': msg }, null, 2));
	}
});

app.delete(paths.client + '/:cpf', (req, res) => {
	let errorcode = 400;
	let msg;
	let response;

	// validation
	if (req.params.cpf == undefined) {
		msg = 'cpf id invalid';
		res.send(JSON.stringify({ "msg": "missing cpf on get" }, null, 2));
	} else if (!utils.validate_cpf(req.params.cpf)) {
		msg = 'cpf id invalid';
	}

	res.setHeader('Content-Type', 'application/json');
	if (msg == undefined) {
		// input validated
		database.clientModel.deleteOne({cpf: req.params.cpf}).then((doc) => {
			if(doc.n == 0) {
				res.status(400);
				res.send(JSON.stringify({ 'msg': 'user does not exist' }, null, 2));
			} else {
				res.status(200);
				res.send();
			}
		}).catch((err) => {
			res.status(errorcode);
			res.send(JSON.stringify({ 'erro': error }, null, 2));
		});
	} else {
		// input invalid
		res.status(errorcode);
		res.send(JSON.stringify({ 'erro': msg }, null, 2));
	}
});

app.put(paths.client + '/:cpf', (req, res) => {
	let maritalEnum = ['never married', 'married', 'widowed', 'divorced', 'separated'];
	let schoolEnum = ['no formal', 'incomplete primary', 'complete primary', 'incomplete high school', 'complete high school', 'incomplete graduation', 'graduated', 'masters degree', 'doctorship', 'post doctor'];
	let errorcode = 400;
	let msg;
	let response;

	// validation
	if (!utils.validate_datetime(req.body.birthday)) {
		msg = 'wrong date format, must be ' + utils.get_datetime_format() + '.';
	} else {
		birthday = utils.date_exists(req.body.birthday);
	}
	if (msg == undefined) {
		if (req.params.cpf == undefined) {
			msg = 'cpf id invalid';
			res.send(JSON.stringify({ "msg": "missing cpf on get" }, null, 2));
		} else if (!utils.validate_cpf(req.params.cpf)) {
			msg = 'cpf id invalid';
		} else if (birthday == null) {
			msg = 'birthday date is invalid';
		} else if (utils.date_diff_year(Date.now(), birthday) < 18) {
			msg = 'your must be of age';
		} else if (req.body.name == undefined) {
			msg = 'missing name field';
		} else if (req.body.cpf == undefined) {
			msg = 'missing cpf field';
		} else if (req.body.birthday == undefined) {
			msg = 'missing birthday field';
		} else if (req.body.marital_status == undefined) {
			msg = 'missing marital_status field';
		} else if (req.body.address == undefined) {
			msg = 'missing address field';
		} else if (req.body.formal_school == undefined) {
			msg = 'missing formal_school field';
		} else if (!utils.validate_cpf(req.body.cpf)) {
			msg = 'cpf id invalid';
		} else if (maritalEnum.indexOf(req.body.marital_status) < 0) {
			msg = '"marital_status" fild must be in [' + maritalEnum.join() + '] options';
		} else if (schoolEnum.indexOf(req.body.formal_school) < 0) {
			msg = '"marital_status" fild must be in [' + schoolEnum.join() + '] options';
		} else if (req.body.address == '') {
			msg = '"adress" muts contain something';
		}
	}

	res.setHeader('Content-Type', 'application/json');
	if (msg == undefined) {
		// input validated
		updateObj = {
			'name': req.body.name,
			'cpf': req.body.cpf,
			'birthday': birthday,
			'marital_status': req.body.marital_status,
			'address': req.body.address,
			'formal_school': req.body.formal_school,
			'age': utils.date_diff_year(Date.now(), birthday),
		}
		database.clientModel.findOneAndUpdate({ cpf: req.params.cpf }, { $set: updateObj}).then((doc) => {
			if(doc != null) {
				res.status(200);
				res.send();
			} else {
				msg = 'user already does not exist'
				res.status(403);
				res.send(JSON.stringify({ 'error': msg }, null, 2));
			}
		}).catch((err) => {
			res.status(500);
			res.send(JSON.stringify({ 'error': error }, null, 2));
		});
	} else {
		// input invalid
		res.status(errorcode);
		res.send(JSON.stringify({ 'erro': msg }, null, 2));
	}
});


// exports
var exports = module.exports = {};

exports.init = function() {
	database.init();
	server = app.listen(globals.api_port[0].toString());
}

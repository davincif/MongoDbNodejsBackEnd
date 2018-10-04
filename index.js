var utils = require('./utils');
var globals = require('./globals');
var mongoose = require('mongoose');
var route_client = require('./routes/client');
var rounte_insurance = require('./routes/insurance');

route_client.init();
rounte_insurance.init();

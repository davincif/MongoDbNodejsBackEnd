var exports = module.exports = {};

// domains
exports.domain = 'zeropay-selective.davincif.com.br';
exports.domain_local = '127.0.0.1';

// database related
exports.user = 'zeroPayAdmin';
exports.pwd = 'selection';
exports.user2 = 'zeroPayAdmin';
exports.pwd2 = 'selection';
exports.url_clients = 'mongodb://' + exports.user + ':' + exports.pwd + '@' + exports.domain + ':27019';
exports.url_local_clients = 'mongodb://' + exports.user + ':' + exports.pwd + '@' + exports.domain_local + ':27017';
exports.url_insurances = 'mongodb://' + exports.user2 + ':' + exports.pwd2 + '@' + exports.domain + ':27019';
exports.url_local_insurances = 'mongodb://' + exports.user2 + ':' + exports.pwd2 + '@' + exports.domain_local + ':27018';

// API related
exports.api_port = [8001, 8002];

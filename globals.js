var exports = module.exports = {};

// database related
exports.user = 'zeroPayAdmin';
exports.pwd = 'selection';
exports.url = 'mongodb://' + exports.user + ':' + exports.pwd + '@zeropay-selective.davincif.com.br:27018/';
exports.url_local = 'mongodb://' + exports.user + ':' + exports.pwd + '@127.0.0.1:27017/';

// API related
exports.api_port = "8000";

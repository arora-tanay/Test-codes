
const config = require('../config/config_detail');
var compare = require('tsscmp');


// Basic function to validate credentials for example
function check(name, pass) {
	var valid = true;
	// Simple method to prevent short-circut and use timing-safe compare
	valid = compare(name, config.basic_username) && valid;
	valid = compare(pass, config.basic_password) && valid;

	return valid
}

const authJwt = {
	check: check
};
module.exports = authJwt;

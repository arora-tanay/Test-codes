const CryptoJS = require('crypto-js');
const {  swagger_origin, encrypt_key,jwt_key} = require('../config/config_detail');
const message = require('./message');



exports.response = (res, status, message, result, token) => {
	let response;
	if (token == null) {
		response = {
			status,
			message,
			data: result,
		}
	} else {
		response = {
			status,
			message,
			data: result,
			authToken: token,
		}
	}
	
		if (global.origin == swagger_origin || global.origin == undefined) {
			return res.json(response)
		}
		response = CryptoJS.AES.encrypt(JSON.stringify(response), encrypt_key).toString();
		return res.json({ 'res': response });
};

// Decode Request
exports.decode = req => {
	if (Object.keys(req.body).length != 0) {
		// Decrypt
		const bytes = CryptoJS.AES.decrypt(req.body.data, encrypt_key);
		req.body = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
		return req
	}
	return req
};

// Encode Response
exports.encode = req => {
	if (Object.keys(req.body).length != 0) {
		if (req.headers.origin == swagger_origin) {
			req.body.data = CryptoJS.AES.encrypt(JSON.stringify(req.body), encrypt_key).toString()
			return req
		}
		return req
	}
	return req
};



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


exports.verify_token = (req, res, next) => {
	let platform =  req.method == "GET" ? req.query.platform : req.body.platform
	if (!req.headers.authorization) {
		// return res.status(400).send({
		// 	status: 400,
		// 	message: "No token provided!",
		// 	data: {}
		// });
		req.token_result = [];
		next();
	}else {
		console.log(req.method)
		let token = req.headers["authorization"].split(' ')[1];
		jwt.verify(token, jwt_key, (err, decoded) => {
			if (err) {
				return response(res, 401, message.INVALID_TOKEN, {}, null,platform)
			}
			else {
				let token_key = decoded["token_key"].split("|");
				//let user_id = token_key[token_key.length - 1];
				let token = token_key[0];
				console.log("token==" + token);
				sql_conn.query(`Select user_id,usertype 
				FROM user_login as UL
				LEFT JOIN user_details as UD ON UL.user_id = UD.id 
				WHERE UL.is_active = 1 AND UD.is_deleted != 1 AND UL.token = ? `, [token], (err, result) => {
					if (!err) {
						if (result.length) {
							req.token_result = result[0];
							next();
						} else {
							log.critical(" verifyToken :appToken", " Error: " + err);
							return response(res, 401, message.INVALID_TOKEN, {}, null,platform)
						}
					} else {
						log.critical(" verifyToken :verifyToken", " Error: " + err);
						return response(res, 401, message.INVALID_TOKEN, {}, null,platform)
					}
				});
			}
		})
	}
}

const config = require('../config/config_detail');
var compare = require('tsscmp');
const jwt = require('jsonwebtoken');
const sql_conn = require('../config/sql_db');
const { response } = require('../utils/utility');
const message = require('../utils/message');

// Basic function to validate credentials for example
function check(name, pass) {
	var valid = true;
	// Simple method to prevent short-circut and use timing-safe compare
	valid = compare(name, config.basic_username) && valid;
	valid = compare(pass, config.basic_password) && valid;

	return valid
}

let verify_token = (req, res, next) => {
	console.log("ddddd",req.headers)
	if (!req.headers.authorization) {
		return res.status(400).send({
			status: 400,
			message: "No token provided!",
			data: {}
		});
		// req.token_result = [];
		// next();
	} else {
		let token = req.headers["authorization"].split(' ')[1];
		jwt.verify(token, config.jwt_key, (err, decoded) => {
			if (err) {
				return response(res, 401, message.INVALID_TOKEN, {}, null, null)
			}
			else {
				let token_key = decoded["token_key"].split("|");
				//let user_id = token_key[token_key.length - 1];
				let token = token_key[0];
				console.log("token==" + token);
				sql_conn.query(`Select user_id,UD.usertype 
				FROM user_login as UL
				LEFT JOIN user_details as UD ON UL.user_id = UD.id 
				WHERE UL.is_active = 1 AND UD.is_deleted != 1 AND UL.token = ? `, [token], (err, result) => {
					if (!err) {
						if (result.length) {
							req.token_result = result[0];
							next();
						} else {
							console.log(" verifyToken :Token", " Error: " + err);
							return response(res, 401, message.INVALID_TOKEN, {}, null, null)
						}
					} else {
						console.log(" verifyToken :verifyToken", " Error: " + err);
						return response(res, 401, message.INVALID_TOKEN, {}, null, null)
					}
				});
			}
		})
	}
}


let verify_no_token = (req, res, next) => {
	if (!req.headers.authorization) {
		next();
	} else {
		verify_token(req, res, next);
	}
}
const authJwt = {
	check: check,
	verify_token: verify_token,
	verify_no_token :verify_no_token 
};

module.exports = authJwt;

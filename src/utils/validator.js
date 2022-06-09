const { validationResult } = require('express-validator');
const { response } = require('./utility');
const { FIELDS_REQUIRED } = require('./message');

function validate(req, res, next) {
	const error = validationResult(req);
	console.log("validate===>"+error);
	if (!error.isEmpty()) {
		let errArr = [];
		for(let i=0; i<((error.errors).length); i++) {			
			if (!errArr.contains((error.errors)[i].param)) {
				errArr.push((error.errors)[i].param);
			}
		}
		let rspns = {
			status: 400,
			message: FIELDS_REQUIRED,
			data: errArr,
		}
		res.json(rspns);
		// res.status(401).json(error);
	}else { next(); }
}
const getEmailMobileMap = emailOrMobile => {
	let email = null;
	let mobile = null;
	if (emailOrMobile && emailOrMobile.includes('@')) {
		email = emailOrMobile
	} else {
		mobile = emailOrMobile
	}
	return { email: email, mobile: mobile }
}
//[START validatePhoneNo]
const validatePhoneNo = mobileNo => { 
	if (typeof mobileNo == "String") {
		var regex = /^\+(?:[0-9] ?){6,14}[0-9]$/;

		if (regex.test(mobileNo)) {
			return true;
			// Valid international phone number
		} else {
			return false;
			// Invalid international phone number
		}
	}
};//[START validatePhoneNo]

//[START validateEmail]
const validateEmail = emailId => {
	if (typeof emailId == "String") {
		var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if (regex.test(emailId)) {
			return true;
			// Valid email id
		} else {
			return false;
			// Invalid email id
		}
	}
};//[START validateEmail]



module.exports = validate;


const user_dao = require('../dao/user_dao').user_lib;
const { response } = require('../utils/utility');
const message = require('../utils/message');
const config = require('../config/config_detail');
const sql_con = require('../config/sql_db.js');
const authJwt = require("../middleware/auth.js");
const log = require('../middleware/log')
const asyncLoop = require('node-async-loop');
const md5 = require('md5');
const { jwtVerify } = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const randomstring = require('randomstring');

/**
 * @typedef Login
 * @property {string} email.data.required - enter the email
 * @property {string} password.data.required - enter the password
 */

/**
 * This function will return user details after login
 * @route POST /user/login
 * @group Auth
 * @param {Login.model} Login.body.required - the new point
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

/**
 * @typedef Response
 * @property {integer} status
 * @property {string} message.required - response message
 * @property {data} response data payload
 */



exports.login = async (req, res) => {
    try {
        let data = req.body;
        if (data.email && data.password) {
            data.password = md5(data.password);
            let userDetails = await user_dao.checkExistingUser(sql_con, data.email)
            if (userDetails.length) {
                let random_string = randomstring.generate(14);
                let token_key = random_string + "|" + userDetails[0].usertype + "|" + userDetails[0].user_id;
                let jwt_tokens = await jwt.sign({ token_key }, config.jwt_key);
                await user_dao.updateToken(sql_con, user_id, random_string, usertype);
                return response(res, 200, message.LOGGED_IN, userDetails, jwt_tokens, null)
            } else {
                return response(res, 400, message.INVALID_USER_PASSWORD, {}, null, null)
            }
        } else {
            return response(res, 400, message.EMAIL_REQUIRED, {}, null, null)
        }
    } catch (err) {
        log.critical("Login: Database Error", "Error: " + err);
        return response(res, 500, message.DB_ERROR, {}, null, null)
    }
}

/**
 * @typedef user_details
 * @property {string} user_name.data.required - enter the user name
 * @property {string} email.data.required - enter the email
 * @property {string} mobile.data.required - enter the mobile number
 * @property {string} dob.data.required - enter the dob
 * @property {string} usertype.data.required - enter the usertype 
 * @property {string} profile_url.data.required - enter the profile_url
 * @property {string} password.data.required - enter the password
 */

/**
 * This function is used to add user in the database
 * @route Post /user/addUser
 * @group User Crud
 * @security JWT
 * @param {user_details.model} user_details.body.required - the new point
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

/**
 * @typedef Response
 * @property {integer} status
 * @property {string} message.required - response message
 * @property {data} response data payload
 */
exports.addUser = async (req, res) => {
    try {
        let data = req.body;
        data.password = md5(data.password);
        let tokenData = req.token_result
        if (tokenData.length != 0) {
            let checkExistingUser = await user_dao.checkExistingUser(sql_con, data.email) //CHeck user exist or not 
            if (!checkExistingUser.length) {
                let insertUserData = await user_dao.insertUserData(sql_con, data, tokenData)
                if (insertUserData.insertId) {
                    return response(res, 200, message.DATA_INSERTED, insertUserData.insertId, null); //return insert id
                } else {
                    return response(res, 401, message.INSERT_DATA_ERROR, null, null);
                }
            } else {
                return response(res, 401, message.INSERT_DATA_ERROR, null, null);
            }
         }
    } catch (e) {
        console.log("error===>>>" + e);
        return response(res, 500, message.DB_ERROR, [], null);
    }
};

/**
* This function is used to view the users 
* @route GET /user/viewUser
* @param {integer} user_id.query - user id of the user
* @security JWT
* @group User Crud
* @returns {object} 200 - and a message
* @returns {Error}  default - Unexpected error
*/

exports.viewUser = async (req, res) => {
    try {
        let data = req.query;
        let responseResult = {}
        let tokenData = req.token_result
        if (tokenData.length != 0) {
            //add check for user too 
            let viewUser = await user_dao.viewUser(sql_con, data.user_id)
            if (viewUser.length) {
                responseResult = viewUser[0]
                return response(res, 200, message.USER_DETAILS, responseResult, null);
            } else {
                return response(res, 401, message.NO_USER, responseResult, null);
            }
        } else {
            responseResult.user_name = viewUser[0].user_name
            responseResult.profile_url = viewUser[0].profile_url
            return response(res, 200, message.USER_DETAILS, responseResult, null);
        }
    } catch (e) {
        console.log("error===>>>" + e);
        return response(res, 500, message.DB_ERROR, e, null);
    }
};


/**
* This function is used to list the users 
* @route GET /user/listUser
* @security JWT
* @group User Crud
* @returns {object} 200 - and a message
* @returns {Error}  default - Unexpected error
*/

exports.listUser = async (req, res) => {
    try {
        let data = req.query;
        let tokenData = req.token_result
        if (tokenData.length != 0) {
            let listUser = await user_dao.listUser(sql_con, tokenData.user_id)
            if (listUser.length) {
                return response(res, 200, message.USER_LIST, listUser, null);
            } else {
                return response(res, 200, message.NO_USER, listUser, null);
            }
        } else {
            let noTokenlistUser = await user_dao.noTokenlistUser(sql_con)
            if (listUser.length) {
                return response(res, 200, message.USER_LIST, noTokenlistUser, null);
            } else {
                return response(res, 200, message.NO_USER, noTokenlistUser, null);
            }
        }
    } catch (e) {
        console.log("error===>>>" + e);
        return response(res, 500, message.DB_ERROR, e, null);
    }
};

//service > user folder > addUser 
//service > admin folder > 

/**
 * @typedef update_details
 * @property {string} user_name - enter the user name
 * @property {string} email - enter the email
 * @property {string} mobile - enter the mobile number
 * @property {string} dob - enter the dob
 * @property {string} usertype - enter the usertype
 * @property {string} profile_url - enter the profile_url
 * @property {integer} user_id - enter the user_id
 */

/**
 * This function is used to add user in the database
 * @route Put /user/updateUser
 * @group User Crud
 * @security JWT
 * @param {update_details.model} update_details.body.required - the new point
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

/**
 * @typedef Response
 * @property {integer} status
 * @property {string} message.required - response message
 * @property {data} response data payload
 */
exports.updateUser = async (req, res) => { 
    try {
        let data = req.body;
        let tokenData = req.token_result
        if (tokenData.length != 0) {
            let checkUser = await user_dao.checkUser(sql_con, data.user_id, tokenData.user_id) //Check valid user
            if (tokenData.user_id == data.user_id || checkUser[0].created_by == data.user_id) { // Add conditons to functions
                if (checkUser.length) {
                    let updateData = '';
                    //Loop to update the data which have values
                    asyncLoop(data, (item, next) => {
                        if (item.key == "user_id") {
                            next();
                        } else {
                            if (updateData != '') {
                                updateData += ",";
                            }

                            updateData += " `" + item.key + "`='" + item.value + "'";
                            next();
                        }
                    }, async (err) => {
                        if (err) {
                            console.log("error===>>>" + e);
                            return response(res, 500, message.UPDATE_ERROR, [], null);
                        } else {
                            //Update function
                            let updateUserData = await user_dao.updateUserData(sql_con, data.user_id, updateData)
                            return response(res, 200, message.DATA_UPDATED, {}, null);
                        }
                    })
                } else {
                    return response(res, 403, message.NO_USER, {}, null);
                }
            } else {
                return response(res, 403, message.PERMISSION_DENIED, {}, null);
            }
        }else {
            return response(res, 403, message.NO_TOKEN_PROVIDED, {}, null);
        }
    } catch (e) {
        console.log("error===>>>" + e);
        return response(res, 500, message.DB_ERROR, [], null);
    }
};

/**
 * @typedef delete_user
 * @property {integer} user_id - enter the user_id
 */

/**
 * This function is used to add user in the database
 * @route Delete /user/deleteUser
 * @group User Crud
 * @security JWT
 * @param {delete_user.model} delete_user.body.required - the new point
 * @returns {Response} 200 - response object containing data, message and status code
 * @returns {Error}  default - Unexpected error
 */

/**
 * @typedef Response
 * @property {integer} status
 * @property {string} message.required - response message
 * @property {data} response data payload
 */
exports.deleteUser = async (req, res) => {
    try {
        let data = req.body;
        let tokenData = req.token_result
        if (tokenData.length != 0) {
            let checkUser = await user_dao.checkUser(sql_con, data.user_id, tokenData.user_id) //Check valid user 
            if (tokenData.user_id == data.user_id || checkUser[0].created_by == data.user_id) {
                if (checkUser.length) {
                    let deleteUserData = await user_dao.deleteUserData(sql_con, data.user_id)
                    return response(res, 200, message.USER_DELETED, {}, null);
                } else {
                    return response(res, 403, message.NO_USER, {}, null);
                }
            } else {
                return response(res, 403, message.PERMISSION_DENIED, {}, null);
            }
        } else {
            return response(res, 403, message.NO_TOKEN_PROVIDED, {}, null);
        }
    } catch (e) {
        console.log("error===>>>" + e);
        return response(res, 500, message.DB_ERROR, [], null);
    }
};

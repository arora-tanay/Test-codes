
const CryptoJS = require('crypto-js');
const user_dao = require('../dao/user_dao').user_lib;
const { response } = require('../utils/utility');
const message = require('../utils/message');
const config = require('../config/config_detail');
const sql_con = require('../config/sql_db.js');
const authJwt = require("../middleware/auth.js");
const log = require('../middleware/log')

/**
 * @typedef user_details
 * @property {string} user_name.data.required - enter the user name
 * @property {string} email.data.required - enter the email
 * @property {string} mobile.data.required - enter the mobile number
 * @property {string} dob.data.required - enter the dob
 */

/**
 * This function is used to add user in the database
 * @route Post /user/addUser
 * @group User Crud
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
        let checkExistingUser = await user_dao.checkExistingUser(sql_con, data)
        if(!checkExistingUser.length){
        let insertUserData = await user_dao.insertUserData(sql_con, data)
       if(insertUserData.insertId){
        return response(res, 200, message.DATA_INSERTED, insertUserData.insertId, null);
       }else {
        return response(res, 401, message.INSERT_DATA_ERROR, null, null);
       }
    }else {
        return response(res, 401, message.INSERT_DATA_ERROR, null, null);
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
* @group User Crud
* @returns {object} 200 - and a message
* @returns {Error}  default - Unexpected error
*/

exports.viewUser = async (req, res) => {
    try {
        let data = req.query;
        let viewUser = await user_dao.viewUser(sql_con,data.user_id)
        if (viewUser.length) {
            return response(res, 200, message.USER_DETAILS, viewUser, null);
        } else {
            return response(res, 401, message.NO_USER, viewUser, null);
        }
    } catch (e) {
        console.log("error===>>>" + e);
        return response(res, 500, message.DB_ERROR, e, null);
    }
};


/**
* This function is used to list the users 
* @route GET /user/listUser
* @group User Crud
* @returns {object} 200 - and a message
* @returns {Error}  default - Unexpected error
*/

exports.listUser = async (req, res) => {
    try {
        let data = req.query;
        let listUser = await user_dao.listUser(sql_con)
        if (listUser.length) {
            return response(res, 200, message.USER_DETAILS, listUser, null);
        } else {
            return response(res, 200, message.NO_USER, listUser, null);
        }
    } catch (e) {
        console.log("error===>>>" + e);
        return response(res, 500, message.DB_ERROR, e, null);
    }
};
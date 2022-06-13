const asyncLoop = require('node-async-loop');
const { response } = require('../utils/utility');
const sql_con = require('../config/sql_db.js');
const user_dao = require('../dao/user_dao').user_lib;

let addressFunction = {
    addUserAddressFunction: (data, tokenData) => {
        let insert_key = `(user_id,address,city,state,created_by)`
        let insert_value = ''
        asyncLoop(data.user_address, (item, next) => {
            if (insert_value != '') {
                insert_value += ','
            }
            insert_value += '( ' + data.user_id + ',"' + item.address + '",' + item.city + ',' + item.state + ',' + tokenData.user_id + ')'
            next()
        }, async (err) => {
            if (err) {
                return { "status": 401, "data": err }
            }
            user_dao.insertUserAddress(sql_con, insert_key, insert_value).then(insertUserAddress => {
                return { "status": 200, "data": null }
            }).catch(err => {
                return { "status": 403, "data": err }
            })
            // return response(res, 200, message.ADDRESS_UPDATED, {}, null); //return insert id

        })
    },


}
module.exports = { addressFunction }
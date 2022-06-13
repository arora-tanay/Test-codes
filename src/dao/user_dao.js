
const user_lib = {
    checkExistingUser: async (sql_con, email) => {
        return new Promise(function (resolve, reject) {
            let sql_query = `Select * from user_details where is_deleted != 1  `
            sql_query = email != "" ? sql_query + ` and email = "${email}" ` : sql_query
            console.log(sql_query)
            sql_con.query(sql_query, [], (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(err)
                }
            })
        })
    },
    updateToken: async (sql_con, user_id, random_string, usertype) => {
        return new Promise(function (resolve, reject) {
            sql_con.query(`INSERT INTO user_login (user_id,token,usertype) VALUES (?,?,?)`, [user_id, random_string, usertype], (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(err)
                }
            })
        })
    },
    insertUserData: async (sql_con, data, tokenData) => {
        return new Promise(function (resolve, reject) {
            sql_con.query('Insert into user_details (user_name,email,mobile,dob,usertype,profile_url,password,created_by) VALUES (?,?,?,?,?,?,?,?)',
                [data.user_name, data.email, data.mobile, data.dob, data.usertype, data.profile_url, data.password, tokenData.user_id], (err, result) => {
                    if (!err) {
                        resolve(result)
                    } else {
                        reject(err)
                    }
                })
        })
    },

    viewUser: async (sql_con, user_id) => {
        return new Promise(function (resolve, reject) {
            sql_con.query(`Select * from user_details where is_deleted != 1 and id = ?  `, [user_id], (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(err)
                }
            })
        })
    },

    listUser: async (sql_con, user_id, data) => {
        return new Promise(function (resolve, reject) {
            let sql_query = `Select user_name, usertype, UA.city, email, mobile,UD.id as user_id from user_details UD 
            left join user_address UA on UA.user_id = UD.id 
            where UD.is_deleted !=1 and UD.created_by =  1  `
            if (data.city != '')
                sql_query = data.city != '' ? sql_query + ' and UA.city = ' + data.city : sql_query
            sql_query = data.state != '' ? sql_query + ' and UA.state = ' + data.state : sql_query
            sql_con.query(sql_query, [user_id], (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(err)
                }
            })
        })
    },

    noTokenlistUser: async (sql_con, data) => {
        return new Promise(function (resolve, reject) {
            sql_con.query(`Select id as user_id,profile_url from user_details where is_deleted != 1  `, (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(err)
                }
            })
        })
    },

    checkUser: async (sql_con, user_id, token_user_id) => {
        return new Promise(function (resolve, reject) {
            sql_con.query(`Select * from user_details where is_deleted != 1 and id = ? and created_by = ?  `, [user_id, token_user_id], (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(err)
                }
            })
        })
    },
    updateUserData: async (sql_con, user_id, updateData) => {
        return new Promise(function (resolve, reject) {
            console.log(`UPDATE user_details SET ${updateData} WHERE id = ${user_id} `)
            sql_con.query(`UPDATE user_details SET ${updateData} WHERE id = ${user_id} `, [], (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(err)
                }
            })
        })
    },
    deleteUserData: async (sql_con, user_id) => {
        return new Promise(function (resolve, reject) {
            //Soft delete
            sql_con.query(`UPDATE user_details SET is_deleted = 1 WHERE id = ${user_id} `, [], (err, result) => {
                if (!err) {
                    sql_con.query(`UPDATE user_address SET is_deleted = 1 WHERE user_id = ${user_id} `, [], (err, result) => {
                        if (!err) {
                            resolve(result)
                        } else {
                            reject(err)
                        }
                    })
                } else {
                    reject(err)
                }
            })
        })
    },
   
    insertUserAddress: async (sql_con, insert_key, insert_value) => {
        return new Promise(function (resolve, reject) {
            //Soft delete
            sql_con.query(`Insert into user_address ${insert_key} VALUES ${insert_value} `, [], (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(err)
                }
            })
        })
    },

    listUserAddress: async (sql_con, user_id) => {
        return new Promise(function (resolve, reject) {
            sql_con.query(`Select address ,C.name as city_name ,state_title from user_address UA 
            left join city C on UA.city = C.id 
            left join state S on S.id = UA.state 
            where UA.user_id = ? and UA.is_deleted !=1   `, [user_id], (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(err)
                }
            })
        })
    },

    checkUserAddress: async (sql_con, user_id) => {
        return new Promise(function (resolve, reject) {
            sql_con.query(`Select address ,C.name as city_name ,state_title from user_address UA 
            left join city C on UA.city = C.id 
            left join state S on S.id = UA.state 
            where UA.id = ? and UA.is_deleted !=1   `, [user_id], (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(err)
                }
            })
        })
    },
    deleteUserAddress: async (sql_con, user_address_id) => {
        return new Promise(function (resolve, reject) {
            //Soft delete
            sql_con.query(`UPDATE user_address SET is_deleted = 1 WHERE id = ${user_address_id} `, [], (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(err)
                }
            })
        })
    },
    updateUserAddress: async (sql_con, data) => {
        return new Promise(function (resolve, reject) {
            //Soft delete
            sql_con.query(`UPDATE user_address SET address = ?, city = ?  , state = ?  WHERE id = ${data.user_address_id} `, [data.address, data.city, data.state], (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(err)
                }
            })
        })
    },
    deleteUserAllAddress: async (sql_con, user_id) => {
        return new Promise(function (resolve, reject) {
            sql_con.query(`UPDATE user_address SET is_deleted = 1 WHERE user_id = ${user_id} `, [], (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(err)
                }
            })
        })
    },
}

module.exports = { user_lib }
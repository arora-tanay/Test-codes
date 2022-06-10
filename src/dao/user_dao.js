
const user_lib = {
    checkExistingUser: async (sql_con, email) => {
        return new Promise(function (resolve, reject) {
            let sql_query = `Select * from user_details where is_deleted != 1  `
            sql_query = email != "" ? sql_query + ` and email = "${email}" `: sql_query
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
            sql_con.query(`INSERT INTO user_login (user_id,token,usertype) VALUES (?,?,?)` , [user_id, random_string, usertype], (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(err)
                }
            })
        })
    },
    insertUserData: async (sql_con, data,tokenData) => {
        return new Promise(function (resolve, reject) {
            sql_con.query('Insert into user_details (user_name,email,mobile,dob,usertype,profile_url,password,created_by) VALUES (?,?,?,?,?,?,?,?)' ,
            [data.user_name, data.email,data.mobile,data.dob,data.usertype,data.profile_url,data.password,tokenData.user_id], (err, result) => {
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

    listUser: async (sql_con,user_id) => {
        return new Promise(function (resolve, reject) {
            sql_con.query(`Select * from user_details where is_deleted != 1 and created_by = ?  `,[user_id], (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(err)
                }
            })
        })
    },

    noTokenlistUser: async (sql_con) => {
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

    checkUser: async (sql_con, user_id,token_user_id) => {
        return new Promise(function (resolve, reject) {
            sql_con.query(`Select * from user_details where is_deleted != 1 and id = ? and created_by = ?  `, [user_id,token_user_id], (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(err)
                }
            })
        })
    },
    updateUserData: async (sql_con, user_id,updateData) => {
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
                    resolve(result)
                } else {
                    reject(err)
                }
            })
        })
    },
}

module.exports = { user_lib }

const user_lib = {
    checkExistingUser: async (sql_con, email) => {
        return new Promise(function (resolve, reject) {
            let sql_query = `Select * from user_details where is_deleted != 1  `
            sql_query = email != "" ? sql_query + ` and email = ${email} `: sql_query
            sql_con.query(sql_query, [], (err, result) => {
                if (!err) {
                    resolve(result)
                } else {
                    reject(err)
                }
            })
        })
    },
    insertUserData: async (sql_con, data) => {
        return new Promise(function (resolve, reject) {
            sql_con.query('Insert into user_details (user_name,email,mobile,dob) VALUES (?,?,?,?)' ,
            [data.user_name, data.email,data.mobile,data.dob], (err, result) => {
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
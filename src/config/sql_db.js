let config = require('./config_detail')
let mysql = require('mysql');
var sql_conn = mysql.createPool({
   connectionLimit: 10, //important
   host: config.db_host,
   user: config.db_user_name,
   password: config.db_password,
   database: config.db_name,
   multipleStatements: true
});



module.exports = sql_conn;


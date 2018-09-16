var mysql = require('mysql');
var connection = mysql.createConnection({
//    host     : process.env.RDS_HOSTNAME,
//    user     : process.env.RDS_USERNAME,
//    password : process.env.RDS_PASSWORD,
//    port     : process.env.RDS_PORT,
//    database : process.env.RDS_DB_NAME
host : '10.177.12.131',
user : '',
password : '',
port : 3306,
database : 'hospital'
//host : 'aa19eyo0nwryyy8.cydsnfwibuzl.us-east-1.rds.amazonaws.com',
//user : 'root',
//password : '*1-meetyouinhell*',
//port : 3306,
//database : 'ebdb'
});

connection.connect(function(err){
if(err) throw err;
else
{
    console.log("DB connected");
}
});

module.exports = connection;
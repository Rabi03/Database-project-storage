const mysql=require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Csesust88',
    database: 'codebase',
    multipleStatements:true
  });



module.exports = db;
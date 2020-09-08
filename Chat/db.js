const mysql = require('mysql');

// connect to database
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database : "Chatroom"
});

console.log("connected to the database");

module.exports = con;

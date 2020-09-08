const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', function(req, res) {
    res.render('login');
});

router.post('/', function(req, res) {
    const password = req.body.password;
    const name = req.body.username;
    var sql = "SELECT * FROM accounts WHERE username = ? AND password = ?";
    db.query(sql, [name, password], function(err, results) {
        if (err) {
            console.log('seach account error' + err.stack);
            res.redirect('/');
        }
        if (results.length == 1) {
            req.session.user = name;
            res.redirect('/chatroom');
        } else {
            console.log('credential not match');
            res.redirect('/');
        }
    });

    
});

router.get('/register', function(req, res) {
    res.render('register');
});

router.post('/register', function(req, res) {
    const password = req.body.password;
    const name = req.body.username;
    var user = [[name, password]];
    var check = "SELECT * FROM accounts WHERE username = ?";
    // check if the user name exist in the db
    db.query(check, [name], function (err, results) {
        if (err) {
            console.error("check query error: " + err.stack);
        }
        // if existing username
        if (results.length > 0) {
            console.log("username existed");
            res.redirect('/register');
        }
        // else insert the new user into db
        else {
            var sql = "INSERT INTO accounts VALUES ?";
            db.query(sql, [user], function (err, results) {
                if (err) {
                    console.error("error inserting new user" + err.stack);
                    res.redirect('/register');
                }
                
                if (results.affectedRows == 1) {
                    console.log(results.affectedRows + " new user inserted");
                    res.redirect('/');
                }
            });
        }
    });
});

router.get('/chatroom', function(req, res) {
    if (!req.session.user) {
        res.redirect('/');
        return;
    }
    res.render('chat', {user : req.session.user});
});

router.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
});


module.exports = router;
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const db = require('./db');

const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const session = expressSession({
    secret: 'ask3aASD83',
    resave: false, 
    cookie : {maxAge : 3000},
    saveUninitialized: false
});


// template engine ejs
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false }));  // request object can be a string or array
app.use(cookieParser());
app.use(session);

io.use(function(socket, next) {
    session(socket.request, socket.request.res || {}, next);
});

var router = require('./routes/index');
app.use('/', router);

io.sockets.on('connection', function(socket) {
    var chat_history = "SELECT * FROM history";
    db.query(chat_history, function(err, results) {
        if (err) {
            console.log("error querying chat history");
        }
        socket.emit('history', results);
    });
    
    socket.on('newmsg', function(data) {
        var user = socket.request.session.user;
        io.emit('newmsg', "<div class = 'd-flex justify-content-between'><h5>" + user + "</h5><small>" + data.date + "</small></div><p>" + data.msg + "</p>");
        var sql = "INSERT INTO history VALUES ?";
        var val = [[user, data.msg, data.date]];
        db.query(sql, [val], function(err, results) {
            if (err) {
                console.error("error inserting new message" + err.stack);
            }
        });
    });
});

server.listen(8080, function() {
    console.log('listening on 8080');
});
// socket.io
// const io = require('socket.io')(server);




module.exports = app;


'use strict';
const express = require('express'),
    app = express(),
    jwt = require('jsonwebtoken'),
    config = require('./config/config.js'),
    body_parser = require('body-parser'),
    cors = require('cors'),
    login_controller = require('./controller/login_controller.js'),
    morgan = require('morgan'),
    express_validator = require('express-validator')
    db = require('./config/db_connection.js');

app.use(body_parser());
app.use(cors());
app.use(morgan('dev'));
app.use(express_validator());
app.use(express.static('../dist'));
app.get('/get', (req, res)=>{
    res.json('hello i am calling');
})
app.use('/login', login_controller);




app.use('/app',(req, res, next)=>{
    req.checkBody('user', 'user is required').notEmpty();
    req.checkBody('token', 'token is required').notEmpty();

    req.asyncValidationErrors().then(()=>{
        var decode = jwt.decode(req.body.token, 'secret');
        if(decode.user === req.body.user){
            next();
        } else {
            res.json({succes: false, msg: 'token not valid'});
        }
    }).catch((err)=>{
        res.json({succes: false, msg: err});
    })
    
})
app.listen(config.port);
console.log(`server running on port number ${config.port}`);    
   
app.get('/*', function(req, res){
    // res.sendFile(__dirname+'../'+'/angular/PROJECT-NAME/dist/index.html');
    res.sendFile('index.html', { root: '../dist/'});
});



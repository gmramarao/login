'use strict';
const express = require('express'),
    app = express(),
    jwt = require('jsonwebtoken'),
    config = require('./config/config.js'),
    body_parser = require('body-parser'),
    cors = require('cors'),
    login_controller = require('./controller/login_controller.js'),
    morgan = require('morgan'),
    express_validator = require('express-validator'),
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    passportGoogle = require('passport-google-oauth'),
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

// passport.use(new LocalStrategy({
//     usernameField: 'ramarao.g92@gmail.com',
//     passwordField: '8500759698'
//   },
//   function(username, password, done) {
//     console.log(username);
//   }
// ));


passport.use('local',new LocalStrategy(
    function(username, password, done) {
        console.log('i am calling');
    //   User.findOne({ username: username }, function(err, user) {
    //     if (err) { return done(err); }
    //     if (!user) {
    //       return done(null, false, { message: 'Incorrect username.' });
    //     }
    //     if (!user.validPassword(password)) {
    //       return done(null, false, { message: 'Incorrect password.' });
    //     }
    //     return done(null, user);
    //   });
    }
));


// const passportConfig = {
//     clientID: '598902743876-go1guulac1hqa7tea5dqor44bt6fre1d.apps.googleusercontent.com',
//     clientSecret: 'E-0jCmg6JtsUonUJ9FfLcZBj',
//     callbackURL: '/home'
//   };

//   if (passportConfig.clientID) {
//     passport.use(new passportGoogle.OAuth2Strategy(passportConfig, function (request, accessToken, refreshToken, profile, done) {
//         console.log('-----------------------------------------------------------------------------------------------------------');
//         console.log(profile);
//         console.log('-----------------------------------------------------------------------------------------------------------');
//       // // See if this user already exists
//       // let user = users.getUserByExternalId('google', profile.id);
//       // if (!user) {
//       //   // They don't, so register them
//       //   user = users.createUser(profile.displayName, 'google', profile.id);
//       // }
//       // return done(null, user);
//     }));
//   }

passport.use(new passportGoogle.OAuth2Strategy({
    clientID: '598902743876-go1guulac1hqa7tea5dqor44bt6fre1d.apps.googleusercontent.com',
    clientSecret: 'E-0jCmg6JtsUonUJ9FfLcZBj',
    callbackURL: '/home',
    accessType: 'offline'
  }, (accessToken, refreshToken, profile, cb) => {
    // Extract the minimal profile information we need from the profile object
    // provided by Google
    console.log(accessToken);
    cb(null, extractProfile(profile));
}));
  
passport.serializeUser((user, cb) => {
cb(null, user);
});
passport.deserializeUser((obj, cb) => {
cb(null, obj);
});
app.get('/api/authentication/google/start',
passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));
app.get('/api/authentication/google/redirect',
passport.authenticate('google', { session: false }),
generateUserToken);

function generateUserToken(req, res) {
    console.log('i am calling');
    const accessToken = token.generateAccessToken(req.user.id);
    res.render('authenticate.html/', {
    token: accessToken
    });
}

// app.get('/login', passport.authenticate('local', { successRedirect: '/',
// failureRedirect: 'http://localhost:9999/login' }));


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
    console.log('hellll');
    // if(req.body.token && req.body.user){
        
    // } else {
    //     res.json({succes: false, msg: 'Please enter valid token and user'});
    // }
    
})
app.listen(config.port);
console.log(`server running on port number ${config.port}`);    
   
app.get('/*', function(req, res){
    // res.sendFile(__dirname+'../'+'/angular/PROJECT-NAME/dist/index.html');
    res.sendFile('index.html', { root: '../dist/'});
});



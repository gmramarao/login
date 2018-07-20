'use strict';
const  jwt = require('jsonwebtoken'),
    express = require('express'),
    bcrypt = require('bcrypt'),
    async = require('async'),
    db = require('../config/db_connection.js'),
    salt_round = 10,
    Router = express.Router();
    
    
Router.post('/signup', (req, res)=>{
    req.checkBody('user', 'user is required').notEmpty();
    req.checkBody('pwd', 'password is required').notEmpty();
    req.asyncValidationErrors().then(()=>{
        async.waterfall([
            (callback)=>{
                check_user(req.body.user).then((result)=>{
                    console.log(result);
                    if(result){
                        callback('user already existed', null);
                    } else {
                        callback(null, true);
                    }
                }).catch((err)=>{
                    callback(err, null);
                })
            },
            (user, callback)=>{
                bcrypt.genSalt(salt_round,callback);
            },
            (salt, callback)=>{
                bcrypt.hash(req.body.pwd, salt, callback);
            }, 
            (hash, callback)=>{
                var data = {
                    user: req.body.user,
                    secret: "",
                    password: hash
                }
                db.login_info.insert(data, callback);
            }
        ], (err, results)=>{
            if(!err) {
                res.json({success: true, msg:'succesfully created account'});
            } else {
                res.json({success: false, msg:err});
            }
        })
    }).catch((err)=>{
        res.json({success: false, msg: err});
    })

    
    // res.json('i am also calling');
});   


Router.post('/signin', (req, res)=>{
    req.checkBody('user', 'user is required').notEmpty();
    req.checkBody('pwd', 'password is required').notEmpty();
    req.asyncValidationErrors().then(()=>{
        var db_data = '';
        async.waterfall([
            (callback)=>{
                check_user(req.body.user).then((data)=>{
                    if(data){
                        db_data = data;
                        callback(null, data);
                    } else {
                        callback('User not Existed', null);
                    }
                })
            }, 
            (data, callback)=>{
                console.log(data);
               bcrypt.compare( req.body.pwd, data[0].password, callback);
            }, 
            (compare, callback)=>{
                console.log(compare);
                if(compare){
                    var data = {
                        user: db_data[0].user,
                        password: db_data[0].password
                    }
                    var token = jwt.sign(data, 'secret', { expiresIn: 60 * 60 });
                    callback(null, token);
                } else {
                    callback('password not matched', null);
                }
            }
        ], (err, results)=>{
            if(!err){
                res.json({success: true, token: results});
            } else {
                res.json({success: false, token: err});
            }
        })
    }).catch((err)=>{
        res.json({success: false, msg: err});
    })
    
})


Router.post('/otp_gen', (req, res)=>{
    var otp = Math.floor(1000 + Math.random() * 9000);
    req.checkBody('user', 'user is required').notEmpty();
    req.asyncValidationErrors().then(()=>{
        check_user(req.body.user).then((user)=>{
            if(user){
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                           user: 'ramarao.g92@gmail.com',
                           pass: '8500759698'
                       }
                });
                
                const mailOptions = {
                    from: 'ramarao.g92@gmail.com', // sender address
                    to: req.body.user, // list of receivers
                    subject: 'Access token', // Subject line
                    html: '<p>Your access token is:'+ otp +'</p>'// plain text body
                };
                transporter.sendMail(mailOptions, function (err, info) {
                    if(!err){
                        console.log(info);
                        db.login_info.update({user: req.body.user}, {$set:{OTP: otp}}, (err, doc)=>{
                            if(!err){
                                res.json({success: true, msg: otp});
                            } else {
                                res.json({success: false, msg: err});
                            }   
                        })
                    }
                    else{
                        console.log(err);
                        res.json({success: false, msg:err});
                    }
                });
                
            } else {
                res.json({success: false, msg: 'eMail not existed'});
            }
        })
    }).catch((err)=>{
        res.json({success: false, msg: err});
    })
})


Router.post('/otp_verify', (req, res)=>{
    req.checkBody('user', 'user is required').notEmpty();
    req.checkBody('otp', 'otp is required').notEmpty();
    req.asyncValidationErrors().then(()=>{
        check_user(req.body.user).then((user)=>{
            if(user){
                if(user[0].OTP == req.body.otp){
                    res.json({success: true, msg: 'OTP matched'});
                } else {
                    res.json({success: false, msg: 'OTP not matched'});
                }
            } else {
                res.json({success: false, msg: 'User not existed'});
            }
            
        }).catch((err)=>{
            res.json({success: false, msg: err});
        })

    }).catch((err)=>{
        res.json({success: false, msg: err});
    })    
})


Router.put('/forgot_pwd', (req, res)=>{
    req.checkBody('user', 'User is required').notEmpty();
    req.checkBody('pwd', 'Password is required').notEmpty();
    req.asyncValidationErrors().then(()=>{
        check_user(req.body.user).then((user)=>{
            if(user){
                async.waterfall([
                    (callback)=>{
                        bcrypt.genSalt(salt_round, callback);
                    }, 
                    (salt, callback)=>{
                        bcrypt.hash(req.body.pwd, salt, callback);
                    },
                    (hash, callback)=>{
                        db.login_info.update({user: req.body.user}, {$set:{password: hash}}, callback);
                    }
                ], (err, results)=>{
                    if(!err){
                        res.json({success: true, msg: results});
                    } else {
                        console.log(err);
                        res.json({success: false, msg: err});
                    }

                })
                
            } else {
                res.json({success: false, msg: 'User not existed'});
            }
            
        }).catch((err)=>{
            res.json({success: false, msg: err});
        })

    }).catch((err)=>{
        res.json({success: false, msg: err});
    })    
})




var check_user = (user)=>{
    return new Promise((resolve, reject)=>{
        db.login_info.find({user: user}, (err, data)=>{
            if(!err){
                if(data.length){
                    console.log(data);
                    resolve(data);
                } else {
                    resolve(null);
                }
                
            } else {
                reject(err);
            }
        })
    })
};

module.exports = Router;
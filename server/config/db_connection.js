'use strict';
const mongojs = require('mongojs');
const db = mongojs('user', ['login_info']);
module.exports = db;
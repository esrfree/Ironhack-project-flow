require('dotenv').config();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const favicon = require('serve-favicon');
const hbs = require('hbs');
const mongoose = require('mongoose');
const logger = require('morgan');
const path = require('path');
const passport = require('passport');
// Local user after authetication with Passport
const localUser = require('./configs/local-user-config');
// Set up the database
require('./configs/db-config');
const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);
const app = express();
// use session here
require('./configs/session-config')(app);
// Set up passport
require('./configs/passport-config')
// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(localUser);  //uses the req.user generated after authentication with Passport
// Express View engine setup
app.use(require('node-sass-middleware')({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
// hbs as view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
// default value for title local
app.locals.title = 'Flow, MERN stack social media platform';
// Routes middleware
app.use('/', require('./routes/index'));
app.use('/', require('./routes/user-routes'));
app.use('/', require('./routes/other-users-routes'));
app.use('/', require('./routes/auth-routes'));
app.use('/', require('./routes/post-routes'))
app.use('/', require('./routes/comments-routes'))
module.exports = app;
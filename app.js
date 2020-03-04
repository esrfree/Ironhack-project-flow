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
const helpers = require('handlebars-helpers')(['comparison', 'string']);
const moment = require('moment');




// Local user after authetication with Passport
const localUser = require('./configs/local-user-config');

// Set up the database
require('./configs/db-config');
const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);
const app = express();

//socket.io
const server = require('http').createServer(app);
const io = require('socket.io')(server);

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
hbs.registerHelper(helpers);
hbs.registerHelper('formatTime', (date, format) => {
  let mmnt = moment(date);
  return mmnt.format(format);

});
hbs.registerHelper('relativeTime', (date) => {
  let mmnt = moment(date);
  return mmnt.startOf('hour').fromNow();;

});



app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
// default value for title local
app.locals.title = 'Flow, MERN stack social media platform';

// Routes middleware - pages
app.use('/', require('./routes/index'));
app.use('/', require('./routes/profile'));
app.use('/', require('./routes/profile-edit'));
app.use('/', require('./routes/news'));
app.use('/', require('./routes/user-list'));

// Routes middleware - functionality
app.use('/', require('./routes/user-routes'));
app.use('/', require('./routes/other-users-routes'));
app.use('/', require('./routes/auth-routes'));
app.use('/', require('./routes/post-routes'));
app.use('/', require('./routes/comments-routes'));
app.use('/', require('./routes/reply-routes'));

module.exports = app;
'use strict';
// load modules
const express = require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const routes=require('./routes/routes');
const morgan = require('morgan');
const session= require('express-session');

// variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';
// create the Express app
const app = express();
// use sessions for tracking logins
app.use(session({
  secret:'treehouse',
  resave: true,
  saveUninitialized: false
}));
// Session and make ID available
app.use(function(req,res,next){
  res.locals.currentUser = req.session.userId;
  next();
});


// Connect mongoose to MongoDB and use ES6 Promise
mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost/fsjstd-restapi',{ useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Error! Could not connect to MongoDB...'));
// show message written to console when the connection is successful and fail
// mongoose.connection.on('connected', ()=>{console.log('Connection Success.')});
// mongoose.connection.on('error',()=>{console.log('Error! Something went wrong.')});
// mongoose.connection.on('disconnected',()=>{console.log('Cya!')});

// make sure the req.body is JSON format
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//set up static route and use express.static method to sever the static files located in the public folder
app.use('/static', express.static('public'))
// view engine setup
app.set('view engine', 'pug')

// setup morgan which gives us http request logging
app.use(morgan('dev'));

//Added api routes here
routes(app);

// setup a friendly greeting for the root route
// app.get('/', (req, res) => {
//   res.json({
//     message: 'Welcome to the REST API project!',
//   });
// });
app.get('/', function(req, res, next) {
  return res.render('index', { title: 'Welcome to the REST API project!' });
});

// send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// setup a global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});

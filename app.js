var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors');
var passportSetup = require('./setup-passport.js');
var passport = require('passport');
var index = require('./routes/index');
var userRouter = require('./routes/userRouter');
var testResultRouter = require('./routes/testResultRouter');
var db_crawler = require('./db_crawler');

db_crawler.deleteOldTestResults();
//configure passport
passportSetup(passport);

//Custom routers
var newsRouter = require('./routes/newsRouter');
var teachersRouter = require('./routes/teachersRouter');
var eventsRouter = require('./routes/eventsRouter');

//configurations and database
var config = require('./config');
var mongoose = require('mongoose');

//setup db connection
mongoose.connect(config.mongoUrl);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
    console.log("Connected correctly to database server");
});


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(logger('dev'));

//allow for larger files
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
app.use(bodyParser.json({limit: '50mb'}));

app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());

app.use('/', index);
app.use('/users', userRouter);
app.use('/news', newsRouter);
app.use('/teachers', teachersRouter);
app.use('/events', eventsRouter);
app.use('/test-results', testResultRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Test comment....

// Routes
var indexRouter = require('./routes/index');
var siteRoutes = require('./routes/siteRoutes');
var productRoutes = require('./routes/productRoutes');
var categoryRoutes = require('./routes/categoryRoutes');

var app = express();

// Set up mongoose connection.
let mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://brenton-andrews:db_pass02@cluster0.2u5felz.mongodb.net/Inventory?retryWrites=true&w=majority';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', indexRouter);
app.use('/home', siteRoutes);
app.use('/category', categoryRoutes);
app.use('/product', productRoutes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

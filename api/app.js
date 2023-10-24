const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require("body-parser");
const cors = require("cors");


// .env file
require('dotenv').config()

const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);

const indexRouter = require('./routes/index');
const studentRouter = require('./routes/student');
const adminRouter = require('./routes/admin');
const headStudentRouter = require('./routes/headStudent');
const professorRouter = require('./routes/professor');
const authRouter = require('./routes/auth')

const corsOptions = {
  // origin: process.env.REACT_APP_API_URL
  origin: '*'
};

app.use(cors(corsOptions));

app.use(logger('dev'));
app.use(cookieParser());
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')));


// Routes
app.use('/', indexRouter);
app.use('/student', studentRouter);
app.use('/admin', adminRouter);
app.use('/headStudent', headStudentRouter);
app.use('/professor', professorRouter);
app.use('/auth', authRouter)


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

});


module.exports = app;

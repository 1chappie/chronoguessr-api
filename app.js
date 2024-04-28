var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/indexRoutes');
var usersRouter = require('./routes/usersRoutes');
const dataRouter = require('./routes/dataRoutes');
const authRouter = require('./routes/authRoutes');
const cors = require("cors");
const {corsOptions} = require("./config/cors");

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions))

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/data', dataRouter);
app.use('/auth', authRouter);

module.exports = app;

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const errorHandler = require('./errorHandler');
const habitsRouter = require('./habits/habits-router');
const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/users-router');


const app = express();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());


app.use('/api/habits',habitsRouter)
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)



app.get('/', (req, res) => {
  res.send('Hello From HabitTracker Server');
});

app.use(errorHandler);

module.exports = app;
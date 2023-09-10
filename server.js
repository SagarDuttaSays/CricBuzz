const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

// Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);
app.use(cors());
app.options('*', cors())

// Server
app.listen(3000, () => {
  console.log('server is running http://localhost:3000');
});

// Routes
app.use(`/api/admin`, require('./routes/admin'));
app.use(`/api/matches`, require('./routes/match'))

// Export the 'app' object
module.exports = app;

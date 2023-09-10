const express = require('express');
const app = express();
const morgan = require('morgan');
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

// Middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);

// Server
app.listen(3000, () => {
  console.log('server is running http://localhost:3000');
});

// Routes
app.use(`/api/admin`, require('./routes/admin'));

// Export the 'app' object
module.exports = app;

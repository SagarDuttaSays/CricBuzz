const express = require('express');
const app = express();
const mysql = require('mysql2');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

//can be used for connecting with front end -- SCALABILITY
app.use(cors());
app.options('*', cors())

//middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use(errorHandler);

//Routes
const adminRoutes = require('./routes/admin');

const api = process.env.API_URL;

app.use(`${api}/admin`, adminRoutes)

//Database
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "duttasagar086",
    database: "elio"
  });
  
  con.connect(function (err) {
    if (err) throw err;
    console.log('Connected!');
  });
  
  module.exports = con;

//Server
app.listen(3000, ()=>{

    console.log('server is running http://localhost:3000');
})
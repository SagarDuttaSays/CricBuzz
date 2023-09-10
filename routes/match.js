const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mysql = require('mysql2');
const secret = "vitxworkindia"

// Create a new database connection
const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "duttasagar086",
    database: "cricbuzz"
  });
  
  con.connect(function (err) {
    if (err) throw err;
    console.log('Connected to the database!');
  });

  


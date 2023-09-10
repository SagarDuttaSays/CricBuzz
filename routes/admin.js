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

// Signup Route
router.post("/signup", (req, res) => {
  // Fetching data from req body
  const { username, password, email } = req.body;

  // Encrypting password
  const hashedPassword = bcrypt.hashSync(password, 10); // Hash the password

  // Set isAdmin to true
  const isAdmin = true;

  // SQL query to insert a new admin
  const insertQuery = `
    INSERT INTO Admin (username, password, email, isAdmin)
    VALUES (?, ?, ?, ?)`;

  con.query(insertQuery, [username, hashedPassword, email, isAdmin], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error creating admin account" });
    }

    console.log("Admin account created successfully.");
    
    // Query to fetch the id based on the username
    const selectIdQuery = "SELECT id FROM Admin WHERE username = ?";

    con.query(selectIdQuery, [username], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Error fetching admin ID" });
      }

      if (results.length > 0) {
        const adminId = results[0].id;
        return res.status(200).json({
          message: "Admin Account successfully created",
          status_code: 200,
          user_id: adminId,
        });
      } else {
        console.log(`No admin found with the username ${username}`);
        return res.status(404).json({ error: "Admin not found" });
      }
    });
  });
});

// Login Route
router.post("/login", (req, res) => {
  const { username, password } = req.body;

  // SQL query to retrieve admin data by username
  const selectQuery = `
    SELECT id, password, isAdmin
    FROM Admin
    WHERE username = ?`;

  con.query(selectQuery, [username], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: "Error fetching admin data" });
    }

    if (results.length === 0) {
      return res.status(401).json({
        status: "Incorrect username/password provided. Please retry",
        status_code: 401,
      });
    }

    const adminRecord = results[0];
    const adminId = adminRecord.id;
    const isAdmin = adminRecord.isAdmin;
    const adminPassword = adminRecord.password;

    if (bcrypt.compareSync(password, adminPassword)) {
      // Generate a JWT token
      const token = jwt.sign(
        {
          isAdmin: isAdmin,
        },
        secret, 
        { expiresIn: "1d" }
      );

      return res.status(200).json({
        status: "Login successful",
        status_code: 200,
        user_id: adminId,
        access_token: token,
      });
    } else {
      return res.status(401).json({
        status: "Incorrect username/password provided. Please retry",
        status_code: 401,
      });
    }
  });
});

module.exports = router;

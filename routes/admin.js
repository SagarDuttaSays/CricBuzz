const express = require("express");
const router = express.Router();
const con = require("../server");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/signup", (req, res) => {
  //fetching data from req body
  const { username, password, email } = req.body;
  //encrypting password
  password = bcrypt.hashSync(password, 10);
  const isAdmin = true;
  const insertQuery = `
  INSERT INTO Admin (username, password, email, isAdmin)
  VALUES (${username}, ${password}, ${email}, ${isAdmin})`;

  con.query(insertQuery, (err, result) => {
    if (err) throw err;
    console.log("Data inserted successfully.");
  });
  
  const usernameToFetch = username;

  // Query to fetch the id based on the username
  const selectIdQuery = "SELECT id FROM Admin WHERE username = ?";

  con.query(selectIdQuery, [usernameToFetch], (err, results) => {
    if (err) throw err;

    if (results.length > 0) {
      const adminId = results[0].id;
      res.json({
        message: "Admin Account successfully created",
        status: 200,
        user_id: adminId,
      });
    } else {
      console.log(`No admin found with the username ${usernameToFetch}`);
    }
  });
});

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const usernameToSearch = username;

  const selectQuery = `
  SELECT id, password, isAdmin
  FROM Admin
  WHERE username = ?
`;

  con.query(selectQuery, [usernameToSearch], (err, results) => {
    if (err) throw err;

    if (results.length === 0) {
      res.json({
        status: "Incorrect username/password provided. Please retry",
        status_code: 401,
      });
    } else {
      const adminRecord = results[0];
      const adminId = adminRecord.id;
      const isAdmin = adminData.isAdmin;
      const adminPassword = adminRecord.password;

      if (bcrypt.compareSync(password, adminPassword)) {
        const token = jwt.sign(
          {
            isAdmin: isAdmin,
          },
          secret,
          { expiresIn: "1d" }
        );
        res.json({
          status: "Login successful",
          status_code: 200,
          user_id: adminId,
          access_token: token,
        });
      } else {
        res.json({
          status: "Incorrect username/password provided. Please retry",
          status_code: 401,
        });
      }
    }
  });
});
module.exports = router;
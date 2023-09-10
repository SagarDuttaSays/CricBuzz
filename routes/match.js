const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");
const secret = "vitxworkindia";

// Create a new database connection
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "duttasagar086",
  database: "cricbuzz",
});

con.connect(function (err) {
  if (err) throw err;
  console.log("Connected to the database!");
});

//create match
router.post("/", (req, res) => {
  const { team_1, team_2, date, venue } = req.body;
  // Construct the INSERT INTO query
  const insertQuery = `
INSERT INTO matches (team_1, team_2, date, venue)
VALUES (?, ?, ?, ?)
`;

  // Execute the query with the provided data
  con.query(insertQuery, [team_1, team_2, date, venue], (err, result) => {
    if (err) throw err;
    console.log(result);
    const selectLastRowQuery = `
SELECT id
FROM ${tableName}
ORDER BY id DESC
LIMIT 1
`;

    // Execute the query to get the ID of the last row
    con.query(selectLastRowQuery, (err, results) => {
      if (err) throw err;

      if (results.length > 0) {
        const lastRowId = results[0].id;
        res.json({
          message: "Match created successfully",
          match_id: lastRowId,
        });
      } else {
        console.log("No rows found in the table.");
      }
    });
  });
});

//get all matches
router.get("/", (req, res) => {
  const query = `select * from matches`;
  con.query(query, (err, results) => {
    if (err) throw err;
    res.json({ matches: results });
  });
});

module.exports = router;


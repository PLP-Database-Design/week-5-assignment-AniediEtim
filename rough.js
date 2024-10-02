const express = require('express');
const app = express();
const mysql = require('mysql2');
const dotenv = require('dotenv');

// Initialize the app and load environment variables
app.use(express.json());
app.use(cors());
dotenv.config();


// Database connection setup
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });

  // Test the database connection
db.connect((err) => {
    if (err) return console.log('error connected to the mysql db');
    console.log('Connected to mysql successfully as id: ', db.threadid);
    app.listen(process.env.PORT, () => {
        console.log(`server listening on port ${process.env.PORT}`);

        // sending a message to the browser
        console.log('sending message to the browser...');
        app.get('/patients', (req, res) => {
            res.send('server started succesfully')

        })
    });
  });
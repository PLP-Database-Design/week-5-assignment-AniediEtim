const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');

const app = express();

// Load environment variables
dotenv.config();
app.use(express.json());
app.use(cors());
app.set('view engine', 'ejs'); // Set EJS as the template engine
app.set('views', __dirname + '/views'); // Set the directory for views

// Database connection setup
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Test the database connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the MySQL database:', err.message);
        return; // Exit if there is an error
    }
    console.log('Connected to MySQL successfully as id:', db.threadId);

    // Define a route for the root URL
    app.get('/', (req, res) => {
        res.send('Welcome to the server! Go to /data to see the data.'); // Simple welcome message
    });

    // Fetch patients and providers data from the database
    app.get('/data', (req, res) => {
        const patientsQuery = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
        const providersQuery = 'SELECT first_name, last_name, provider_specialty FROM providers';

        db.query(patientsQuery, (err, patients) => {
            if (err) return res.status(500).send('Error retrieving patients');

            db.query(providersQuery, (err, providers) => {
                if (err) return res.status(500).send('Error retrieving providers');
                
                // Render the data.ejs file and pass the data
                res.render('data', { patients: patients, providers: providers });
            });
        });
    });

    // 1. Retrieve all patients
    app.get('/patients', (req, res) => {
        const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
        db.query(query, (err, results) => {
            if (err) return res.status(500).send('Error retrieving patients');
            res.json(results); // Send results as JSON
        });
    });

    // 2. Retrieve all providers
    app.get('/providers', (req, res) => {
        const query = 'SELECT first_name, last_name, provider_specialty FROM providers';
        db.query(query, (err, results) => {
            if (err) return res.status(500).send('Error retrieving providers');
            res.json(results); // Send results as JSON
        });
    });

    // 3. Filter patients by First Name
    app.get('/patients/first-name/:name', (req, res) => {
        const name = req.params.name;
        const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
        db.query(query, [name], (err, results) => {
            if (err) return res.status(500).send('Error retrieving patients');
            res.json(results); // Send results as JSON
        });
    });

    // 4. Retrieve all providers by their specialty
    app.get('/providers/specialty/:specialty', (req, res) => {
        const specialty = req.params.specialty;
        const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
        db.query(query, [specialty], (err, results) => {
            if (err) return res.status(500).send('Error retrieving providers');
            res.json(results); // Send results as JSON
        });
    });

    // Start the server after a successful database connection
    const PORT = process.env.PORT || 3000; // Use the specified PORT or default to 3000
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
});

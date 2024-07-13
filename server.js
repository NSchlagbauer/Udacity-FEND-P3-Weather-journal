// Setup empty JS object to act as endpoint for all routes
let projectData = {};

// Require Express to run server and routes
const express = require('express');
const cors = require('cors');

// Start up an instance of app
const app = express();

/* Middleware*/
app.use(express.urlencoded({extended: false}));
app.use(express.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));


// Setup Server
const port = 8000;
const server = app.listen(port, listening);

//Callback to debug
function listening() {
  console.log(`server running on port ${port}`);
}

// Initialize /all route with a callback function
app.get('/all', getData);

// Callback function to complete GET '/all'
function getData (req, res) {
  res.send(projectData);
}

// POST Route
app.post('/addData', postWeatherData);

function postWeatherData (req, res) {
  projectData['temperature'] = req.body.temperature;
  projectData['date'] = req.body.date;
  projectData['feelings'] = req.body.feelings;
  res.send(projectData);
}


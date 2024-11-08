// ---- TO RUN ON LOCAL: npm run devStart

const express = require('express')
const app = express()
// const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const path = require('path'); // importing path
// REMOVE const fetch = require('node-fetch') //fetching from server so use node-fetch (built in fetch() is for client side api calls)
const fs = require('fs'); //file system



app.set('view engine', 'ejs') //set view engine - remember to npm i ejs!
app.set('views', __dirname + '/views') //point res.render('index') to /views folder
app.use(express.static(path.join(__dirname, '../public'))); // telling express to use client side .js files
// when you reference in html, this will append /public
app.use(bodyParser.urlencoded({extended: true}))


// Route to display the form
app.get('/', (req, res) => {
  const userRule = req.query.rule || ''; // Pull out submitted rule number
    // req.query - contains query parameters sent in URL when user redirected to page
    // this sets up /?rule=
    // req.query.rule  extracts value assciated with "rule" key from query params in request
    // || or operator, so if no rule, it returns '' (empty string)
  res.render('index', { userRule }); // Pass the userRule to the .ejs template
});


// Route to handle form submission with data validation
app.post('/', (req, res) => {
  const ruleNumber = parseInt(req.body.rule, 10); //parseInt converts from a string to base 10 integer
  if (isNaN(ruleNumber) || ruleNumber < 1 || ruleNumber > 256) {
    //isNAN - checks if input is not a number OR
    // is less than 1 OR is greter then 256
      return res.status(400).send("Invalid input.");
      // if any of those true, throw error
      // "return" stops further execution of function
  }
  // Proceed if input is valid
  console.log("Rule Number Submitted:", ruleNumber); //log the rule worked

  // Redirect to the main page with the rule number
  res.redirect(`/?rule=${ruleNumber}`); // Redirect with query parameter
});



// New route to 'backend tools' with image
app.get('/backendTools', (req, res) => {
  res.render('backendTools'); // This will render views/backendTools.ejs
});


// Function to convert military time to 12-hour format
function timeChange(militaryTime) {
  const [hours, minutes] = militaryTime.split(':').map(Number);
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const adjustedHours = hours % 12 || 12; // Convert 0 and 12 hours to 12
  return `${adjustedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
}

// Moon API 
app.get('/moons', async (req, res) => {
  const apiUrl = "https://api.ipgeolocation.io/astronomy?apiKey=2160b392961c4fa5ac1b75fe26c895b7"
  try {
    const response = await fetch(apiUrl) //get api data
    const data = await response.json() // turn response into json object
    // then send that data to EJS
    console.log(data)

    // convert the incoming api data 
    const sunrise = timeChange(data.sunrise);
    const sunset = timeChange(data.sunset);
    const moonrise = timeChange(data.moonrise);
    const moonset = timeChange(data.moonset)

    res.render('moons', { 
      sunrise, // don't have to set these up as :
      sunset,
      moonrise, 
      moonset,
      moon_phase: data.moon_phase, 
      zipcode: data.location.zipcode 
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching data');
  }
})

// Workout page
app.get('/workout', (req, res) => {
  res.render('workout')
});


// ---- Med drops route ----
const dropsFilePath = path.join(__dirname, '../data/drops.json'); // Absolute path

app.get('/meds', (req, res) => {
  fs.readFile(dropsFilePath, 'utf8', (err, data) => { //relative path not working for some reason?
    if (err) {
      console.error('File reading error:', err); // Log the actual error
      return res.status(500).send('Error reading drops data');
    }
    const dropsData = JSON.parse(data);
    res.render('meds', { dropsData });
  });
});

// Assuming this is inside your server.js file

const fs = require('fs');
const path = require('path');

// Route to get the drop count for the current day
app.get('/meds', (req, res) => {
  // Get the current date
  const today = new Date();
  const currentDate = today.toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'

  // Read the drops.json file
  fs.readFile(path.join(__dirname, '../data/drops.json'), 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error reading drops data');
      return;
    }

    // Parse the JSON data
    const dropsData = JSON.parse(data);

    // Find the drop count for today
    const todayData = dropsData.find(entry => entry.date === currentDate);

    if (todayData) {
      // If a matching date is found, send the drop count
      res.render('meds', { drops: todayData.drops });
    } else {
      // If no matching date, send a default message
      res.render('meds', { drops: 'No data available for today' });
    }
  });
});



// Use this for deploying to vercel:
module.exports = app;   // 'npm run dev' runs localServer.js
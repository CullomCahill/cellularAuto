// ---- TO RUN ON LOCAL: npm run dev

const express = require('express')
const app = express()
// const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const path = require('path'); // importing path
// REMOVE const fetch = require('node-fetch') //fetching from server so use node-fetch (built in fetch() is for client side api calls)
const fs = require('fs'); //file system
require('dotenv').config(); //add this for reading .env file for api keys


app.set('view engine', 'ejs') //set view engine - remember to npm i ejs!
app.set('views', __dirname + '/views') //point res.render('index') to /views folder
app.use(express.static(path.join(__dirname, '../public'))); // telling express to use client side .js files
// when you reference in html, this will append /public
app.use(bodyParser.urlencoded({extended: true}))


// Route to homepage
app.get('/', (req, res) => {
  const userRule = req.query.rule || ''; // Pull out submitted rule number

  // Validate input in query param
  if (userRule && (isNaN(userRule) || userRule < 1 || userRule > 256)){
    return res.status(400).send("nice try bro.");
  }

  console.log("Rule submitted:", userRule);
  res.render('index', { userRule }); // Pass the userRule to the .ejs template
})


// Route to handle form submission with data validation
// POST - send info to the server
app.post('/', (req, res) => {
  const ruleNumber = parseInt(req.body.rule, 10); //parseInt converts from a string to base 10 integer
  if (isNaN(ruleNumber) || ruleNumber < 1 || ruleNumber > 256) {
    //isNAN - checks if input is not a number OR
    // is less than 1 OR is greter then 256
      return res.status(400).send("Invalid input.");
      // if any of those true, throw error
      // "return" stops further execution of function
  } else {
      // Proceed if input is valid
      console.log("Rule Number Submitted:", ruleNumber); //log the rule worked
      // Redirect to the main page with the rule number
      res.redirect(`/?rule=${ruleNumber}`); // Redirect with query parameter
  }
});



// ----BACKEND TOOLS
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

// ----Moon API----
app.get('/moons', async (req, res) => {
  const apiKey = process.env.ASTRONOMY_API_KEY // hide api key
  const apiUrl = `https://api.ipgeolocation.io/astronomy?apiKey=${apiKey}` //access api key here
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

// -----WORKOUT-----


app.get('/workout', (req, res) => {
  // will pull in des from exercises.json
  // const exerciseDes_os = [
  //   { name: "Squats", description: "A lower body exercise that targets the quads." },
  //   { name: "Lunges", description: "A lower body exercise that targets the glutes and quads." },
  //   // Add the rest of your exercises here or link to another file
  // ];

  // Read the workout.json file
  fs.readFile(path.join(__dirname, '../data/workout.json'), 'utf8', (err, data) => {
    // pull in drop data from json
    if (err) {
      res.status(500).send('Error reading workout data');
      return;
    }

  
  // Parse the JSON data and call dropsData
  const exerciseData = JSON.parse(data);

  res.render('workout', { 
      exerciseData: exerciseData,
      // exercises: exercisePlan_os.exercises, 
      // theme: exercisePlan_os.theme, 
      // exerciseDes: exerciseDes_os, 
    }); //pull out all pieces of data from object you need
  })
});



//-----MEDS------
app.get('/meds', (req, res) => {
  // Get the current date
  const today = new Date();
  const currentDate = today.toISOString().split('T')[0]; // Convert to 'YYYY-MM-DD'

  // Read the drops.json file
  fs.readFile(path.join(__dirname, '../data/drops.json'), 'utf8', (err, data) => {
    // pull in drop data from json
    if (err) {
      res.status(500).send('Error reading drops data');
      return;
    }

    // Parse the JSON data and call dropsData
    const dropsData = JSON.parse(data);

    // Find the drop count for today
    const todayData = dropsData.find(entry => entry.date === currentDate);
      //.find method - seraches for first element that meets condition in callback
        // accepts fuction as an argument 
      // callback function - condition checked: entry.date === currentDate
      // entry function is individual object from dropsData
      // In find() entry function is defined as when the entry.date === currentDate
      // matches todays date with corresponding date in the data and assigns to todayData

    if (todayData) {
      // If a matching date is found, send the drop count
      res.render('meds', { drops: todayData.drops });
        // pass "drops" variable which holds todayData.drops element
    } else {
      // If no matching date, send a default message
      res.render('meds', { drops: 'No data available for today' });
    }
  });
});



// Use this for deploying to vercel:
module.exports = app;   // 'npm run dev' runs localServer.js
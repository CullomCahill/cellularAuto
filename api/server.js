// ---- TO RUN ON LOCAL: npm run devStart

const express = require('express')
const app = express()
// const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const path = require('path'); // importing path



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

// Route to handle form submission
app.post('/', (req, res) => {
  const ruleNumber = req.body.rule; // Access the input value
  console.log("Rule Number Submitted:", ruleNumber); //log the rule worked
  
  // Redirect to the main page with the rule number
  res.redirect(`/?rule=${ruleNumber}`); // Redirect with query parameter
    // ??
});


// New route to 'backend tools' with image
app.get('/backendTools', (req, res) => {
  res.render('backendTools'); // This will render views/backendTools.ejs
});


// Use this for deploying to vercel:
module.exports = app;   // 'npm run dev' runs localServer.js
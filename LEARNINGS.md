- Any time make changes to server code - add new route, update middleware, modify any backend logic - RESTART SERVER

- Each route can only have 1 get and 1 post request, otherwise set up a new route or include multiple requests in one get statement

- remember: <%= %> only is for pulling in variables from the server to your ejs page, cant access variables in <script>

GET/POST:
GET: 
- retrive data
- Data in URL (in the query string)
- Visible in url
- Has a limit length
- Can be cached
- Use to fetch resources or view data

POST:
- Sends data
- Data in request body
- Hidden in URL
- No limit length
- used to submit forms, or send sensitive data

# cellularAuto

Set up as serverless for running on Vercel
npm run dev - sets up localServer.js for testing locally


API info:
### visualcrossing.com
Tried this first, some weather data, but no moon rise
https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/53147?unitGroup=us&key=F2E7NJXQZHP7UAY93XX8D75MR&contentType=json

### api.ipgeolocation.io
Access by city:
https://api.ipgeolocation.io/astronomy?apiKey=2160b392961c4fa5ac1b75fe26c895b7&location=New%20York,%20US

Access by lat long:
https://api.ipgeolocation.io/astronomy?apiKey=API_KEY&lat=-27.4748&long=153.017

Or leave "&..." blank to access from cleint side ip address

// set up local server to testing locally (because set up for serverless for vercel)
const app = require('./api/server'); // Adjust path if needed

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');  // Import routes
const config = require('../config/config'); // Import config for environment variables

const app = express();
app.use(bodyParser.json());  // Middleware to parse incoming requests as JSON
app.use(bodyParser.urlencoded({ extended: true }));

// Set up static files serving (if needed)
app.use('/public', express.static('public')); // Adjust the static directory as needed

// Use your routes
app.use('/api', routes);

// Health check route (optional)
app.get('/health', (req, res) => {
    res.status(200).send('Server is running');
});

const PORT = process.env.PORT || 3000;  // Use PORT from .env or default to 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Web App URL: ${config.WEB_APP_URL}`); // Log the web app URL for reference
});

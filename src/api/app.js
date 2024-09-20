// src/api/app.js
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');  // Import routes

const app = express();
app.use(bodyParser.json());  // Middleware to parse incoming requests as JSON
app.use(bodyParser.urlencoded({ extended: true }));

// Use your routes
app.use('/api', routes);

const PORT = process.env.PORT || 3000;  // Use PORT from .env or default to 3000
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

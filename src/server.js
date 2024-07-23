// src/server.js
const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');
const cors = require('cors');
const helmet = require('helmet');

dotenv.config();

const app = express();
app.use(express.json());

// Use Helmet to set various HTTP headers for security
app.use(helmet());

// Customize Helmet's cross-origin resource policy
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

// Configure CORS to allow requests from your frontend's origin
app.use(cors({
    origin: 'https://jta-aws-frontend.onrender.com', // Replace with your frontend's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
}));

app.use('/', routes);

// Only start the server if we're not in a Lambda environment
if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;

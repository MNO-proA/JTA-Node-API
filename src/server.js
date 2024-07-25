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

// Configure CORS to allow requests from specific origins
const allowedOrigins = [
    'http://localhost:5173', // Add your frontend's URL here
    'https://jta-aws-frontend.onrender.com', 
    'https://main.dcbanxswb8ju1.amplifyapp.com/'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
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

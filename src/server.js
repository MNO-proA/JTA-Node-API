// src/server.js
const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes');

dotenv.config();

const app = express();
app.use(express.json());

app.use('/', routes);

// Only start the server if we're not in a Lambda environment
if (!process.env.AWS_LAMBDA_FUNCTION_NAME) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;

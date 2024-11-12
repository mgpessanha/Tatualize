const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());

// Verificação das chaves de API carregadas do Firebase Environment Configuration
const apiKeyO = functions.config().api.keyo;
const apiKeyR = functions.config().api.keyr;

if (!apiKeyO || !apiKeyR) {
    console.error('API keys not found. Please check your Firebase configuration.');
} else {
    console.log('API keys loaded successfully.');
}

app.get('/api/keys', (req, res) => {
    console.log('Received request for API keys');
    res.json({
        apiKeyO,
        apiKeyR
    });
});

exports.api = functions.https.onRequest(app);
const crypto = require('crypto');

function generateSecretKey(length) {
    return crypto.randomBytes(length).toString('hex');
}

const secretKey = generateSecretKey(64); // Generate a 64-character secret key
console.log(secretKey);
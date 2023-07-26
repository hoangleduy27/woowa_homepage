// config.js
require('dotenv').config();

module.exports = {
    sessionSecret: process.env.SESSION_SECRET || 'default_secret_key',
};
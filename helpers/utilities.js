/*
 * Title: Utilities
 * Description: Important utility functions
 * Author: Prithwijit Banerjee
 * Date: 29/05/2024
 */

// Dependencies ...
const { createHmac } = require('node:crypto');
const enviroments = require('./enviroments');

// Utilities object -- module scaffolding 
const utilities = {};


// parse json str to object ...

utilities.parseJSON = str => {
    try {
        // errors arises if str is empty or in other invalid format except json string ...
        return JSON.parse(str);
    } catch (e) {
        return {};
    }
}

// hash string ...
utilities.hash = password => {
    if (typeof (password) === 'string' && password.length > 0) {
        const hashPass = createHmac('sha256', enviroments.secret_key)
            .update(password)
            .digest('hex');
        return hashPass;
    }
}

// Exporting the module ...
module.exports = utilities;
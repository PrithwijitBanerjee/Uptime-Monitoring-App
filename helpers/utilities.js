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

// generates random token id based on given string length ...
utilities.generateRandomToken = strLen => {
    let len = typeof (strLen) === 'number' && strLen > 0 ? strLen : false;
    console.log('len: ', len);
    if (len) {
        const possibleCharacters = 'abcdefghijklmnopqrstwxyzABCDEFGHIJKLMNOPQRSTWXYZ0123456789$#!*&';
        let output = "";
        for (let i = 0; i < len; i++) {
            output += possibleCharacters.charAt(Math.floor(Math.random() * strLen));
        }
        return output;
    } else {
        return false;
    }
}

// Exporting the module ...
module.exports = utilities;
/* 
* Title: Read File Module
* Description: Read the JSON data from the corressponding existing file
* Author: Prithwijit Banerjee
* Date: 29/05/2024
*/

// Dependencies ...
const fs = require('node:fs');
const baseCommonDir = require('./commons/dbDirPath');


// Library object -- module scaffolding 
const lib = {};


// Reading data from the existing corresponding file ...
lib.read = (file, dir, callback) => {
    fs.readFile(baseCommonDir.baseDirPath + dir + '/' + file + '.json', 'utf-8', (error, data) => {
        callback(error, JSON.parse(data));
    });
}

// Exporting the module ...
module.exports = lib;
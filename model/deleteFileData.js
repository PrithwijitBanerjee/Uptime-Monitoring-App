/* 
* Title: Delete File Module
* Description: Delete the corressponding file 
* Author: Prithwijit Banerjee
* Date: 29/05/2024
*/

// Dependencies ...
const fs = require('node:fs');
const baseCommonDir = require('./commons/dbDirPath');


// Library object -- module scaffolding 
const lib = {};


// Delete the existing file ...
lib.deleteFile = (file, dir, callback) => {
    fs.unlink(baseCommonDir.baseDirPath + dir + '/' + file + '.json', (err) => {
        if (!err) {
            callback(false);
        } else {
            callback('Error while deleting the file!!!');
        }
    })
}


// Exporting module ...
module.exports = lib;
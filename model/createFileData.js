/* 
* Title: Create File Module
* Description: Open a new file and write json data in to that file
* Author: Prithwijit Banerjee
* Date: 28/05/2024
*/

// Dependencies ...
const fs = require('node:fs');
const baseCommonDir = require('./commons/dbDirPath');

// Library object -- module scaffolding 
const lib = {};

// write data to file 

lib.create = (file, dir, data, callback) => {
    // opening the file in RAM ...
    fs.open(baseCommonDir.baseDirPath + dir + '/' + file + '.json', 'wx', (error, fileDescriptor) => {
        if (!error && fileDescriptor) {
            // convert the given data to write into string format ...
            const stringifyData = JSON.stringify(data);
            fs.writeFile(fileDescriptor, stringifyData, (err2) => {
                if (!err2) {
                    fs.close(fileDescriptor, (err3) => {
                        if (!err3) {
                            callback(false);
                        } else {
                            callback('Error while closing the file!!!');
                        }
                    });
                } else {
                    callback('Error while writing into file!!!');
                }
            });
        } else {
            callback('Error while opening the file, file already exists!!!');
        }
    })
}

// Exporting the module ...
module.exports = lib;

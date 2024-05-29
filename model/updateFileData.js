/* 
* Title: Update File Module
* Description: Read the JSON data from the corressponding existing file and Update that file
* Author: Prithwijit Banerjee
* Date: 29/05/2024
*/

// Dependencies ...
const fs = require('node:fs');
const baseCommonDir = require('./commons/dbDirPath');


// Library object -- module scaffolding
const lib = {};

// // update the existing file ...
// lib.update = (file, dir, data, callback) => {
//     // opens the existing file ...
//     fs.open(baseCommonDir.baseDirPath + dir + '/' + file + '.json', 'w+', (error, fileDescriptor) => {
//         if (!error && fileDescriptor) {
//             // truncate the existing file ...
//             fs.ftruncate(fileDescriptor, (err1) => {
//                 if (!err1) {
//                     // convert the data into string ...
//                     const stringifyData = JSON.stringify(data);
//                     // writing the stringify data to the existing file ...
//                     fs.writeFile(fileDescriptor, stringifyData, (err2) => {
//                         if (!err2) {
//                             // close the file ...
//                             fs.close(fileDescriptor, (err3) => {
//                                 if (!err3) {
//                                     callback(false);
//                                 } else {
//                                     callback('Error closing file!!!!');
//                                 }
//                             })
//                         } else {
//                             callback('Error while writing to file!');
//                         }
//                     });
//                 } else {
//                     callback('Error while truncating the existing file!!!');
//                 }
//             })
//         } else {
//             callback('Error while opening the existing file for update!!!');
//         }
//     })
// }



// update the existing file ...
lib.update = (file, dir, data, callback) => {
    // opens the existing file ...
    fs.open(baseCommonDir.baseDirPath + dir + '/' + file + '.json', 'w+', (error, fileDescriptor) => {
        if (!error && fileDescriptor) {
            // convert the data into string ...
            const stringifyData = JSON.stringify(data);
            // writing the stringify data to the existing file ...
            fs.writeFile(fileDescriptor, stringifyData, (err2) => {
                if (!err2) {
                    // close the file ...
                    fs.close(fileDescriptor, (err3) => {
                        if (!err3) {
                            callback(false);
                        } else {
                            callback('Error closing file!!!!');
                        }
                    })
                } else {
                    callback('Error while writing to file!');
                }
            });
        } else {
            callback('Error while opening the existing file for update!!!');
        }
    })
}





// Exporting the module ...
module.exports = lib;
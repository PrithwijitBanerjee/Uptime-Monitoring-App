/* 
* Title: Common Path File For Database Directory
* Description: Common Path File For Database Directory For Access
* Author: Prithwijit Banerjee
* Date: 29/05/2024
*/

// Dependencies ...
const path = require('node:path');

// Coomon Path object -- module scaffolding 
const commonPath = {};


commonPath.baseDirPath = path.join(__dirname + "/../../.database/");

// Exporting the database base directory ....
module.exports = commonPath;

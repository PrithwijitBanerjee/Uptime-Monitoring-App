/* 
* Title: Enviroments Module File
* Description: Handle all environment related things
* Author: Prithwijit Banerjee
* Date: 28/05/2024
*/

// Enviroments object -- module scaffolding
const enviroments = {};

// Enviroments for production ...
enviroments.production = {
    PORT: process.env.PORT || 5000,
    hostName: '127.0.0.1', // loop-back address
    envName: 'production',
};

// Enviroments for staging/developement ...
enviroments.developement = {
    PORT: process.env.PORT || 3000,
    hostName: '127.0.0.1', // loop-back address
    envName: 'developement',
};

// determine which enviroment to pass ...
const currentEnviroment = typeof (process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV : 'developement';

// Export corresponding enviroments object ...
const enviromentToExports = typeof (enviroments[process.env.NODE_ENV]) === 'object' ? enviroments[process.env.NODE_ENV] : enviroments.developement;


// Exporting the module ...
module.exports = enviromentToExports;
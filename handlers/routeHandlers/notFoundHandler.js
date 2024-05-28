/* 
* Title: Not Found Handler
* Description: Not Found Handler
* Author: Prithwijit Banerjee
* Date: 28/05/2024
*/

// Handler object -- module scaffolding 
const handler = {};


handler.notFoundHnadler = (requestedProperties, callback) => {
    callback(404, {
        message: 'This is not found route page (404)'
    });
}

// Exporting the module ...
module.exports = handler;
/* 
* Title: Sample Hnadler Module 
* Description: Handling req and give response on sample route 
* Name: Prithwijit Banerjee
* Date: 28/05/2024
*/

// Handler object -- module scaffolding 
const handler = {};

handler.sampleHandler = (requestedProperties, callback) => {
    callback(200, {
        message: "This is sample route page"
    });
};

// Exporting the module ...
module.exports = handler;
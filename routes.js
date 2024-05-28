/* 
* Title: Routes
* Description: Application Routes
* Name: Prithwijit Banerjee
* Date: 28/05/2024
*/

// Dependencies ...
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler');

// Routes object -- module scaffolding 
const routes = {};

// define all routes with routehandlers ...

routes.allRoutes = {
    'sample': sampleHandler,
};

// Exporting the module ...
module.exports = routes;
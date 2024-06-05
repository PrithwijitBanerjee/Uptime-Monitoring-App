/* 
* Title: Routes
* Description: Application Routes
* Name: Prithwijit Banerjee
* Date: 28/05/2024
*/

// Dependencies ...
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler');
const { userHandler } = require('./handlers/routeHandlers/userHandler');
const { tokenHandler } = require('./handlers/routeHandlers/tokenHandler');

// Routes object -- module scaffolding 
const routes = {};

// define all routes with routehandlers ...

routes.allRoutes = {
    'sample': sampleHandler,
    'user': userHandler,
    'token': tokenHandler,
};

// Exporting the module ...
module.exports = routes;
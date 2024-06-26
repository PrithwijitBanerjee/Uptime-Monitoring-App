/* 
* Title: Handle Req And Res Object
* Description: Helper function for handling Req and Res object
* Author: Prithwijit Banerjee
* Date: 28/05/2024
*/

// Dependencies ...
const url = require('node:url');
const { StringDecoder } = require('node:string_decoder');
const { allRoutes } = require('../routes');
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler');
const { parseJSON } = require("./utilities");
// Handler object -- module scaffolding 

const handler = {};


// handle reqres ...
handler.handleReqRes = (req, res) => {
    // handling req ...
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const queryStrObj = parsedUrl.query;
    const trimmedPath = path.replace(/^\/|\/$/g, '');
    const method = req.method.toLowerCase();
    const headersObj = req.headers;
    const requestedProperties = {
        trimmedPath,
        queryStrObj,
        method,
        headersObj
    };
    const choosedPathHandler = allRoutes[trimmedPath] ? allRoutes[trimmedPath] : notFoundHandler;
    // choosedPath(requestedProperties, (statusCode, payload) => {
    //     statusCode = typeof(statusCode) === 'number' ? statusCode : 500;
    //     payload = typeof(payload) === 'object' ? payload : {};
    //     const payloadStr = JSON.stringify(payload);

    //     // returning the final response to the client ...
    //     res.writeHead(statusCode, {'Content-Type': 'application/json'});
    //     res.write(payloadStr);
    // });
    const decoder = new StringDecoder('utf-8');
    let realData = "";
    req.on('data', buffer => {
        realData += decoder.write(buffer);
    });

    req.on('end', () => {
        realData += decoder.end();
        requestedProperties['body'] = parseJSON(realData);
        choosedPathHandler(requestedProperties, (statusCode, payload) => {
            statusCode = typeof (statusCode) === 'number' ? statusCode : 500;
            payload = typeof (payload) === 'object' ? payload : {};
            const payloadStr = JSON.stringify(payload);

            // returning the final response to the client ...
            res.writeHead(statusCode, { 'Content-Type': 'application/json' });
            res.write(payloadStr);
            res.end();
        });
    });
}

// Exporting the module ...
module.exports = handler;
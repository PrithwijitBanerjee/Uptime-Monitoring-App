/* 
* Title: Uptime Monitoring App Using Raw Node JS
* Description: API using raw Node Js for checking up and down time of user defined links
* Author: Prithwijit Banerjee
* Date: 28/05/2024
*/

// Dependencies
const http = require('node:http');
const handler = require('./helpers/handleReqRes');
const enviroments = require('./helpers/enviroments');


// App object -- module scaffolding
const app = {};


// Node JS server 
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);

    // connection event fires when user hits the server url ...
    server.on('connection', (socket) => {
        console.log("user connected!!!");
    })

    // server is listening at given port ....
    server.listen(enviroments.PORT, enviroments.hostName, () => {
        console.log(`Server is successfully running at: http://${enviroments.hostName}:${enviroments.PORT}`);
    });
}

// handle reqres ...
app.handleReqRes = handler.handleReqRes;


// Invoking the server ...
app.createServer();
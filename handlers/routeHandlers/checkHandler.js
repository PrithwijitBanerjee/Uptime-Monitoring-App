/* 
* Title: Check Handler Module 
* Description: Handling Check related routes 
* Name: Prithwijit Banerjee
* Date: 05/05/2024
*/

// Dependencies ...
const { read } = require('../../model/readFileData');
const { hash, parseJSON, generateRandomToken } = require('../../helpers/utilities');
const { create } = require('../../model/createFileData');
const { update } = require("../../model/updateFileData");
const { deleteFile } = require('../../model/deleteFileData');
const tokenHandler = require('./tokenHandler');
const enviroments = require('../../helpers/enviroments');

// Handler object -- module scaffolding 
const handler = {};

handler.checkHandler = (requestedProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.includes(requestedProperties.method)) {
        handler._check[requestedProperties.method](requestedProperties, callback);
    } else {
        callback(405, {
            error: "Method Not Allowed"
        });
    }
};

// _user private object -- sub module scaffolding 
handler._check = {};


handler._check.get = (requestedProperties, callback) => {
    // get check_id as query string as parameter ...
    const checkId = typeof (requestedProperties.queryStrObj.checkId) === 'string' && requestedProperties.queryStrObj.checkId.trim().length === 12 ? requestedProperties.queryStrObj.checkId : false;
    if (checkId) {

        read(checkId, 'Checks', (error1, checkData) => {
            if (!error1 && checkData) {
                const parsedCheckObj = { ...parseJSON(checkData) };
                // verify token for authentication ...
                // get token_id from headers for authentication purposes ...
                const token = typeof (requestedProperties.headersObj.token) === 'string' ? requestedProperties.headersObj.token : false;
                if (token) {
                    // user authenticated ...
                    callback(200, {
                        msg: 'user defined links information',
                        checkObj: parsedCheckObj
                    });
                } else {
                    callback(403, {
                        error: 'Authentication Failed !!!'
                    });
                }
            } else {
                callback(404, {
                    error: 'Given check id does not exists !!!'
                });
            }
        })
    } else {
        callback(400, {
            error: 'Invalid Client Request !!!'
        });
    }

};

handler._check.post = (requestedProperties, callback) => {
    // server side validation ...
    const protocols = typeof (requestedProperties.body.protocols) === 'string' && ['http', 'https'].includes(requestedProperties.body.protocols) ? requestedProperties.body.protocols : false;
    const baseUrl = typeof (requestedProperties.body.baseUrl) === 'string' ? requestedProperties.body.baseUrl : false;
    const method = typeof (requestedProperties.body.method) === 'string' && ['get', 'post', 'put', 'delete'].includes(requestedProperties.body.method.trim()?.toLowerCase()) ? requestedProperties.body.method : false;
    const successCodes = typeof (requestedProperties.body.successCodes) === 'object' && requestedProperties.body.successCodes instanceof Array ? requestedProperties.body.successCodes : false;
    const timeoutSeconds = typeof (requestedProperties.body.timeoutSeconds) === 'number' && requestedProperties.body.timeoutSeconds % 1 === 0 && requestedProperties.body.timeoutSeconds >= 1 && requestedProperties.body.timeoutSeconds <= 5 ? requestedProperties.body.timeoutSeconds : false;
    if (protocols && baseUrl && method && successCodes && timeoutSeconds) {
        // get token_id from headers for authentication purposes ...
        const token = typeof (requestedProperties.headersObj.token) === 'string' ? requestedProperties.headersObj.token : false;
        console.log(token);
        if (token) {
            // get token information from db ...
            read(token, 'Tokens', (error1, data) => {
                if (!error1 && data) {
                    const tokenInfo = { ...parseJSON(data) };
                    // checks user exists or not based on phone no ...
                    read(tokenInfo?.phoneNo, 'Users', (error2, data) => {
                        if (!error2 && data) {
                            // user exists in db ...
                            const parsedUsr = { ...parseJSON(data) };
                            tokenHandler._token.verifyToken(token, parsedUsr?.phoneNo, (access) => {
                                if (access) {
                                    const userChecks = typeof (parsedUsr?.checks) === 'object' && Array.isArray(parsedUsr?.checks) ? parsedUsr?.checks : [];
                                    if (userChecks?.length < enviroments?.maxChecks) {
                                        const checksId = generateRandomToken(12);
                                        const checksObj = {
                                            checksId,
                                            phoneNo: parsedUsr?.phoneNo,
                                            protocols,
                                            baseUrl,
                                            method,
                                            successCodes,
                                            timeoutSeconds
                                        };
                                        // save this checks object into db ...
                                        create(checksId, 'Checks', checksObj, (error3) => {
                                            if (!error3) {
                                                parsedUsr.checks = userChecks;
                                                parsedUsr.checks.push(checksId);
                                                // update that corresponding user into db ...
                                                update(parsedUsr?.phoneNo, 'Users', parsedUsr, (error4) => {
                                                    if (!error4) {
                                                        callback(200, {
                                                            msg: 'User defined links added',
                                                            checks: checksObj
                                                        });
                                                    } else {
                                                        callback(500, {
                                                            error: 'Internal Server Error, Something Went Wrong !!!'
                                                        });
                                                    }
                                                });
                                            } else {
                                                callback(500, {
                                                    error: 'Internal Server Error, Something Went Wrong !!!'
                                                });
                                            }
                                        });
                                    } else {
                                        callback(400, {
                                            error: 'your checks limit exceeded !!!'
                                        });
                                    }
                                } else {
                                    callback(403, {
                                        error: 'Authentication Failed !!!'
                                    });
                                }
                            })
                        } else {
                            callback(404, {
                                error: 'User does not exists !!!'
                            });
                        }
                    })
                } else {
                    callback(404, {
                        error: 'Token Id does not exists!!!'
                    });
                }
            })
        } else {
            callback(403, {
                error: 'Authentication Failed !!!'
            });
        }
    } else {
        callback(400, {
            error: 'Invalid Client Error !!!'
        });
    }
};

handler._check.put = (requestedProperties, callback) => {
    // server side validation ...
    const checkId = typeof (requestedProperties.body.checkId) === 'string' && requestedProperties.body.checkId?.trim()?.length === 12 ? requestedProperties.body.checkId : false;
    const protocols = typeof (requestedProperties.body.protocols) === 'string' && ['http', 'https'].includes(requestedProperties.body.protocols) ? requestedProperties.body.protocols : false;
    const baseUrl = typeof (requestedProperties.body.baseUrl) === 'string' ? requestedProperties.body.baseUrl : false;
    const method = typeof (requestedProperties.body.method) === 'string' && ['get', 'post', 'put', 'delete'].includes(requestedProperties.body.method.trim()?.toLowerCase()) ? requestedProperties.body.method : false;
    const successCodes = typeof (requestedProperties.body.successCodes) === 'object' && requestedProperties.body.successCodes instanceof Array ? requestedProperties.body.successCodes : false;
    const timeoutSeconds = typeof (requestedProperties.body.timeoutSeconds) === 'number' && requestedProperties.body.timeoutSeconds % 1 === 0 && requestedProperties.body.timeoutSeconds >= 1 && requestedProperties.body.timeoutSeconds <= 5 ? requestedProperties.body.timeoutSeconds : false;

    if (checkId) {
        if (checkId || protocols || baseUrl || method || successCodes || timeoutSeconds) {
            // get token_id from headers for authentication purposes ...
            const token = typeof (requestedProperties.headersObj.token) === 'string' ? requestedProperties.headersObj.token : false;
            if (token) {
                read(checkId, 'Checks', (error1, checkData) => {
                    if (!error1 && checkData) {
                        let checkObj = { ...parseJSON(checkData) };
                        // verify user based on token ...
                        tokenHandler._token.verifyToken(token, checkObj?.phoneNo, (access) => {
                            if (access) {
                                if (protocols) {
                                    checkObj.protocols = protocols;
                                }
                                if (baseUrl) {
                                    checkObj.baseUrl = baseUrl;
                                }
                                if (method) {
                                    checkObj.method = method;
                                }
                                if (successCodes) {
                                    checkObj.successCodes = successCodes;
                                }
                                if (timeoutSeconds) {
                                    checkObj.timeoutSeconds = timeoutSeconds;
                                }

                                // updates checks object in db...
                                update(checkId, 'Checks', checkObj, (error2) => {
                                    if (!error2) {
                                        callback(200, {
                                            msg: 'User defined links has been updated successfully !!!'
                                        });
                                    } else {
                                        callback(500, {
                                            error: 'Internal Server Error, Something Went Wrong !!!'
                                        });
                                    }
                                })
                            } else {
                                console.log('hello');
                                callback(403, {
                                    error: 'Authentication Failed !!!'
                                });
                            }
                        });
                    } else {
                        callback(404, {
                            error: 'Given check id does not exists !!!'
                        });
                    }
                })
            } else {
                callback(403, {
                    error: "Authentication Failed !!!"
                });
            }
        }
    } else {
        callback(400, {
            error: 'Invalid Client Request !!!'
        });
    }
};

handler._check.delete = (requestedProperties, callback) => {
    // get check_id as query string as parameter ...
    const checkId = typeof (requestedProperties.queryStrObj.checkId) === 'string' && requestedProperties.queryStrObj.checkId.trim().length === 12 ? requestedProperties.queryStrObj.checkId : false;
    if (checkId) {
        // get token_id from headers for authentication purposes ...
        const token = typeof (requestedProperties.headersObj.token) === 'string' ? requestedProperties.headersObj.token : false;
        if (token) {
            read(checkId, 'Checks', (error1, checkData) => {
                if (!error1 && checkData) {
                    const checkObj = { ...parseJSON(checkData) };
                    // verify the user ...
                    tokenHandler._token.verifyToken(token, checkObj?.phoneNo, (access) => {
                        if (access) {
                            // delete check obj from db ...
                            deleteFile(checkId, 'Checks', (error2) => {
                                if (!error2) {
                                    // get user from db based on phone no ...
                                    read(checkObj?.phoneNo, 'Users', (error3, usrData) => {
                                        if (!error3 && usrData) {
                                            const usrObj = { ...parseJSON(usrData) };
                                            let checks = typeof (usrObj.checks) === 'object' && Array.isArray(usrObj.checks) ? usrObj.checks : [];
                                            if (checks?.length !== 0) {
                                                checks = checks.filter(id => id !== checkId);
                                            }
                                            usrObj.checks = checks;
                                            // update user object in db ...
                                            update(checkObj?.phoneNo, 'Users', usrObj, (error4) => {
                                                if (!error4) {
                                                    callback(200, {
                                                        msg: "use's defined link/check has been deleted successfully !!!"
                                                    });
                                                } else {
                                                    callback(500, {
                                                        error: 'Internal Server Error, Something Went Wrong in Server Side !!!'
                                                    });
                                                }
                                            })
                                        } else {
                                            callback(404, {
                                                error: 'User does not exists !!!'
                                            });
                                        }
                                    })
                                } else {
                                    callback(500, {
                                        error: 'Internal Server Error, Something Went Wrong !!!'
                                    });
                                }
                            });
                        } else {
                            callback(403, {
                                error: 'Authentication Failed !!!'
                            });
                        }
                    });

                } else {
                    callback(404, {
                        error: 'Given check id does not exists !!!'
                    });
                }
            });
        } else {
            callback(403, {
                error: 'Authentication Failed !!!'
            });
        }
    } else {
        callback(400, {
            error: 'Invalid Client Request !!!'
        });
    }
};



// Exporting the module ...
module.exports = handler;
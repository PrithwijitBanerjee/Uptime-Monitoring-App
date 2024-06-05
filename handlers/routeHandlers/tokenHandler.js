/* 
* Title: Token Handler Module 
* Description: Handling Token related routes 
* Name: Prithwijit Banerjee
* Date: 31/05/2024
*/

// Dependencies ...
const { read } = require('../../model/readFileData');
const { hash, parseJSON, generateRandomToken } = require('../../helpers/utilities');
const { create } = require('../../model/createFileData');
const { update } = require("../../model/updateFileData");
const { deleteFile } = require('../../model/deleteFileData');
// Handler object -- module scaffolding 
const handler = {};

handler.tokenHandler = (requestedProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.includes(requestedProperties.method)) {
        handler._token[requestedProperties.method](requestedProperties, callback);
    } else {
        callback(405, {
            error: "Method Not Allowed"
        });
    }
};

// _user private object -- sub module scaffolding 
handler._token = {};


handler._token.get = (requestedProperties, callback) => {
    // get token_id from query string as parameter ...
    const token_id = typeof (requestedProperties.queryStrObj.token_id) === 'string' && requestedProperties.queryStrObj.token_id.trim().length === 20 ? requestedProperties.queryStrObj.token_id : false;
    if (token_id) {
        // get token details ....
        read(token_id, 'Tokens', (error, data) => {
            if (!error && data) {
                // corresponding token exists ...
                const tokenObj = { ...parseJSON(data) };
                callback(200, {
                    tokenInfo: tokenObj
                });
            } else {
                // token does not exists ...
                callback(404, {
                    error: 'Given Token Id does not exist, Please create a new token !!!'
                });
            }
        })
    } else {
        callback(400, {
            error: 'Invalid Token Id!!!'
        });
    }
};

handler._token.post = (requestedProperties, callback) => {
    if (Object.keys(requestedProperties.body).length === 0) {
        callback(400, {
            error: "Invalid Client request"
        });
        return;
    }

    //server side validation of user given data ...
    const phoneNo = typeof (requestedProperties.body.phoneNo) === 'string' && requestedProperties.body.phoneNo.trim().length === 10 ? requestedProperties.body.phoneNo : false;
    const password = typeof (requestedProperties.body.password) === 'string' && requestedProperties.body.password.trim().length > 8 || requestedProperties.body.password.trim().length <= 10 ? requestedProperties.body.password : false;
    if (phoneNo && password) {
        let hashedPassword = hash(password);

        // checks whether the password of user exists in db or not ...
        read(phoneNo, 'Users', (error, data) => {
            const parsedUsrData = { ...parseJSON(data) };
            if (!error && data) {
                // checks whether the password matches with existing password or not ...
                if (hashedPassword === parsedUsrData?.password) {
                    // generate a new token for user ....
                    const token = generateRandomToken(20);
                    const expires = Date.now() + 60 * 60 * 1000; // token expires after 1 hour ...
                    const tokenObj = {
                        phoneNo,
                        token,
                        expires
                    };
                    create(token, 'Tokens', tokenObj, err => {
                        if (err) {
                            callback(500, {
                                error: 'Internal Server Error, Something Went Wrong!!!'
                            });
                        } else {
                            callback(200, {
                                msg: 'token created successfully !!!',
                                user: tokenObj
                            });
                        }
                    });
                } else {
                    callback(400, {
                        error: 'Invalid Password, Please try again!!!'
                    });
                }
            } else {
                callback(400, {
                    error: 'Phone Number does not exists, Please create a new user!!1'
                });
            }
        })
    } else {
        callback(400, {
            error: 'Invalid phone number and password'
        });
    }
};

handler._token.put = (requestedProperties, callback) => {
    // get token_id and extend  as body  ...
    const token_id = typeof (requestedProperties.body.token_id) === 'string' && requestedProperties.body.token_id.trim().length === 20 ? requestedProperties.body.token_id : false;
    const extend = typeof (requestedProperties.body.extend) === 'boolean' ? requestedProperties.body.extend : false;
    if (token_id && extend) {
        // checks whether the token presents in db or not ....
        read(token_id, 'Tokens', (error, data) => {
            if (!error && data) {
                const tokenInfo = { ...parseJSON(data) };
                if (tokenInfo.expires > Date.now()) {
                    tokenInfo.expires = Date.now() + 60 * 60 * 1000;
                    // update token info into file ...
                    update(token_id, 'Tokens', tokenInfo, (err1) => {
                        if (!err1) {
                            callback(200, {
                                msg: 'Token updates successfully'
                            });
                        } else {
                            // db error may exists ...
                            callback(500, {
                                error: 'Internal Server Error, Something Went Wrong!!!'
                            });
                        }
                    })
                } else {
                    callback(400, {
                        error: 'Token already expired !!!'
                    });
                }
            } else {
                callback(404, {
                    error: 'Token does not exists!!!'
                });
            }
        })
    } else {
        callback(400, {
            error: 'Invalid Token Id!!!'
        });
    }
};

handler._token.delete = (requestedProperties, callback) => {
    // get token_id from query string as parameter ...
    const token_id = typeof (requestedProperties.queryStrObj.token_id) === 'string' && requestedProperties.queryStrObj.token_id.trim().length === 20 ? requestedProperties.queryStrObj.token_id : false;
    if (token_id) {
        // checks whether the token presents in db or not ....
        read(token_id, 'Tokens', (error, data) => {
            if (!error && data) {
                // token exists in db ...
                deleteFile(token_id, 'Tokens', (err1) => {
                    if (!err1) {
                        callback(200, {
                            msg: 'Your token id has been deleted successfully'
                        });
                    } else {
                        // db error may exists ...
                        callback(500, {
                            error: 'Internal Server Error, Something Went Wrong!!!'
                        });
                    }
                })
            } else {
                // token  does not exists in db ...
                callback(404, {
                    error: 'Delete not possible, Token Id does not exists !!!'
                });
            }
        })
    } else {
        callback(400, {
            error: 'Invalid Token Id!!!'
        });
    }
};

// general purpose function ...
handler._token.verifyToken = (id, phone, callback) => {
    read(id, 'Tokens', (error, data) => {
        if (!error && data) {
            const tokenInfo = { ...parseJSON(data) };
            if (tokenInfo?.phoneNo === phone && tokenInfo?.expires > Date.now()) {
                callback(true);
            } else {
                callback(false);
            }
        } else {
            callback(false);
        }
    })
}

// Exporting the module ...
module.exports = handler;
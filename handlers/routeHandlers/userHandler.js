/* 
* Title: User Handler Module 
* Description: Handling User related routes 
* Name: Prithwijit Banerjee
* Date: 29/05/2024
*/

// Dependencies ...
const { read } = require('../../model/readFileData');
const { hash, parseJSON } = require('../../helpers/utilities');
const { create } = require('../../model/createFileData');
const { update } = require("../../model/updateFileData");
const { deleteFile } = require('../../model/deleteFileData');
// Handler object -- module scaffolding 
const handler = {};

handler.userHandler = (requestedProperties, callback) => {
    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.includes(requestedProperties.method)) {
        handler._user[requestedProperties.method](requestedProperties, callback);
    } else {
        callback(405, {
            error: "Method Not Allowed"
        });
    }
};

// _user private object -- sub module scaffolding 
handler._user = {};


handler._user.get = (requestedProperties, callback) => {
    // get user id from queryString as parameter ...
    const u_id = typeof (requestedProperties.queryStrObj.id) === 'string' && requestedProperties.queryStrObj.id.length === 10 ? requestedProperties.queryStrObj.id : false;

    if (u_id) {
        // fetch user details from db based on above user_id ...
        read(u_id, 'Users', (error, data) => {
            const user = { ...parseJSON(data) }; // shallow copy for first level not deeply nested ...

            //delete user password ...
            delete user.password;
            if (!error && user) {
                // user present in db ...
                callback(200, {
                    status: true,
                    user
                });
            } else {
                // user does not exists ...
                callback(404, {
                    status: false,
                    error: 'User does not exists of given id!!!'
                });
            }
        })
    } else {
        // user does not exists ...
        callback(404, {
            status: false,
            error: 'User does not exists of given id!!!'
        });
    }
};

handler._user.post = (requestedProperties, callback) => {
    if (Object.keys(requestedProperties.body).length === 0 || Object.keys(requestedProperties.body).length > 5) {
        callback(400, {
            error: 'Invalid Client request!!!'
        });
        return;
    }
    // server side validation of user given data ...
    const firstName = typeof (requestedProperties.body.firstName) === 'string' && requestedProperties.body.firstName.trim().length > 0 ? requestedProperties.body.firstName : null;
    const lastName = typeof (requestedProperties.body.lastName) === 'string' && requestedProperties.body.lastName.trim().length > 0 ? requestedProperties.body.lastName : null;
    const phoneNo = typeof (requestedProperties.body.phoneNo) === 'string' && requestedProperties.body.phoneNo.trim().length === 10 ? requestedProperties.body.phoneNo : null;
    const password = typeof (requestedProperties.body.password) === 'string' && requestedProperties.body.password.trim().length > 8 || requestedProperties.body.password.trim().length <= 10 ? requestedProperties.body.password : null;
    const tosAgreement = typeof (requestedProperties.body.tosAgreement) === 'boolean' ? requestedProperties.body.tosAgreement : null;
    if (firstName && lastName && phoneNo && password && tosAgreement) {
        // check whether the corressponding user present in the db or not ...
        read(phoneNo, 'Users', (error, data) => {
            if (error) {
                // user does not exist ...
                const usrObj = {
                    firstName,
                    lastName,
                    phoneNo,
                    password: hash(password),
                    tosAgreement
                }
                // save the above user to db ...
                create(phoneNo, 'Users', usrObj, (error) => {
                    if (!error) {
                        callback(201, {
                            message: "user created successfully!"
                        });
                    } else {
                        callback(500, {
                            error
                        });
                    }
                })
            } else {
                // user exists ...
                callback(500, {
                    error: "There was a problem in server side, User already exists!!!"
                });
            }
        })
    } else {
        callback(400, {
            error: 'Invalid Client request!!!'
        });
    }
};

handler._user.put = (requestedProperties, callback) => {
    if (Object.keys(requestedProperties.body).length === 0 || Object.keys(requestedProperties.body).length > 5) {
        callback(400, {
            error: 'Invalid Client request!!!'
        });
        return;
    }
    // get user phone number from body as payload ...
    const phoneNo = typeof (requestedProperties.body.phoneNo) === 'string' && requestedProperties.body.phoneNo.length === 10 ? requestedProperties.body.phoneNo : false;
    if (phoneNo) {
        // server side validation of user given data ...
        const updatedFirstName = typeof (requestedProperties.body.firstName) === 'string' && requestedProperties.body.firstName.trim().length > 0 ? requestedProperties.body.firstName : null;
        const updatedLastName = typeof (requestedProperties.body.lastName) === 'string' && requestedProperties.body.lastName.trim().length > 0 ? requestedProperties.body.lastName : null;
        const updatedPassword = typeof (requestedProperties.body.password) === 'string' && requestedProperties.body.password.trim().length > 8 || requestedProperties.body.password.trim().length <= 10 ? requestedProperties.body.password : null;

        if (updatedFirstName || updatedLastName || updatedPassword) {
            // check whether the user exists in db or not ...
            read(phoneNo, 'Users', (error, data) => {
                const usrData = Object.assign({}, parseJSON(data)); // perform shallow copy ...
                if (!error && usrData) {
                    // user of corresponding phone number exists ...

                    if (updatedFirstName) {
                        usrData.firstName = updatedFirstName;
                    }
                    if (updatedLastName) {
                        usrData.lastName = updatedLastName;
                    }
                    if (updatedPassword) {
                        usrData.password = hash(updatedPassword);
                    }

                    // update user details in the db ...
                    update(phoneNo, 'Users', usrData, (error) => {
                        if (!error) {
                            callback(400, {
                                update: true,
                                message: 'user updates successfully!!!'
                            });
                        } else {
                            callback(500, {
                                update: false,
                                error: 'Internal Server Error, Something went wrong in server!!!'
                            });
                        }
                    });
                } else {
                    callback(404, {
                        update: false,
                        error: 'can not update, user of given phone number does not exists!!!'
                    });
                }
            })
        } else {
            callback(400, {
                update: false,
                error: 'can not update, you have problem in your request!!!'
            });
        }
    } else {
        callback(400, {
            update: false,
            error: 'can not update, invalid phone number!!!'
        });
    }
};

handler._user.delete = (requestedProperties, callback) => {
    // get user id from queryString as parameter ...
    const u_id = typeof (requestedProperties.queryStrObj.id) === 'string' && requestedProperties.queryStrObj.id.length === 10 ? requestedProperties.queryStrObj.id : false;

    if (u_id) {
        // checks whether the user exists in db or not for delete ...
        read(u_id, 'Users', (error, data) => {
            if (!error && data) {
                // users exists and delete user from db ...
                deleteFile(u_id, 'Users', (error1) => {
                    if (!error1) {
                        callback(200, {
                            delete: true,
                            message: "User of given phone number has been deleted successfully!!!"
                        })
                    } else {
                        callback(500, {
                            delete: false,
                            error: 'Internal Server Error, Something Went Wrong in Server!!!'
                        });
                    }
                })

            } else {
                // user does not exists ...
                callback(404, {
                    delete: false,
                    error: 'Can not delete, Given user phone number does not exists'
                });
            }
        })
    } else {
        // invalid user phone number ...
        callback(400, {
            delete: false,
            error: 'Can not delete, Invalid user phone number'
        });
    }

};



// Exporting the module ...
module.exports = handler;
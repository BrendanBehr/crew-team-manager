'use strict';

const Promise = require('bluebird');
const firebaseFunctions = require('firebase-functions');
const firebaseAdmin = require('firebase-admin');
const crypto = require('crypto');

let database;

const getDatabase = () => {

    if (!database) {

        const defaultApp = firebaseAdmin.apps.filter((app) => {
            return app.name == '[DEFAULT]';
        })[0] || null;

        if (!defaultApp) {

            const privateKey = firebaseFunctions.config().service_account.private_key.replace(/\\n/g, '\n');
            const serviceAccount = {
                projectId: firebaseFunctions.config().service_account.project_id,
                clientEmail: firebaseFunctions.config().service_account.client_email,
                privateKey: privateKey
            };

            firebaseAdmin.initializeApp({
                credential: firebaseAdmin.credential.cert(serviceAccount),
                databaseURL: firebaseFunctions.config().firebase.databaseURL
            });

        }
        database = firebaseAdmin.database();

    }

    return database;

};

const getBasicAuthenticationUsername = (getBasicAuthenticationCredentialsPromise) => {
    return new Promise((resolve, reject) => {

        return getBasicAuthenticationCredentialsPromise
            .then((basicAuthenticationCredentials) => {

                const basicAuthenticationUsername = basicAuthenticationCredentials.split(':')[0] || null;
                return resolve(basicAuthenticationUsername);

            })
            .catch(reject);

    });
};

const getBasicAuthenticationPassword = (getBasicAuthenticationCredentialsPromise) => {
    return new Promise((resolve, reject) => {

        return getBasicAuthenticationCredentialsPromise
            .then((basicAuthenticationCredentials) => {

                const basicAuthenticationPassword = basicAuthenticationCredentials.split(':')[1] || null;
                return resolve(basicAuthenticationPassword);

            })
            .catch(reject);

    });
};

const getBasicAuthenticationCredentials = (getAuthorizationTypePromise, getAuthorizationCredentialsPromise) => {
    return new Promise((resolve, reject) => {

        return Promise.all([
                getAuthorizationTypePromise,
                getAuthorizationCredentialsPromise
            ])
            .spread((authorizationType, authorizationCredentials) => {

                if (authorizationType != 'Basic') {
                    const err = new Error('Authoriation type invalid');
                    err.name = 'UnauthorizedError';
                    err.error = 'authorization-invalid';
                    return reject(err);
                }

                if (!authorizationCredentials) {
                    const err = new Error('Authoriation credentials required');
                    err.name = 'UnauthorizedError';
                    err.error = 'authorization-invalid';
                    return reject(err);
                }

                const basicAuthenticationCredentials = (new Buffer(authorizationCredentials, 'base64')).toString('ascii');
                return resolve(basicAuthenticationCredentials);

            })
            .catch(reject);

    });
};

const getAuthorizationCredentials = (getAuthorizationPromise) => {
    return new Promise((resolve, reject) => {

        return getAuthorizationPromise
            .then((authorization) => {

                if (!authorization) {
                    const err = new Error('Authorization required');
                    err.name = 'UnauthorizedError';
                    err.error = 'authorization-required';
                    return reject(err);
                }

                const authorizationCredentials = authorization.split(' ')[1] || null;
                return resolve(authorizationCredentials);

            })
            .catch(reject);

    });
};

const getAuthorizationType = (getAuthorizationPromise) => {
    return new Promise((resolve, reject) => {

        return getAuthorizationPromise
            .then((authorization) => {

                if (!authorization) {
                    const err = new Error('Authorization required');
                    err.name = 'UnauthorizedError';
                    err.error = 'authorization-required';
                    return reject(err);
                }

                const authorizationType = authorization.split(' ')[0] || null;
                return resolve(authorizationType);

            })
            .catch(reject);

    });
};

const getAuthorization = (request) => {
    return new Promise((resolve, reject) => {
        const authorization = request.get('authorization') || null;
        return resolve(authorization);
    });
};

const getBasicAuthentication = (request) => {
    return new Promise((resolve, reject) => {

        const getAuthorizationPromise = getAuthorization(request);
        const getAuthorizationTypePromise = getAuthorizationType(getAuthorizationPromise);
        const getAuthorizationCredentialsPromise = getAuthorizationCredentials(getAuthorizationPromise);
        const getBasicAuthenticationCredentialsPromise = getBasicAuthenticationCredentials(getAuthorizationTypePromise, getAuthorizationCredentialsPromise);
        const getBasicAuthenticationUsernamePromise = getBasicAuthenticationUsername(getBasicAuthenticationCredentialsPromise);
        const getBasicAuthenticationPasswordPromise = getBasicAuthenticationPassword(getBasicAuthenticationCredentialsPromise);

        return Promise.all([
                getBasicAuthenticationUsernamePromise,
                getBasicAuthenticationPasswordPromise
            ])
            .spread((basicAuthenticationUsername, basicAuthenticationPassword) => {


                const basicAuthentication = {
                    username: basicAuthenticationUsername
                };

                if (basicAuthenticationPassword) {
                    basicAuthentication.password = basicAuthenticationPassword;
                }

                return resolve(basicAuthentication);

            })
            .catch(reject);

    });
};

const getAuthenticationEntity = (getAuthenticationPromise) => {
    return new Promise((resolve, reject) => {

        return getAuthenticationPromise
            .then((authentication) => {

                if (!authentication) {
                    const err = new Error('Authentication required');
                    err.name = 'UnauthorizedError';
                    err.error = 'authorization-invalid';
                    return reject(err);
                }

                if (!authentication.username) {
                    const err = new Error('Authentication username required');
                    err.name = 'UnauthorizedError';
                    err.error = 'authorization-invalid';
                    return reject(err);
                }

                const authenticationEntity = 'user';
                return resolve(authenticationEntity);

            })
            .catch(reject);

    });
};

const getAuthentication = (request) => {
    return new Promise((resolve, reject) => {

        const getBasicAuthenticationPromise = getBasicAuthentication(request);

        return Promise.any([
                getBasicAuthenticationPromise
            ])
            .then(resolve)
            .catch((err) => {
                return resolve(null);
            });

    });
};

const getEmail = (getAuthenticationPromise) => {
    return new Promise((resolve, reject) => {

        return getAuthenticationPromise
            .then((authentication) => {

                if (!authentication) {
                    const err = new Error('Authentication required');
                    err.name = 'UnauthorizedError';
                    err.error = 'authorization-invalid';
                    return reject(err);
                }

                if (!authentication.username) {
                    const err = new Error('Authentication username required');
                    err.name = 'UnauthorizedError';
                    err.error = 'authorization-invalid';
                    return reject(err);
                }

                return getDatabase().ref('emails').orderByChild('value').equalTo(authentication.username).once('value')
                    .then((emailSnapshot) => {

                        let email = emailSnapshot.val();


                        if (email) {
                            const emailKey = Object.keys(email)[0];
                            email = email[emailKey];
                            email._key = emailKey;
                        }

                        return resolve(email);

                    })
                    .catch(reject);

            })
            .catch(reject);

    });
};

const getUser = (getEmailPromise) => {
    return new Promise((resolve, reject) => {

        return getEmailPromise
            .then((email) => {

                if (!email) {
                    const err = new Error('Email not found');
                    err.name = 'UnauthorizedError';
                    err.error = 'email-not-found';
                    return reject(err);
                }

                if (!email.user) {
                    const err = new Error('Email user required');
                    err.name = 'UnauthorizedError';
                    err.error = 'user-not-found';
                    return reject(err);
                }

                return getDatabase().ref('users/' + email.user).once('value')
                    .then((userSnapshot) => {

                        const user = userSnapshot.val();

                        if (user) {
                            user._key = userSnapshot.key;
                        }

                        return resolve(user);

                    })
                    .catch(reject);

            })
            .catch(reject);

    });
};

const getUserCredential = (getAuthenticationPromise) => {
    return new Promise((resolve, reject) => {

        const getEmailPromise = getEmail(getAuthenticationPromise);

        return getUser(getEmailPromise)
            .then((user) => {

                if (!user) {
                    const err = new Error('User not found');
                    err.name = 'UnauthorizedError';
                    err.error = 'user-not-found';
                    return reject(err);
                }

                if (!user.credential) {
                    const err = new Error('User credential required');
                    err.name = 'UnauthorizedError';
                    err.error = 'credential-not-found';
                    return reject(err);
                }

                if (user.status != 'active') {
                    const err = new Error('User inactive');
                    err.name = 'UnauthorizedError';
                    err.error = 'user-not-active';
                    return reject(err);
                }

                return getDatabase().ref('credentials/' + user.credential).once('value')
                    .then((credentialSnapshot) => {

                        const credential = credentialSnapshot.val();

                        if (credential) {
                            credential._key = credentialSnapshot.key;
                        }

                        return resolve(credential);

                    })
                    .catch(reject);

            })
            .catch(reject);

    });
};

const getHash = (getAuthenticationPromise, getCredentialPromise) => {
    return new Promise((resolve, reject) => {

        return Promise.all([
                getAuthenticationPromise,
                getCredentialPromise
            ])
            .spread((authentication, credential) => {

                if (!authentication) {
                    const err = new Error('Authentication required');
                    err.name = 'UnauthorizedError';
                    err.error = 'authorization-invalid';
                    return reject(err);
                }

                if (!authentication.password) {
                    const err = new Error('Authentication password required');
                    err.name = 'UnauthorizedError';
                    err.error = 'authorization-invalid';
                    return reject(err);
                }

                if (!credential) {
                    const err = new Error('Credential required');
                    err.name = 'UnauthorizedError';
                    err.error = 'credential-not-found';
                    return reject(err);
                }

                if (!credential.salt) {
                    const err = new Error('Credential salt required');
                    err.name = 'UnauthorizedError';
                    err.error = 'credential-not-found';
                    return reject(err);
                }

                let algorithm = 'sha256';

                const hash = crypto.createHash(algorithm);
                hash.update(authentication.password + credential.salt);

                return resolve(hash.digest('hex'));

            })
            .catch(reject);

    });
};

const getCredential = (getAuthenticationPromise, getAuthenticationEntityPromise) => {
    return new Promise((resolve, reject) => {

        return Promise.all([
                getAuthenticationPromise,
                getAuthenticationEntityPromise
            ])
            .spread((authentication, authenticationEntity) => {

                const entities = {
                    user: getUserCredential
                };

                if (!entities[authenticationEntity]) {
                    const err = new Error('Authentication entity invalid');
                    err.name = 'UnauthorizedError';
                    err.error = 'internal-errror';
                    return reject(err);
                }

                return resolve(entities[authenticationEntity](getAuthenticationPromise));

            })
            .catch(reject);

    });
};

const createAuth = (getAuthenticationPromise, getAuthenticationEntityPromise, getCredentialPromise, request) => {
    return new Promise((resolve, reject) => {

        const getHashPromise = getHash(getAuthenticationPromise, getCredentialPromise);

        return Promise.all([
                getAuthenticationPromise,
                getAuthenticationEntityPromise,
                getCredentialPromise,
                getHashPromise
            ])
            .spread((authentication, authenticationEntity, credential, hash) => {

                if (!credential) {
                    const err = new Error('Credential not found');
                    err.name = 'UnauthorizedError';
                    err.error = 'credential-not-found';
                    return reject(err);
                }

                if (!credential.hash) {
                    const err = new Error('Credential hash required');
                    err.name = 'UnauthorizedError';
                    err.error = 'credential-mismatch';
                    return reject(err);
                }

                if (hash != credential.hash) {
                    const err = new Error('Authorization password hash mismatch');
                    err.name = 'UnauthorizedError';
                    err.error = 'credential-mismatch';
                    return reject(err);
                }

                const auth = {
                    status: 'active'
                };

                auth.created = auth.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                auth.ip = request.ip || null;
                auth[authenticationEntity] = credential[authenticationEntity];

                return getDatabase().ref('auths').push(auth)
                    .then((authSnapshot) => {

                        auth._key = authSnapshot.key;
                        return resolve(auth);

                    })
                    .catch(reject);

            })
            .catch(reject);

    });
};

const createToken = (getAuthenticationEntityPromise, getCredentialPromise, createAuthPromise) => {
    return new Promise((resolve, reject) => {

        return Promise.all([
                getAuthenticationEntityPromise,
                getCredentialPromise,
                createAuthPromise
            ])
            .spread((authenticationEntity, credential, auth) => {

                if (!credential[authenticationEntity]) {
                    const err = new Error('Credential ' + authenticationEntity + ' required');
                    err.name = 'InternalError';
                    err.error = 'internal-error';
                    return reject(err);
                }

                const uid = credential[authenticationEntity];

                if (!auth._key) {
                    const err = new Error('Auth key required');
                    err.name = 'InternalError';
                    err.error = 'internal-error';
                    return reject(err);
                }

                const claims = {
                    'auth': auth._key
                };

                return firebaseAdmin.app().auth().createCustomToken(uid, claims)
                    .then(resolve)
                    .catch(reject);

            })
            .catch(reject);

    });
};

const getPostHttp = (request) => {
    return new Promise((resolve, reject) => {

        const getAuthenticationPromise = getAuthentication(request);
        const getAuthenticationEntityPromise = getAuthenticationEntity(getAuthenticationPromise);
        const getCredentialPromise = getCredential(getAuthenticationPromise, getAuthenticationEntityPromise);
        const createAuthPromise = createAuth(getAuthenticationPromise, getAuthenticationEntityPromise, getCredentialPromise, request);
        const createTokenPromise = createToken(getAuthenticationEntityPromise, getCredentialPromise, createAuthPromise);

        return Promise.all([
                createAuthPromise,
                createTokenPromise
            ])
            .spread((auth, token) => {

                const http = {};
                http.status = 200;

                http.headers = {};
                http.headers['X-Firebase-Custom-Token'] = token;
                http.headers['Content-Type'] = 'application/json';

                http.body = JSON.stringify({
                    name: auth._key
                });

                return resolve(http);

            })
            .catch(reject);

    });
};

const getOptionsHttp = (request) => {
    return new Promise((resolve, reject) => {

        const http = {};

        http.status = 200;

        http.headers = {};

        http.headers['access-control-allow-methods'] = Object.keys(methodHandlers).join(', ');
        http.headers['access-control-allow-headers'] = allowedHeaders.join(', ');

        return resolve(http);

    });
};

const methodHandlers = {
    'POST': getPostHttp,
    'OPTIONS': getOptionsHttp
};

const allowedHeaders = [
    'Authorization'
];

let exposedHeaders = [
    'X-Firebase-Custom-Token',
    'x-labor-sync-error',
    'content-type'
];

const getMethodHttp = (method, request) => {
    return new Promise((resolve, reject) => {

        if (!methodHandlers[method]) {
            const err = new Error('Invalid request method ' + method);
            err.name = 'NotFoundError';
            err.error = 'method-invalid';
            return reject(err);
        }

        return methodHandlers[method](request)
            .then(resolve)
            .catch(reject);

    });
};

const getHttp = (request) => {
    return new Promise((resolve, reject) => {

        if (!request.method) {
            const err = new Error('Request method required');
            err.name = 'NotFoundError';
            err.error = 'method-invalid';
            return reject(err);
        }

        const method = request.method.toUpperCase();

        return getMethodHttp(method, request)
            .then(resolve)
            .catch(reject);

    });
};

const sendResponse = (http, request, response) => {
    return new Promise((resolve) => {

        http = http || {};

        http.headers = http.headers || {};

        if (firebaseFunctions.config().cors && firebaseFunctions.config().cors.access_control_allow_origins) {
            const allowOrigins = firebaseFunctions.config().cors.access_control_allow_origins.split(', ');
            http.headers['access-control-allow-origin'] = allowOrigins[allowOrigins.indexOf(request.get('Origin'))] || allowOrigins[0];
        }

        http.headers['access-control-max-age'] = -1;

        const exposeHeaders = exposedHeaders.filter((exposeHeader) => {
            return http.headers[exposeHeader];
        });

        if (exposeHeaders.length) {
            http.headers['access-control-expose-headers'] = exposeHeaders.join(', ');
        }

        http.headers['access-control-allow-credentials'] = 'true';

        http.status = http.status || 500;
        http.body = http.body || '';

        response.set(http.headers);
        response.status(http.status);
        response.send(http.body);

        return resolve(response);

    });
};

const sendErrorResponse = (err, request, response) => {
    return new Promise((resolve) => {

        if (!firebaseFunctions.config().mocha) {
            console.error(err);
        }

        const http = {};

        const names = {};

        names.UnauthorizedError = {
            status: 401
        };

        names.NotFoundError = {
            status: 404
        };

        if (names[err.name]) {
            http.status = names[err.name].status || http.status;
            http.body = names[err.name].body || http.body;
            if (err.error) {
                http.headers = {
                    'x-labor-sync-error': err.error
                };
            }
        }

        return sendResponse(http, request, response)
            .then(resolve);

    });

};

const handleRequest = (request, response) => {
    return new Promise((resolve, reject) => {

        return getHttp(request)
            .then((http) => {
                return sendResponse(http, request, response)
                    .then(resolve);
            })
            .catch((err) => {
                return sendErrorResponse(err, request, response)
                    .then(resolve);
            });

    });
};

module.exports = firebaseFunctions.https.onRequest(handleRequest);
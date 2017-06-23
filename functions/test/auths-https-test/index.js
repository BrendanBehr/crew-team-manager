/* globals describe: function, it: function, before: function, beforeEach: function, after: function */

require('dotenv').config({
    path: __dirname + '/../../.env'
});

const Generator = require('../../../src/generator/index.js');
const bodyParser = require('body-parser');
const chai = require('chai');
const express = require('express');
const faker = require('faker');
const firebaseAdmin = require('firebase-admin');
const firebaseFunctions = require('firebase-functions');
const proxyquire = require('proxyquire');
const request = require('request');
const sinon = require('sinon');

chai.use(require('chai-as-promised'));
chai.use(require('chai-string'));
const assert = chai.assert;
const app = express();

console.warn = () => {};

describe('auths-https', () => {

    const generator = new Generator();

    const team1 = generator.createTeam();

    const team1User1 = team1.createUser();
    const team1User1Email1 = team1User1.createEmail({
        user: null
    });
    const team1User1Email2 = team1User1.createEmail({
        user: faker.random.uuid()
    });
    // const team1User1Email3 = team1User1.createEmail();
    // const team1User1Password = faker.internet.password();

    const team1User1Email3 = team1User1.createEmail();
    const team1User1Credential = team1User1.createCredential();
    team1User1Credential.setPassword(faker.internet.password());
    const team1User1Password = team1User1Credential.getPassword();

    const team1User2 = team1.createUser({
        credential: faker.random.uuid()
    });
    // const team1User2Email1 = team1User2.createEmail();
    // const team1User2Password = faker.internet.password();

    const team1User2Email1 = team1User2.createEmail();
    const team1User2Credential = team1User2.createCredential();
    team1User2Credential.setPassword(faker.internet.password());
    const team1User2Password = team1User2Credential.getPassword();

    const team1User3 = team1.createUser({
        status: 'pending'
    });
    const team1User3Email1 = team1User3.createEmail();
    const team1User3Password = faker.internet.password();
    const team1User3Credential = team1User3.createCredential();
    team1User3Credential.setPassword(team1User3Password);
    team1User3.setCredential(team1User3Credential);

    const team1User4 = team1.createUser({
        status: 'archived'
    });
    const team1User4Email1 = team1User4.createEmail();
    const team1User4Password = faker.internet.password();
    const team1User4Credential = team1User4.createCredential();
    team1User4Credential.setPassword(team1User4Password);
    team1User4.setCredential(team1User4Credential);

    const team1User5 = team1.createUser({
        status: 'deleted'
    });
    const team1User5Email1 = team1User5.createEmail();
    const team1User5Password = faker.internet.password();
    const team1User5Credential = team1User5.createCredential();
    team1User5Credential.setPassword(team1User5Password);
    team1User5.setCredential(team1User5Credential);

    const team1User6 = team1.createUser();
    const team1User6Email1 = team1User6.createEmail();
    const team1User6Password = faker.internet.password();
    const team1User6Credential = team1User6.createCredential();
    team1User6Credential.setPassword(team1User6Password);
    team1User6.setCredential(team1User6Credential);

    const host = 'http://localhost';
    const port = 8080;
    const uri = host + ':' + port;

    let server;

    let testApp;

    before((done) => {

        app.use(bodyParser.json());

        const serviceAccount = {
            project_id: process.env.FIREBASE_PROJECT_ID,
            client_email: process.env.FIREBASE_CLIENT_EMAIL,
            private_key: process.env.FIREBASE_PRIVATE_KEY
        };

        const databaseURL = process.env.FIREBASE_DATABASE_URL;

        const configStub = sinon.stub(firebaseFunctions, 'config').returns({
            firebase: {
                databaseURL: databaseURL
            },
            service_account: serviceAccount,
            cors: {
                access_control_allow_origin: uri
            },
            mocha: true
        });

        const stubs = {
            'firebase-functions': {
                'config': configStub
            }
        };

        const authsHttps = proxyquire(__dirname + '/../../../functions/auths-https', stubs);
        app.all('*', authsHttps);

        const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
        testApp = firebaseAdmin.initializeApp({
            credential: firebaseAdmin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: privateKey
            }),
            databaseURL: databaseURL,
        });

        server = app.listen(port, () => {
            done();
        });

    });

    beforeEach((done) => {
        testApp.database().ref().set(generator.getData())
            .then((snapshot) => {
                done();
            });
    });

    describe('HTTP request', () => {

        describe('using method GET', () => {

            const method = 'GET';

            describe('should return 404', () => {

                const statusCode = 404;

                it('when any request', (done) => {

                    request({
                            uri: uri,
                            method: method
                        },
                        (err, response, body) => {
                            assert.isNull(err);
                            assert.equal(response.statusCode, statusCode);
                            done();
                        });

                });

            });

        });

        describe('using method PUT', () => {

            const method = 'PUT';

            describe('should return 404', () => {

                const statusCode = 404;

                it('when any request', (done) => {

                    request({
                            uri: uri,
                            method: method
                        },
                        (err, response, body) => {
                            assert.isNull(err);
                            assert.equal(response.statusCode, statusCode);
                            done();
                        });

                });

            });

        });

        describe('using method POST', () => {

            const method = 'POST';

            describe('should return 401', () => {

                const statusCode = 401;

                it('when no `Authorization` header is provided', (done) => {

                    request({
                            uri: uri,
                            method: method
                        },
                        (err, response, body) => {
                            assert.isNull(err);
                            assert.equal(response.statusCode, statusCode);
                            assert.property(response, 'headers');
                            assert.property(response.headers, 'access-control-allow-origin');
                            assert.equal(response.headers['access-control-allow-origin'], uri);
                            done();
                        });

                });

                it('when `Authorization` header is not type `Basic`', (done) => {

                    const authorization = new Buffer('Invalid ' + team1User1Email1.getValues().value + ':' + team1User1Password).toString('base64');

                    request({
                            uri: uri,
                            method: method,
                            headers: {
                                'Authorization': authorization
                            }
                        },
                        (err, response, body) => {
                            assert.isNull(err);
                            assert.equal(response.statusCode, statusCode);
                            assert.property(response, 'headers');
                            assert.property(response.headers, 'access-control-allow-origin');
                            assert.equal(response.headers['access-control-allow-origin'], uri);
                            done();
                        });

                });

                it('when `Authorization` with `email` as `username` is found without `user`', (done) => {

                    const authorization = 'Basic ' + new Buffer(team1User1Email1.getValues().value + ':' + team1User1Password).toString('base64');

                    request({
                            uri: uri,
                            method: method,
                            headers: {
                                'Authorization': authorization
                            }
                        },
                        (err, response, body) => {
                            assert.isNull(err);
                            assert.equal(response.statusCode, statusCode);
                            assert.property(response, 'headers');
                            assert.property(response.headers, 'access-control-allow-origin');
                            assert.equal(response.headers['access-control-allow-origin'], uri);
                            done();
                        });

                });

                it('when `Authorization` with `email` as `username` is found and `user` is not in database', (done) => {

                    const authorization = 'Basic ' + new Buffer(team1User1Email2.getValues().value + ':' + team1User1Password).toString('base64');

                    request({
                            uri: uri,
                            method: method,
                            headers: {
                                'Authorization': authorization
                            }
                        },
                        (err, response, body) => {
                            assert.isNull(err);
                            assert.equal(response.statusCode, statusCode);
                            assert.property(response, 'headers');
                            assert.property(response.headers, 'access-control-allow-origin');
                            assert.equal(response.headers['access-control-allow-origin'], uri);
                            done();
                        });

                });

                it('when `Authorization` with `email` as `username` and `user` is found without credential', (done) => {

                    const authorization = 'Basic ' + new Buffer(team1User1Email3.getValues().value + ':' + team1User1Password).toString('base64');

                    request({
                            uri: uri,
                            method: method,
                            headers: {
                                'Authorization': authorization
                            }
                        },
                        (err, response, body) => {
                            assert.isNull(err);
                            assert.equal(response.statusCode, statusCode);
                            assert.property(response, 'headers');
                            assert.property(response.headers, 'access-control-allow-origin');
                            assert.equal(response.headers['access-control-allow-origin'], uri);
                            done();
                        });

                });

                it('when `Authorization` with `email` as `username` and `credential` for `user` is not found in database', (done) => {

                    const authorization = 'Basic ' + new Buffer(team1User2Email1.getValues().value + ':' + team1User2Password).toString('base64');

                    request({
                            uri: uri,
                            method: method,
                            headers: {
                                'Authorization': authorization
                            }
                        },
                        (err, response, body) => {
                            assert.isNull(err);
                            assert.equal(response.statusCode, statusCode);
                            assert.property(response, 'headers');
                            assert.property(response.headers, 'access-control-allow-origin');
                            assert.equal(response.headers['access-control-allow-origin'], uri);
                            done();
                        });

                });

                it('when `Authorization` with `email` as `username` with incorrect `password`', (done) => {

                    const authorization = 'Basic ' + new Buffer(team1User6Email1.getValues().value + ':' + team1User6Password + '-wrong-password').toString('base64');

                    request({
                            uri: uri,
                            method: method,
                            headers: {
                                'Authorization': authorization
                            }
                        },
                        (err, response, body) => {
                            assert.isNull(err);
                            assert.equal(response.statusCode, statusCode);
                            assert.property(response, 'headers');
                            assert.property(response.headers, 'access-control-allow-origin');
                            assert.equal(response.headers['access-control-allow-origin'], uri);
                            done();
                        });

                });

                it('when `Authorization` with `email` as `username` with correct `password` when `user` is `pending`', (done) => {

                    const authorization = 'Basic ' + new Buffer(team1User3Email1.getValues().value + ':' + team1User3Password).toString('base64');

                    request({
                            uri: uri,
                            method: method,
                            headers: {
                                'Authorization': authorization
                            }
                        },
                        (err, response, body) => {
                            assert.isNull(err);
                            assert.equal(response.statusCode, statusCode);
                            assert.property(response, 'headers');
                            assert.property(response.headers, 'access-control-allow-origin');
                            assert.equal(response.headers['access-control-allow-origin'], uri);
                            done();
                        });

                });

                it('when `Authorization` with `email` as `username` with correct `password` when `user` is `archived`', (done) => {

                    const authorization = 'Basic ' + new Buffer(team1User4Email1.getValues().value + ':' + team1User4Password).toString('base64');

                    request({
                            uri: uri,
                            method: method,
                            headers: {
                                'Authorization': authorization
                            }
                        },
                        (err, response, body) => {
                            assert.isNull(err);
                            assert.equal(response.statusCode, statusCode);
                            assert.property(response, 'headers');
                            assert.property(response.headers, 'access-control-allow-origin');
                            assert.equal(response.headers['access-control-allow-origin'], uri);
                            done();
                        });

                });

                it('when `Authorization` with `email` as `username` with correct `password` when `user` is `deleted`', (done) => {

                    const authorization = 'Basic ' + new Buffer(team1User5Email1.getValues().value + ':' + team1User5Password).toString('base64');

                    request({
                            uri: uri,
                            method: method,
                            headers: {
                                'Authorization': authorization
                            }
                        },
                        (err, response, body) => {
                            assert.isNull(err);
                            assert.equal(response.statusCode, statusCode);
                            assert.property(response, 'headers');
                            assert.property(response.headers, 'access-control-allow-origin');
                            assert.equal(response.headers['access-control-allow-origin'], uri);
                            done();
                        });

                });

            });

            describe('should return 200', () => {

                const statusCode = 200;

                it.only('when `Authorization` with `email` as `username` with correct `password` when `user` is `active`', (done) => {

                    const authorization = 'Basic ' + new Buffer(team1User6Email1.getValues().value + ':' + team1User6Password).toString('base64');

                    request({
                            uri: uri,
                            method: method,
                            headers: {
                                'Authorization': authorization
                            }
                        },
                        (err, response, body) => {
                            assert.isNull(err);
                            assert.equal(response.statusCode, statusCode);
                            assert.property(response, 'headers');
                            assert.property(response.headers, 'x-firebase-custom-token');
                            assert.property(response.headers, 'content-type');
                            assert.startsWith(response.headers['content-type'], 'application/json');
                            assert.property(response.headers, 'access-control-allow-origin');
                            assert.equal(response.headers['access-control-allow-origin'], uri);
                            done();
                        });

                });

            });

        });

        describe('using method PATCH', () => {

            const method = 'PATCH';

            describe('should return 404', () => {

                const statusCode = 404;

                it('when any request', (done) => {

                    request({
                            uri: uri,
                            method: method
                        },
                        (err, response, body) => {
                            assert.isNull(err);
                            assert.equal(response.statusCode, statusCode);
                            done();
                        });

                });

            });

        });

        describe('using method DELETE', () => {

            const method = 'DELETE';

            describe('should return 404', () => {

                const statusCode = 404;

                it('when any request', (done) => {

                    request({
                            uri: uri,
                            method: method
                        },
                        (err, response, body) => {
                            assert.isNull(err);
                            assert.equal(response.statusCode, statusCode);
                            done();
                        });

                });

            });

        });

    });

    after((done) => {
        server.close();
        firebaseFunctions.config.restore();
        firebaseAdmin.app().delete()
            .then(done);
    });

});
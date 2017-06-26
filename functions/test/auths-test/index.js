/* globals describe: function, it: function, beforeEach: function, before: function, after: function */

const firebaseAdmin = require('firebase-admin');
const assert = require('../assert-for-rules/assert-for-rules.js');
const faker = require('faker');
const Generator = require('../../../src/generator/index.js');

require('dotenv').config({
    path: process.cwd() + '/../../.env'
});

// console.warn = function () {}; // Disables warnings from firebaseAdmin

describe('Auths', function () {



    const generator = new Generator();

    const team1 = generator.createTeam();

    const team1User1 = team1.createUser();
    const team1User1Auth1 = team1User1.createAuth();
    const team1User1Auth2 = team1User1.createAuth({
        status: 'expired'
    });
    const team1User1Auth3 = team1User1.createAuth({
        status: 'expired'
    });
    const team1User1Auth4 = team1User1.createAuth();

    const team1User2 = team1.createUser();
    const team1User2Auth1 = team1User2.createAuth();
    const team1User2Auth2 = team1User2.createAuth({
        status: 'expired'
    });

    before(function () {

        const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
        const databaseURL = process.env.FIREBASE_DATABASE_URL;

        firebaseAdmin.initializeApp({
            credential: firebaseAdmin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: privateKey
            }),
            databaseURL: databaseURL,
        }, 'generator');

        firebaseAdmin.initializeApp({
            credential: firebaseAdmin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: privateKey
            }),
            databaseURL: databaseURL,
            databaseAuthVariableOverride: {}
        }, 'anonymous');

        firebaseAdmin.initializeApp({
            credential: firebaseAdmin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: privateKey
            }),
            databaseURL: databaseURL,
            databaseAuthVariableOverride: {
                auth: team1User1Auth1.getPathKey()
            }
        }, 'team1User1Auth1');

        firebaseAdmin.initializeApp({
            credential: firebaseAdmin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: privateKey
            }),
            databaseURL: databaseURL,
            databaseAuthVariableOverride: {
                auth: team1User1Auth2.getPathKey()
            }
        }, 'team1User1Auth2');

    });

    describe('read request', function () {

        before(function () {

            return firebaseAdmin.app('generator').database().ref().set(generator.getData());

        });

        describe('as anonymous', function () {

            const appName = 'anonymous';
            let path;

            beforeEach(function () {

                path = 'auths/' + team1User1Auth1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing own auth (team1User1Auth1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'auths/' + team1User1Auth1.getPathKey();

            });

            it('should read', function (done) {

                assert.canRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing another users active auth (team1User2Auth1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'auths/' + team1User2Auth1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing another users inactive auth (team1User2Auth2)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'auths/' + team1User2Auth2.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing own active auth (team1User1Auth4)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'auths/' + team1User1Auth4.getPathKey();

            });

            it('should read', function (done) {

                assert.canRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing own inactive auth (team1User1Auth2)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'auths/' + team1User1Auth2.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with inactive auth (team1User1Auth2) accessing same auth (team1User1Auth2)', function () {

            const appName = 'team1User1Auth2';
            let path;

            beforeEach(function () {

                path = 'auths/' + team1User1Auth2.getPathKey();

            });

            it('should read', function (done) {

                assert.canRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with inactive auth (team1User1Auth2) accessing another users active auth (team1User1Auth1)', function () {

            const appName = 'team1User1Auth2';
            let path;

            beforeEach(function () {

                path = 'auths/' + team1User1Auth1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with inactive auth (team1User1Auth2) accessing another users inactive auth (team1User1Auth3)', function () {

            const appName = 'team1User1Auth2';
            let path;

            beforeEach(function () {

                path = 'auths/' + team1User1Auth3.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with inactive auth (team1User1Auth2) accessing own active auth (team1User1Auth4)', function () {

            const appName = 'team1User1Auth2';
            let path;

            beforeEach(function () {

                path = 'auths/' + team1User1Auth4.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with inactive auth (team1User1Auth2) accessing own inactive auth (team1User1Auth3)', function () {

            const appName = 'team1User1Auth2';
            let path;

            beforeEach(function () {

                path = 'auths/' + team1User1Auth3.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });
    });



    describe('write request', function () {

        beforeEach(function () {

            return firebaseAdmin.app('generator').database().ref().set(generator.getData());

        });

        describe('as anonymous', function () {

            const appName = 'anonymous';
            let path;
            let auth;

            beforeEach(function () {

                path = 'auths/' + team1User1Auth1.getPathKey();
                auth = team1User1Auth1.getValues({
                    reference: false
                });
                auth.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

            });

            it('should not write', function (done) {

                assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing individual keys of an auth (team1User1Auth4)', function () {

            const appName = 'team1User1Auth1';

            let path;
            const auth = team1User1Auth4.getValues({
                reference: false
            });
            auth.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
            const authKeys = Object.keys(auth);

            beforeEach(function () {

                path = 'auths/' + team1User1Auth4.getPathKey();

            });

            for (let x = 0; x < authKeys.length; x++) {

                if (authKeys[x] === 'updated') {
                    continue;
                }

                it('should not write directly to `' + authKeys[x] + '`', function (done) {

                    const value = auth[authKeys[x]];
                    path = path + '/' + authKeys[x];

                    assert.cannotSet(firebaseAdmin.app(appName), path, value, done);

                });

            }

            it('should not write directly to `_invalid`', function (done) {

                const value = faker.random.words();
                path = path + '/_invalid';

                assert.cannotSet(firebaseAdmin.app(appName), path, value, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) updating individual values of an auth (team1User1Auth4)', function () {

            const appName = 'team1User1Auth1';

            const path = 'auths/' + team1User1Auth4.getPathKey();
            const auth = team1User1Auth4.getValues({
                reference: false
            });
            const authKeys = Object.keys(auth);

            for (let x = 0; x < authKeys.length; x++) {

                if (authKeys[x] === 'updated') {
                    continue;
                }

                it('should update `' + authKeys[x] + '` with prior data and an updated timestamp', function (done) {

                    const value = {};
                    value[authKeys[x]] = auth[authKeys[x]];
                    value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                    assert.canUpdate(firebaseAdmin.app(appName), path, value, done);

                });

            }

            for (let x = 0; x < authKeys.length; x++) {

                if (authKeys[x] === 'updated') {
                    continue;
                }

                it('should not update `' + authKeys[x] + '` with prior data', function (done) {

                    const value = {};
                    value[authKeys[x]] = auth[authKeys[x]];

                    assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                });

            }

            it('should not update `_invalid`', function (done) {

                const value = {};
                value._invalid = faker.random.words();
                value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) setting auth of another user (team1User2Auth1)', function () {

            const appName = 'team1User1Auth1';
            let path;
            let auth;

            beforeEach(function () {

                path = 'auths/' + team1User2Auth1.getPathKey();
                auth = team1User2Auth1.getValues({
                    reference: false
                });
                auth.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

            });

            it('should not write', function (done) {

                assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) creating new user active auth', function () {

            const appName = 'team1User1Auth1';
            let path;
            let auth;

            beforeEach(function () {

                path = 'auths/';
                auth = team1User1Auth1.getValues({
                    reference: false
                });
                auth.created = firebaseAdmin.database.ServerValue.TIMESTAMP;
                auth.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

            });

            it('should not create new auth', function (done) {

                assert.cannotPush(firebaseAdmin.app(appName), path, auth, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) creating new user inactive auth', function () {

            const appName = 'team1User1Auth1';
            let path;
            let auth;

            beforeEach(function () {

                path = 'auths/';
                auth = team1User1Auth2.getValues({
                    reference: false
                });
                auth.created = firebaseAdmin.database.ServerValue.TIMESTAMP;
                auth.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

            });

            it('should not create new auth', function (done) {

                assert.cannotPush(firebaseAdmin.app(appName), path, auth, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) set values of same auth (team1User1Auth1)', function () {

            const appName = 'team1User1Auth1';
            let path;
            let auth;

            beforeEach(function () {

                path = 'auths/' + team1User1Auth1.getPathKey();
                auth = team1User1Auth1.getValues({
                    reference: false
                });
                auth.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

            });

            it('should write, valid prior data', function (done) {

                assert.canSet(firebaseAdmin.app(appName), path, auth, done);

            });

            it('should not write empty auth', function (done) {

                auth = {};
                assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

            });

            it('should not write null auth', function (done) {

                auth = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

            });

            it('should not write current time to created', function (done) {

                auth.created = firebaseAdmin.database.ServerValue.TIMESTAMP;
                assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

            });

            it('should not write null to created', function (done) {

                auth.created = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

            });

            it('should write a different, valid status', function (done) {

                auth.status = 'expired';
                assert.canSet(firebaseAdmin.app(appName), path, auth, done);

            });

            it('should not write null to status', function (done) {

                auth.status = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

            });

            it('should write current time to updated', function (done) {

                auth.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                assert.canSet(firebaseAdmin.app(appName), path, auth, done);

            });

            it('should not write null to updated', function (done) {

                auth.updated = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

            });

            it('should not write another user', function (done) {

                auth.user = team1User2.getPathKey();
                assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

            });

            it('should not write null to user', function (done) {

                auth.user = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

            });

            it('should write String to `ip`', function (done) {

                auth.ip = faker.random.words();
                assert.canSet(firebaseAdmin.app(appName), path, auth, done);

            });

            it('should not write Null to `ip`', function (done) {

                auth.ip = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

            });

            it('should write String to `browser`', function (done) {

                auth.browser = faker.random.words();
                assert.canSet(firebaseAdmin.app(appName), path, auth, done);

            });

            it('should not write Null to `browser`', function (done) {

                auth.browser = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) set values of active auth with same user (team1User1Auth4)', function () {

            const appName = 'team1User1Auth1';
            let path;
            let auth;

            beforeEach(function () {

                path = 'auths/' + team1User1Auth4.getPathKey();
                auth = team1User1Auth4.getValues({
                    reference: false
                });
                auth.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

            });

            it('should write, valid prior data', function (done) {

                assert.canSet(firebaseAdmin.app(appName), path, auth, done);

            });

            it('should not write empty auth', function (done) {

                auth = {};
                assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

            });

            it('should not write null auth', function (done) {

                auth = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

            });

            it('should not write current time to created', function (done) {

                auth.created = firebaseAdmin.database.ServerValue.TIMESTAMP;
                assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

            });

            it('should not write null to created', function (done) {

                auth.created = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

            });

            it('should write a different, valid status', function (done) {

                auth.status = 'expired';
                assert.canSet(firebaseAdmin.app(appName), path, auth, done);

            });

            it('should not write null to status', function (done) {

                auth.status = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

            });

            it('should write current time to updated', function (done) {

                auth.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                assert.canSet(firebaseAdmin.app(appName), path, auth, done);

            });

            it('should not write null to updated', function (done) {

                auth.updated = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

            });

            it('should not write another user', function (done) {

                auth.user = team1User2.getPathKey();
                assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

            });

            it('should not write null to user', function (done) {

                auth.user = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

            });

            it('should write String to `ip`', function (done) {

                auth.ip = faker.random.words();
                assert.canSet(firebaseAdmin.app(appName), path, auth, done);

            });

            it('should not write Null to `ip`', function (done) {

                auth.ip = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

            });

            it('should write String to `browser`', function (done) {

                auth.browser = faker.random.words();
                assert.canSet(firebaseAdmin.app(appName), path, auth, done);

            });

            it('should not write Null to `browser`', function (done) {

                auth.browser = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) set values of inactive auth with same user (team1User1Auth2)', function () {

            const appName = 'team1User1Auth1';
            let path;
            let auth;

            beforeEach(function () {

                path = 'auths/' + team1User1Auth2.getPathKey();
                auth = team1User1Auth2.getValues({
                    reference: false
                });
                auth.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

            });

            it('should not write', function (done) {

                assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

            });

        });

        describe('as user with inactive auth (team1User1Auth2) setting auth of another user (team1User2Auth1)', function () {

            const appName = 'team1User1Auth2';
            let path;
            let auth;

            beforeEach(function () {

                path = 'auths/' + team1User2Auth1.getPathKey();
                auth = team1User2Auth1.getValues({
                    reference: false
                });
                auth.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

            });

            it('should not write', function (done) {

                assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

            });

        });

        describe('as user with inactive auth (team1User1Auth2) creating new user active auth', function () {

            const appName = 'team1User1Auth2';
            let path;
            let auth;

            beforeEach(function () {

                path = 'auths/';
                auth = team1User1Auth1.getValues({
                    reference: false
                });
                auth.created = firebaseAdmin.database.ServerValue.TIMESTAMP;
                auth.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

            });

            it('should not create new auth', function (done) {

                assert.cannotPush(firebaseAdmin.app(appName), path, auth, done);

            });

        });

        describe('as user with inactive auth (team1User1Auth2) creating new user inactive auth', function () {

            const appName = 'team1User1Auth2';
            let path;
            let auth;

            beforeEach(function () {

                path = 'auths/';
                auth = team1User1Auth2.getValues({
                    reference: false
                });
                auth.created = firebaseAdmin.database.ServerValue.TIMESTAMP;
                auth.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

            });

            it('should not create new auth', function (done) {

                assert.cannotPush(firebaseAdmin.app(appName), path, auth, done);

            });

        });

        describe('as user with inactive auth (team1User1Auth2) set values of same auth (team1User1Auth2)', function () {

            const appName = 'team1User1Auth2';
            let path;
            let auth;

            beforeEach(function () {

                path = 'auths/' + team1User1Auth2.getPathKey();
                auth = team1User1Auth2.getValues({
                    reference: false
                });
                auth.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

            });

            it('should not write', function (done) {

                assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

            });

        });

        describe('as user with inactive auth (team1User1Auth2) set values of active auth with same user (team1User1Auth1)', function () {

            const appName = 'team1User1Auth2';
            let path;
            let auth;

            beforeEach(function () {

                path = 'auths/' + team1User1Auth1.getPathKey();
                auth = team1User1Auth1.getValues({
                    reference: false
                });
                auth.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

            });

            it('should not write', function (done) {

                assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

            });

        });

        describe('as user with inactive auth (team1User1Auth2) set values of inactive auth with same user (team1User1Auth3)', function () {

            const appName = 'team1User1Auth2';
            let path;
            let auth;

            beforeEach(function () {

                path = 'auths/' + team1User1Auth3.getPathKey();
                auth = team1User1Auth3.getValues({
                    reference: false
                });
                auth.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

            });

            it('should not write', function (done) {

                assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

            });

        });

    });

    after(function () {

        return firebaseAdmin.app('generator').delete()
            .then(firebaseAdmin.app('anonymous').delete())
            .then(firebaseAdmin.app('team1User1Auth1').delete())
            .then(firebaseAdmin.app('team1User1Auth2').delete());

    });

});
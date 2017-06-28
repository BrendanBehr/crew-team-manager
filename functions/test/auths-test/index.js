/* globals describe: function, it: function, beforeEach: function, before: function, after: function */

const firebaseAdmin = require('firebase-admin');
const assert = require('../assert-for-rules/assert-for-rules.js');
const faker = require('faker');
const Generator = require('../../../src/generator/index.js');

require('dotenv').config({
    path: process.cwd() + '/../../.env'
});

console.warn = function () {}; // Disables warnings from firebaseAdmin

describe('Auths', function () {



    const generator = new Generator();

    const team1 = generator.createTeam();
    const team2 = generator.createTeam();

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

    const team1Athlete1 = team1.createAthlete();
    const team1Athlete2 = team1.createAthlete();
    const team2Athlete1 = team2.createAthlete();

    const team1Boat1 = team1.createBoat();
    const team2Boat1 = team2.createBoat();

    const team1Rigger1 = team1.createRigger();
    const team2Rigger1 = team2.createRigger();

    const team1Erg1 = team1.createErg();
    const team2Erg1 = team2.createErg();

    const team1Finance1 = team1.createFinance();
    const team2Finance1 = team2.createFinance();

    const team1Oar1 = team1.createOar();
    const team2Oar1 = team2.createOar();

    const team1Picture1 = team1.createPicture();
    const team2Picture1 = team2.createPicture();

    const team1Race1 = team1.createRace();
    const team2Race1 = team2.createRace();

    const team1Regatta1 = team1.createRegatta();
    const team2Regatta1 = team2.createRegatta();

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

        describe('as user with active auth (team1User1Auth1) accessing own athlete (team1Athlete1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'athletes/' + team1Athlete1.getPathKey();

            });

            it('should read', function (done) {

                assert.canRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing another teams athletes (team2Athlete1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'athletes/' + team2Athlete1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing own boats (team1Boat1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'boats/' + team1Boat1.getPathKey();

            });

            it('should read', function (done) {

                assert.canRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing another teams boats (team2Boat1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'boats/' + team2Boat1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing riggers (team1Rigger1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'riggers/' + team1Rigger1.getPathKey();

            });

            it('should read', function (done) {

                assert.canRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing another teams riggers (team2Rigger1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'riggers/' + team2Rigger1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing own ergs (team1Erg1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'ergs/' + team1Erg1.getPathKey();

            });

            it('should read', function (done) {

                assert.canRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing another teams ergs (team2Erg1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'ergs/' + team2Erg1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing own finances (team1Finance1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'finances/' + team1Finance1.getPathKey();

            });

            it('should read', function (done) {

                assert.canRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing another teams finances (team2Finance1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'finances/' + team2Finance1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing own oars (team1Oar1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'oars/' + team1Oar1.getPathKey();

            });

            it('should read', function (done) {

                assert.canRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing another teams oars (team2Oar1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'oars/' + team2Oar1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing own pictures (team1Picture1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'pictures/' + team1Picture1.getPathKey();

            });

            it('should read', function (done) {

                assert.canRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing another teams pictures (team2Picture1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'pictures/' + team2Picture1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing own race (team1Race1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'races/' + team1Race1.getPathKey();

            });

            it('should read', function (done) {

                assert.canRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing another teams race (team2Race1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'races/' + team2Race1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing own regatta (team1Regatta1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'regattas/' + team1Regatta1.getPathKey();

            });

            it('should read', function (done) {

                assert.canRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing another teams regatta (team2Regatta1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'regattas/' + team2Regatta1.getPathKey();

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

        describe('as user with active auth (team1User1Auth1) set values of the same teams athlete', function () {
            const appName = 'team1User1Auth1';
            let path;
            let athlete;

            beforeEach(function () {

                path = 'athletes/' + team1Athlete1.getPathKey();
                athlete = team1Athlete1.getValues({
                    reference: false
                });
                athlete.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

            });

            it('should write, valid prior data', function (done) {

                assert.canSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should not write empty athlete', function (done) {

                athlete = {};
                assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should not write null athlete', function (done) {

                athlete = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should not write another teams athlete', function (done) {

                athlete.team = team2Athlete1.getPathKey();
                assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should not write null to team', function (done) {

                athlete.team = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should write a different, valid city', function (done) {

                athlete.city = faker.address.city();
                assert.canSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should not write null to city', function (done) {

                athlete.city = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should write a different, valid credential', function (done) {

                athlete.credential = 'new credential';
                assert.canSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should not write null to credential', function (done) {

                athlete.credential = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should be able to change driver', function (done) {

                athlete.driver = true;
                assert.canSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should not write null to driver', function (done) {

                athlete.driver = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should write String to ergScore', function (done) {

                athlete.ergScore = faker.random.words();
                assert.canSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should not write Null to ergScore', function (done) {

                athlete.ergScore = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should write String to firstName', function (done) {

                athlete.firstName = faker.name.firstName();
                assert.canSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should not write Null to firstName', function (done) {

                athlete.firstName = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should write String to lastName', function (done) {

                athlete.lastName = faker.name.lastName();
                assert.canSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should not write Null to lastName', function (done) {

                athlete.lastName = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should write Number to fundRaising', function (done) {

                athlete.fundRaisng = faker.random.number();
                assert.canSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should not write Null to fundRaisng', function (done) {

                athlete.fundRaisng = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should write String to gender', function (done) {

                athlete.gender = faker.lorem.word();
                assert.canSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should not write Null to gender', function (done) {

                athlete.gender = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should write String to height', function (done) {

                athlete.height = 'tall';
                assert.canSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should not write Null to height', function (done) {

                athlete.height = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should write String to phoneNumber', function (done) {

                athlete.phoneNumber = faker.phone.phoneNumber();
                assert.canSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should not write Null to phoneNumber', function (done) {

                athlete.phoneNumber = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should write String to side', function (done) {

                athlete.side = faker.lorem.word();
                assert.canSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should not write Null to side', function (done) {

                athlete.side = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should write String to state', function (done) {

                athlete.state = faker.address.state();
                assert.canSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should not write Null to state', function (done) {

                athlete.state = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should write String to steetAddress', function (done) {

                athlete.steetAddress = faker.address.streetAddress();
                assert.canSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should not write Null to steetAddress', function (done) {

                athlete.steetAddress = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should write Number to weight', function (done) {

                athlete.weight = faker.random.number();
                assert.canSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should not write Null to weight', function (done) {

                athlete.weight = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should write String to year', function (done) {

                athlete.year = faker.lorem.word();
                assert.canSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should not write Null to year', function (done) {

                athlete.year = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

            });

            it('should not write to another athletes credentials', function (done) {
                athlete.credential = team2Athlete1.credential.getPathKey();
                assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);
            });
        });

        describe('as user with active auth (team1User1Auth1) set values of the same teams boat', function () {
            const appName = 'team1User1Auth1';
            let path;
            let boat;

            beforeEach(function () {

                path = 'boats/' + team1Boat1.getPathKey();
                boat = team1Boat1.getValues({
                    reference: false
                });
                boat.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

            });

            it('should write, valid prior data', function (done) {

                assert.canSet(firebaseAdmin.app(appName), path, boat, done);

            });

            it('should not write empty boat', function (done) {

                boat = {};
                assert.cannotSet(firebaseAdmin.app(appName), path, boat, done);

            });

            it('should not write null boat', function (done) {

                boat = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, boat, done);

            });

            it('should not write another teams boat', function (done) {

                boat.team = team2Boat1.getPathKey();
                assert.cannotSet(firebaseAdmin.app(appName), path, boat, done);

            });

            it('should not write null to team', function (done) {

                boat.team = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, boat, done);

            });

            it('should write a different, valid manufacturer', function (done) {

                boat.manufacturer = faker.lorem.word();
                assert.cantSet(firebaseAdmin.app(appName), path, boat, done);

            });

            it('should not write null to manufacturer', function (done) {

                boat.manufacturer = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, boat, done);

            });

            it('should write a different, valid name', function (done) {

                boat.name = faker.name.lastName();
                assert.canSet(firebaseAdmin.app(appName), path, boat, done);

            });

            it('should not write null to name', function (done) {

                boat.name = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, boat, done);

            });

            it('should be able to change rigging', function (done) {

                boat.rigging = faker.lorem.word();
                assert.canSet(firebaseAdmin.app(appName), path, boat, done);

            });

            it('should not write null to rigging', function (done) {

                boat.rigging = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, boat, done);

            });

            it('should write Number to size', function (done) {

                boat.size = 8;
                assert.canSet(firebaseAdmin.app(appName), path, boat, done);

            });

            it('should not write Null to size', function (done) {

                boat.size = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, boat, done);

            });

            it('should write String to type', function (done) {

                boat.type = faker.lorem.word();
                assert.canSet(firebaseAdmin.app(appName), path, boat, done);

            });

            it('should not write Null to type', function (done) {

                boat.type = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, boat, done);
            });
        });

        describe('as user with active auth (team1User1Auth1) set values of the same teams erg', function () {
            const appName = 'team1User1Auth1';
            let path;
            let erg;

            beforeEach(function () {

                path = 'ergs/' + team1Erg1.getPathKey();
                erg = team1Erg1.getValues({
                    reference: false
                });
                erg.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

            });

            it('should write, valid prior data', function (done) {

                assert.canSet(firebaseAdmin.app(appName), path, erg, done);

            });

            it('should not write empty erg', function (done) {

                erg = {};
                assert.cannotSet(firebaseAdmin.app(appName), path, erg, done);

            });

            it('should not write null erg', function (done) {

                erg = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, erg, done);

            });

            it('should not write another teams erg', function (done) {

                erg.team = team2Erg1.getPathKey();
                assert.cannotSet(firebaseAdmin.app(appName), path, erg, done);

            });

            it('should not write null to team', function (done) {

                erg.team = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, erg, done);

            });

            it('should write a different, valid condition', function (done) {

                erg.condition = faker.lorem.word();
                assert.canSet(firebaseAdmin.app(appName), path, erg, done);

            });

            it('should not write null to condition', function (done) {

                erg.condition = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, erg, done);

            });

            it('should write a different, valid location', function (done) {

                erg.location = faker.name.lastName();
                assert.canSet(firebaseAdmin.app(appName), path, erg, done);

            });

            it('should not write null to location', function (done) {

                erg.location = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, erg, done);

            });

            it('should be able to change model', function (done) {

                erg.model = faker.lorem.word();
                assert.canSet(firebaseAdmin.app(appName), path, erg, done);

            });

            it('should not write null to model', function (done) {

                erg.model = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, erg, done);

            });

            it('should write Number to number', function (done) {

                erg.number = 44;
                assert.canSet(firebaseAdmin.app(appName), path, erg, done);

            });

            it('should not write Null to number', function (done) {

                erg.number = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, erg, done);

            });

            it('should write String to screenType', function (done) {

                erg.screenType = faker.lorem.word();
                assert.canSet(firebaseAdmin.app(appName), path, erg, done);

            });

            it('should not write Null to screenType', function (done) {

                erg.screenType = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, erg, done);
            });
        });

        describe('as user with active auth (team1User1Auth1) set values of the same teams finance', function () {
            const appName = 'team1User1Auth1';
            let path;
            let finance;

            beforeEach(function () {

                path = 'finances/' + team1Finance1.getPathKey();
                finance = team1Finance1.getValues({
                    reference: false
                });
                finance.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

            });

            it('should write, valid prior data', function (done) {

                assert.canSet(firebaseAdmin.app(appName), path, finance, done);

            });

            it('should not write empty finance', function (done) {

                finance = {};
                assert.cannotSet(firebaseAdmin.app(appName), path, finance, done);

            });

            it('should not write null finance', function (done) {

                finance = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, finance, done);

            });

            it('should not write another teams finance', function (done) {

                finance.team = team2Finance1.getPathKey();
                assert.cannotSet(firebaseAdmin.app(appName), path, finance, done);

            });

            it('should not write null to team', function (done) {

                finance.team = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, finance, done);

            });

            it('should write Number to valid expences', function (done) {

                finance.expences = faker.random.number();
                assert.canSet(firebaseAdmin.app(appName), path, finance, done);

            });

            it('should not write null to expences', function (done) {

                finance.expences = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, finance, done);

            });

            it('should write Number to valid gross', function (done) {

                finance.gross = faker.random.number();
                assert.canSet(firebaseAdmin.app(appName), path, finance, done);

            });

            it('should not write null to gross', function (done) {

                finance.gross = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, finance, done);

            });

            it('should write Number to incomes', function (done) {

                finance.incomes = faker.random.number();
                assert.canSet(firebaseAdmin.app(appName), path, finance, done);

            });

            it('should not write null to incomes', function (done) {

                finance.incomes = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, finance, done);

            });

            it('should write String to reason', function (done) {

                finance.reason = faker.lorem.word();
                assert.canSet(firebaseAdmin.app(appName), path, finance, done);

            });

            it('should not write Null to reason', function (done) {

                finance.reason = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, finance, done);

            });
        });

        describe('as user with active auth (team1User1Auth1) set values of the same teams oar', function () {
            const appName = 'team1User1Auth1';
            let path;
            let oar;

            beforeEach(function () {

                path = 'oars/' + team1Oar1.getPathKey();
                oar = team1Oar1.getValues({
                    reference: false
                });
                oar.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

            });

            it('should write, valid prior data', function (done) {

                assert.canSet(firebaseAdmin.app(appName), path, oar, done);

            });

            it('should not write empty oar', function (done) {

                oar = {};
                assert.cannotSet(firebaseAdmin.app(appName), path, oar, done);

            });

            it('should not write null oar', function (done) {

                oar = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, oar, done);

            });

            it('should not write another teams oar', function (done) {

                oar.team = team2Oar1.getPathKey();
                assert.cannotSet(firebaseAdmin.app(appName), path, oar, done);

            });

            it('should not write null to team', function (done) {

                oar.team = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, oar, done);

            });

            it('should write a different, valid color', function (done) {

                oar.color = faker.commerce.color();
                assert.canSet(firebaseAdmin.app(appName), path, oar, done);

            });

            it('should not write null to color', function (done) {

                oar.color = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, oar, done);

            });

            it('should write a different, valid handleGrip', function (done) {

                oar.handleGrip = faker.lorem.word();
                assert.canSet(firebaseAdmin.app(appName), path, oar, done);

            });

            it('should not write null to handleGrip', function (done) {

                oar.handleGrip = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, oar, done);

            });

            it('should be able to change name', function (done) {

                oar.name = faker.name.lastName();
                assert.canSet(firebaseAdmin.app(appName), path, oar, done);

            });

            it('should not write null to name', function (done) {

                oar.name = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, oar, done);

            });

            it('should write Number to length', function (done) {

                oar.length = faker.random.number();
                assert.canSet(firebaseAdmin.app(appName), path, oar, done);

            });

            it('should not write Null to length', function (done) {

                oar.length = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, oar, done);

            });

            it('should write String to shape', function (done) {

                oar.shape = faker.lorem.word();
                assert.canSet(firebaseAdmin.app(appName), path, oar, done);

            });

            it('should not write Null to shape', function (done) {

                oar.shape = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, oar, done);
            });
        });

        describe('as user with active auth (team1User1Auth1) set values of the same teams picture', function () {
            const appName = 'team1User1Auth1';
            let path;
            let picture;

            beforeEach(function () {

                path = 'pictures/' + team1Picture1.getPathKey();
                picture = team1Picture1.getValues({
                    reference: false
                });
                picture.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

            });

            it('should write, valid prior data', function (done) {

                assert.canSet(firebaseAdmin.app(appName), path, picture, done);

            });

            it('should not write empty picture', function (done) {

                picture = {};
                assert.cannotSet(firebaseAdmin.app(appName), path, picture, done);

            });

            it('should not write null picture', function (done) {

                picture = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, picture, done);

            });

            it('should not write another teams picture', function (done) {

                picture.team = team2Picture1.getPathKey();
                assert.cannotSet(firebaseAdmin.app(appName), path, picture, done);

            });

            it('should not write null to team', function (done) {

                picture.team = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, picture, done);

            });

            it('should write a different, valid caption', function (done) {

                picture.caption = faker.lorem.words();
                assert.canSet(firebaseAdmin.app(appName), path, picture, done);

            });

            it('should not write null to caption', function (done) {

                picture.caption = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, picture, done);

            });

            it('should write a different, valid url', function (done) {

                picture.url = faker.image.imageUrl();
                assert.canSet(firebaseAdmin.app(appName), path, picture, done);

            });

            it('should not write null to url', function (done) {

                picture.url = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, picture, done);

            });
        });

        describe('as user with active auth (team1User1Auth1) set values of the same teams race', function () {
            const appName = 'team1User1Auth1';
            let path;
            let race;

            beforeEach(function () {

                path = 'races/' + team1Race1.getPathKey();
                race = team1Race1.getValues({
                    reference: false
                });
                race.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

            });

            it('should write, valid prior data', function (done) {

                assert.canSet(firebaseAdmin.app(appName), path, race, done);

            });

            it('should not write empty race', function (done) {

                race = {};
                assert.cannotSet(firebaseAdmin.app(appName), path, race, done);

            });

            it('should not write null race', function (done) {

                race = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, race, done);

            });

            it('should not write another teams race', function (done) {

                race.team = team2Race1.getPathKey();
                assert.cannotSet(firebaseAdmin.app(appName), path, race, done);

            });

            it('should not write null to team', function (done) {

                race.team = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, race, done);

            });

            it('should write a different, valid bowNumber', function (done) {

                race.bowNumber = 2;
                assert.cantSet(firebaseAdmin.app(appName), path, race, done);

            });

            it('should not write null to bowNumber', function (done) {

                race.bowNumber = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, race, done);

            });

            it('should write a different, valid eventName', function (done) {

                race.eventName = faker.lorem.word();
                assert.canSet(firebaseAdmin.app(appName), path, race, done);

            });

            it('should not write null to eventName', function (done) {

                race.eventName = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, race, done);

            });

            it('should be able to change raceTime', function (done) {

                race.raceTime = faker.lorem.word();
                assert.canSet(firebaseAdmin.app(appName), path, race, done);

            });

            it('should not write null to raceTime', function (done) {

                race.raceTime = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, race, done);

            });

            it('should write String to suggestedLaunchTime', function (done) {

                race.suggestedLaunchTime = faker.lorem.word();
                assert.canSet(firebaseAdmin.app(appName), path, race, done);

            });

            it('should not write Null to suggestedLaunchTime', function (done) {

                race.suggestedLaunchTime = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, race, done);
            });
        });

        describe('as user with active auth (team1User1Auth1) set values of the same teams regatta', function () {
            const appName = 'team1User1Auth1';
            let path;
            let regatta;

            beforeEach(function () {

                path = 'regattas/' + team1Regatta1.getPathKey();
                regatta = team1Regatta1.getValues({
                    reference: false
                });
                regatta.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

            });

            it('should write, valid prior data', function (done) {

                assert.canSet(firebaseAdmin.app(appName), path, regatta, done);

            });

            it('should not write empty regatta', function (done) {

                regatta = {};
                assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);

            });

            it('should not write null regatta', function (done) {

                regatta = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);

            });

            it('should not write another teams regatta', function (done) {

                regatta.team = team2Regatta1.getPathKey();
                assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);

            });

            it('should not write null to team', function (done) {

                regatta.team = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);

            });

            it('should write a different, valid city', function (done) {

                regatta.city = faker.address.city();
                assert.canSet(firebaseAdmin.app(appName), path, regatta, done);

            });

            it('should not write null to city', function (done) {

                regatta.city = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);

            });

            it('should write a different, valid cost', function (done) {

                regatta.cost = faker.random.number();
                assert.canSet(firebaseAdmin.app(appName), path, regatta, done);

            });

            it('should not write null to cost', function (done) {

                regatta.cost = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);

            });

            it('should be able to change head', function (done) {

                regatta.head = false;
                assert.canSet(firebaseAdmin.app(appName), path, regatta, done);

            });

            it('should not write null to head', function (done) {

                regatta.head = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);

            });

            it('should write String to locationImage', function (done) {

                regatta.locationImage = faker.image.imageUrl();
                assert.canSet(firebaseAdmin.app(appName), path, regatta, done);

            });

            it('should not write Null to locationImage', function (done) {

                regatta.locationImage = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);

            });

            it('should write String to name', function (done) {

                regatta.name = faker.lorem.words();
                assert.canSet(firebaseAdmin.app(appName), path, regatta, done);

            });

            it('should not write Null to name', function (done) {

                regatta.name = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);
            });

            it('should write a different, valid state', function (done) {

                regatta.state = faker.address.state();
                assert.canSet(firebaseAdmin.app(appName), path, regatta, done);

            });

            it('should not write null to state', function (done) {

                regatta.state = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);

            });

            it('should write a different, valid streetAddress', function (done) {

                regatta.streetAddress = faker.address.streetAddress();
                assert.canSet(firebaseAdmin.app(appName), path, regatta, done);

            });

            it('should not write null to streetAddress', function (done) {

                regatta.streetAddress = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);

            });
        });

        describe('as user with active auth (team1User1Auth1) set values of the same teams rigger', function () {
            const appName = 'team1User1Auth1';
            let path;
            let rigger;

            beforeEach(function () {

                path = 'riggers/' + team1Rigger1.getPathKey();
                rigger = team1Rigger1.getValues({
                    reference: false
                });
                rigger.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

            });

            it('should write, valid prior data', function (done) {

                assert.canSet(firebaseAdmin.app(appName), path, rigger, done);

            });

            it('should not write empty rigger', function (done) {

                rigger = {};
                assert.cannotSet(firebaseAdmin.app(appName), path, rigger, done);

            });

            it('should not write null rigger', function (done) {

                rigger = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, rigger, done);

            });

            it('should not write another teams rigger', function (done) {

                rigger.team = team2Rigger1.getPathKey();
                assert.cannotSet(firebaseAdmin.app(appName), path, rigger, done);

            });

            it('should not write null to team', function (done) {

                rigger.team = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, rigger, done);

            });

            it('should write a different, valid seatNumber', function (done) {

                rigger.seatNumber = 3;
                assert.cannotSet(firebaseAdmin.app(appName), path, rigger, done);

            });

            it('should not write null to seatNumber', function (done) {

                rigger.seatNumber = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, rigger, done);

            });

            it('should write a different, valid side', function (done) {

                rigger.side = faker.lorem.word();
                assert.canSet(firebaseAdmin.app(appName), path, rigger, done);

            });

            it('should not write null to side', function (done) {

                rigger.side = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, rigger, done);

            });

            it('should be able to change style', function (done) {

                rigger.style = faker.lorem.word();
                assert.canSet(firebaseAdmin.app(appName), path, rigger, done);

            });

            it('should not write null to style', function (done) {

                rigger.style = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, rigger, done);

            });

            it('should write String to type', function (done) {

                rigger.type = faker.lorem.word();
                assert.canSet(firebaseAdmin.app(appName), path, rigger, done);

            });

            it('should not write Null to type', function (done) {

                rigger.type = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, rigger, done);
            });
        });

        describe('as user with active auth (team1User1Auth1) set values of the same team', function () {
            const appName = 'team1User1Auth1';
            let path;
            let team;

            beforeEach(function () {

                path = 'teams/' + team1.getPathKey();
                team = team1.getValues({
                    reference: false
                });
            });

            it('should write, valid prior data', function (done) {

                console.log(team);
                assert.canSet(firebaseAdmin.app(appName), path, team, done);

            });

            it('should not write empty team', function (done) {

                team = {};
                assert.cannotSet(firebaseAdmin.app(appName), path, team, done);

            });

            it('should not write null team', function (done) {

                team = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, team, done);

            });

            it('should not write another team', function (done) {

                team = team2.getPathKey();
                assert.cannotSet(firebaseAdmin.app(appName), path, team, done);

            });

            it('should not write null to team', function (done) {

                team.team = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, team, done);

            });

            it('should write a different, valid city', function (done) {

                team.city = faker.address.city();
                assert.canSet(firebaseAdmin.app(appName), path, team, done);

            });

            it('should not write null to city', function (done) {

                team.city = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, team, done);

            });

            it('should write a different, valid color', function (done) {

                team.color = faker.commerce.color();
                assert.canSet(firebaseAdmin.app(appName), path, team, done);

            });

            it('should not write null to color', function (done) {

                team.color = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, team, done);

            });

            it('should be able to change logo', function (done) {

                team.logo = faker.lorem.word();
                assert.canSet(firebaseAdmin.app(appName), path, team, done);

            });

            it('should not write null to logo', function (done) {

                team.logo = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, team, done);

            });

            it('should write String to name', function (done) {

                team.teamName = faker.lorem.words();
                assert.canSet(firebaseAdmin.app(appName), path, team, done);

            });

            it('should not write Null to name', function (done) {

                team.teamName = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, team, done);
            });

            it('should write a different, valid state', function (done) {

                team.state = faker.address.state();
                assert.canSet(firebaseAdmin.app(appName), path, team, done);

            });

            it('should not write null to state', function (done) {

                team.state = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, team, done);

            });

            it('should write a different, valid streetAddress', function (done) {

                team.streetAddress = faker.address.streetAddress();
                assert.canSet(firebaseAdmin.app(appName), path, team, done);

            });

            it('should not write null to streetAddress', function (done) {

                team.streetAddress = null;
                assert.cannotSet(firebaseAdmin.app(appName), path, team, done);

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
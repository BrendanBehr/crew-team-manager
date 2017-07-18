/* globals describe: function, it: function, beforeEach: function, before: function, after: function */

const firebaseAdmin = require('firebase-admin');
const firebaseFunctions = require('firebase-functions');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const assert = require('../assert-for-rules/assert-for-rules.js');
const faker = require('faker');
const Generator = require('../../../src/generator/index.js');

require('dotenv').config({
    path: process.cwd() + '/../../.env'
});

console.warn = function () {}; // Disables warnings from firebaseAdmin

describe('Auths', function () {
    this.timeout(30000);

    const generator = new Generator({
        updateDataOnSetFanOut: false,
        updateDataOnCreateWorkerTask: false
    });

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

    const team2User1 = team2.createUser();

    const team1User3 = team1.createUser({
        permisions: 'admin'
    });

    const team1User3Auth1 = team1User3.createAuth();
    const team1User3Auth2 = team1User3.createAuth({
        status: 'expired'
    });
    const team1User3Auth3 = team1User3.createAuth({
        status: 'expired'
    });
    const team1User3Auth4 = team1User3.createAuth();

    const team1User1Email1 = team1User1.createEmail({
        value: team1User1.getValues().email
    });
    const team1User2Email1 = team1User2.createEmail({
        value: team1User2.getValues().email
    });
    const team1User3Email1 = team1User3.createEmail({
        value: team1User3.getValues().email
    });
    const team2User1Email1 = team2User1.createEmail({
        value: team2User1.getValues().email
    });

    const team1User1Credential1 = team1User1.createCredential();
    // team1User1.setCredential(team1User1Credential1);
    const team1User2Credential1 = team1User2.createCredential();
    // team1User2.setCredential(team1User2Credential1);
    const team1User3Credential1 = team1User3.createCredential();
    // team1User3.setCredential(team1User3Credential1);
    const team2User1Credential1 = team2User1.createCredential();
    // team2User1.createCredential(team2User1Credential1);

    let password = 'BrendanRocks';
    team1User1Credential1.setPassword(password);
    password = 'GabeRocks';
    team1User2Credential1.setPassword(password);
    password = 'JoeRocks';
    team1User3Credential1.setPassword(password);
    password = 'BrianRocks';
    team2User1Credential1.setPassword(password);

    const team1Athlete1 = team1.createAthlete();
    const team1Athlete2 = team1.createAthlete();
    const team1Athlete3 = team1.createAthlete();
    const team2Athlete1 = team2.createAthlete();
    const team2Athlete2 = team2.createAthlete();

    const team1Boat1 = team1.createBoat();
    const team1Boat3 = team1.createBoat();
    const team2Boat1 = team2.createBoat();
    const team2Boat2 = team2.createBoat();

    const team1Rigger1 = team1.createRigger();
    const team1Rigger3 = team1.createRigger();
    const team2Rigger1 = team2.createRigger();
    const team2Rigger2 = team2.createRigger();

    const team1Erg1 = team1.createErg();
    const team1Erg3 = team1.createErg();
    const team2Erg1 = team2.createErg();
    const team2Erg2 = team2.createErg();

    const team1Finance1 = team1.createFinance();
    const team1Finance3 = team1.createFinance();
    const team2Finance1 = team2.createFinance();
    const team2Finance2 = team2.createFinance();

    const team1Oar1 = team1.createOar();
    const team1Oar3 = team1.createOar();
    const team2Oar1 = team2.createOar();
    const team2Oar2 = team2.createOar();

    const team1Picture1 = team1.createPicture();
    const team1Picture3 = team1.createPicture();
    const team2Picture1 = team2.createPicture();
    const team2Picture2 = team2.createPicture();

    const team1Race1 = team1.createRace();
    const team1Race3 = team1.createRace();
    const team2Race1 = team2.createRace();
    const team2Race2 = team2.createRace();

    const team1Regatta1 = team1.createRegatta();
    const team1Regatta3 = team1.createRegatta();
    const team2Regatta1 = team2.createRegatta();
    const team2Regatta2 = team2.createRegatta();


    team1Boat1.addAthlete(team1Athlete1);
    team1Boat1.addOar(team1Oar1);
    team1Boat1.addRigger(team1Rigger1);
    team2Boat1.addAthlete(team2Athlete1);
    team2Boat1.addOar(team2Oar1);
    team2Boat1.addRigger(team2Rigger1);

    team1Athlete1.addErg(team1Erg1);
    team1Athlete1.addFinance(team1Finance1);
    team2Athlete1.addErg(team2Erg1);
    team2Athlete1.addFinance(team2Finance1);

    team1Regatta1.addRaces(team1Race1);
    team1Regatta1.addPicture(team1Picture1);
    team2Regatta1.addRaces(team2Race1);
    team2Regatta1.addPicture(team2Picture1);


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

        firebaseAdmin.initializeApp({
            credential: firebaseAdmin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: privateKey
            }),
            databaseURL: databaseURL,
            databaseAuthVariableOverride: {
                auth: team1User3Auth1.getPathKey()
            }
        }, 'team1User3Auth1');

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
        }, 'team1User3Auth2');

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

        describe('as user with inactive auth (team1User1Auth2) accessing own teams athlete (team1Athlete1)', function () {

            const appName = 'team1User1Auth2';
            let path;

            beforeEach(function () {

                path = 'athletes/' + team1Athlete1.getPathKey();

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

        describe('as user with inactive auth (team1User1Auth2) accessing own teams boats (team1Boat1)', function () {

            const appName = 'team1User1Auth2';
            let path;

            beforeEach(function () {

                path = 'boats/' + team1Boat1.getPathKey();

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

        describe('as user with inactive auth (team1User1Auth2) accessing own teams riggers (team1Rigger1)', function () {

            const appName = 'team1User1Auth2';
            let path;

            beforeEach(function () {

                path = 'riggers/' + team1Rigger1.getPathKey();

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

        describe('as user with inactive auth (team1User1Auth2) accessing own teams ergs (team1Erg1)', function () {

            const appName = 'team1User1Auth2';
            let path;

            beforeEach(function () {

                path = 'ergs/' + team1Erg1.getPathKey();

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

        describe('as user with inactive auth (team1User1Auth2) accessing own teams finances (team1Finance1)', function () {

            const appName = 'team1User1Auth2';
            let path;

            beforeEach(function () {

                path = 'finances/' + team1Finance1.getPathKey();

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

        describe('as user with inactive auth (team1User1Auth2) accessing own teams oars (team1Oar1)', function () {

            const appName = 'team1User1Auth2';
            let path;

            beforeEach(function () {

                path = 'oars/' + team1Oar1.getPathKey();

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

        describe('as user with inactive auth (team1User1Auth2) accessing own teams pictures (team1Picture1)', function () {

            const appName = 'team1User1Auth2';
            let path;

            beforeEach(function () {

                path = 'pictures/' + team1Picture1.getPathKey();

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

        describe('as user with inactive auth (team1User1Auth2) accessing own active auth (team1Race1)', function () {

            const appName = 'team1User1Auth2';
            let path;

            beforeEach(function () {

                path = 'races/' + team1Race1.getPathKey();

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

        describe('as user with inactive auth (team1User1Auth2) accessing own teams regattas (team1Regatta1)', function () {

            const appName = 'team1User1Auth2';
            let path;

            beforeEach(function () {

                path = 'regattas/' + team1Regatta1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing own team (team1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'teams/' + team1.getPathKey();

            });

            it('should read', function (done) {

                assert.canRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing another team (team2)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'teams/' + team2.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with inactive auth (team1User1Auth2) accessing own team (team1)', function () {

            const appName = 'team1User1Auth2';
            let path;

            beforeEach(function () {

                path = 'teams/' + team1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing own teams users (team1User1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'users/' + team1User1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing another teams user (team2User1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'users/' + team2User1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with inactive auth (team1User1Auth2) accessing own user (team1User1)', function () {

            const appName = 'team1User1Auth2';
            let path;

            beforeEach(function () {

                path = 'users/' + team1User1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing own teams emails (team1User1Email1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'emails/' + team1User1Email1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing another teams email (team2User1Email1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'emails/' + team2User1Email1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with inactive auth (team1User1Auth2) accessing own email (team1User1Email1)', function () {

            const appName = 'team1User1Auth2';
            let path;

            beforeEach(function () {

                path = 'emails/' + team1User1Email1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing own teams credentials (team1User1Credential1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'credentials/' + team1User1Credential1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth and admin permisions (team1User3Auth1) accessing own teams credentials (team1User1Credential1)', function () {

            const appName = 'team1User3Auth1';
            let path;

            beforeEach(function () {

                path = 'credentials/' + team1User1Credential1.getPathKey();

            });

            it('should read', function (done) {

                assert.canRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing another teams credential (team1User2Credential1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'credentials/' + team1User2Credential1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing another teams credential (team2User1Credential1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'credentials/' + team2User1Credential1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth and admin permisions (team1User3Auth1) accessing another teams credential (team2User1Credential1)', function () {

            const appName = 'team1User3Auth1';
            let path;

            beforeEach(function () {

                path = 'credentials/' + team2User1Credential1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with inactive auth (team1User1Auth2) accessing own credential (team1User1Credential1)', function () {

            const appName = 'team1User1Auth2';
            let path;

            beforeEach(function () {

                path = 'credentials/' + team1User1Credential1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing own teams boatAthletes (boat1/athlete1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'boatAthletes/' + team1Boat1.getPathKey() + '/' + team1Athlete1.getPathKey();

            });

            it('should read', function (done) {

                assert.canRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing another teams boatAthletes (boat2/athlete1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'boatAthletes/' + team2Boat1.getPathKey() + '/' + team2Athlete1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with inactive auth (team1User1Auth2) accessing own teams boatAthletes (boat1/athlete1)', function () {

            const appName = 'team1User1Auth2';
            let path;

            beforeEach(function () {

                path = 'boatAthletes/' + team1Boat1.getPathKey() + '/' + team1Athlete1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing own teams boatOars (boat1/oar1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'boatOars/' + team1Boat1.getPathKey() + '/' + team1Oar1.getPathKey();

            });

            it('should read', function (done) {

                assert.canRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing another teams boatOars (boat2/oar1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'boatOars/' + team2Boat1.getPathKey() + '/' + team2Oar1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with inactive auth (team1User1Auth2) accessing own teams boatOars (boat1/oar1)', function () {

            const appName = 'team1User1Auth2';
            let path;

            beforeEach(function () {

                path = 'boatOars/' + team1Boat1.getPathKey() + '/' + team1Oar1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing own teams boatRiggers (boat1/rigger1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'boatRiggers/' + team1Boat1.getPathKey() + '/' + team1Rigger1.getPathKey();

            });

            it('should read', function (done) {

                assert.canRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing another teams boatRiggers (boat2/rigger1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'boatRiggers/' + team2Boat1.getPathKey() + '/' + team2Rigger1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with inactive auth (team1User1Auth2) accessing own active auth (boat1/rigger1)', function () {

            const appName = 'team1User1Auth2';
            let path;

            beforeEach(function () {

                path = 'boatRiggers/' + team1Boat1.getPathKey() + '/' + team1Rigger1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing own teams athleteErgs (athlete1/erg1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'athleteErgs/' + team1Athlete1.getPathKey() + '/' + team1Erg1.getPathKey();

            });

            it('should read', function (done) {

                assert.canRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing another teams athleteErgs (athlete2/erg1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'athleteErgs/' + team2Athlete1.getPathKey() + '/' + team2Erg1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with inactive auth (team1User1Auth2) accessing own teamsErgs (athlete1/erg1)', function () {

            const appName = 'team1User1Auth2';
            let path;

            beforeEach(function () {

                path = 'athleteErgs/' + team1Athlete1.getPathKey() + '/' + team1Erg1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing own teams athleteFinances (athlete1/finance1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'athleteFinances/' + team1Athlete1.getPathKey() + '/' + team1Finance1.getPathKey();

            });

            it('should read', function (done) {

                assert.canRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing another teams athleteFinances (athlete2/finance1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'athleteFinances/' + team2Athlete1.getPathKey() + '/' + team2Finance1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with inactive auth (team1User1Auth2) accessing own teams athleteFinances (athlete1/finance1)', function () {

            const appName = 'team1User1Auth2';
            let path;

            beforeEach(function () {

                path = 'athleteFinances/' + team1Athlete1.getPathKey() + '/' + team1Finance1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing own teams regattaRaces (regatta1/race1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'regattaRaces/' + team1Regatta1.getPathKey() + '/' + team1Race1.getPathKey();

            });

            it('should read', function (done) {

                assert.canRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing another teams regattaRaces (regatta2/race1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'regattaRaces/' + team2Regatta1.getPathKey() + '/' + team2Race1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with inactive auth (team1User1Auth2) accessing own teams regattaRaces (regatta1/race1)', function () {

            const appName = 'team1User1Auth2';
            let path;

            beforeEach(function () {

                path = 'regattaRaces/' + team1Regatta1.getPathKey() + '/' + team1Race1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing own teams regattaPictures (team1User1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'regattaPictures/' + team1Regatta1.getPathKey() + '/' + team1Picture1.getPathKey();

            });

            it('should read', function (done) {

                assert.canRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing another teams regattaPictures (team2User1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'regattaPictures/' + team2Regatta1.getPathKey() + '/' + team2Picture1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing own teamAthletes (team1/athlete1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'teamAthletes/' + team1.getPathKey() + '/' + team1Athlete1.getPathKey();

            });

            it('should read', function (done) {

                assert.canRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing another teamAthletes (team2/athlete1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'teamAthletes/' + team2.getPathKey() + '/' + team2Athlete1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with inactive auth (team1User1Auth2) accessing own teamAthletes (team1/athlete1)', function () {

            const appName = 'team1User1Auth2';
            let path;

            beforeEach(function () {

                path = 'teamAthletes/' + team1.getPathKey() + '/' + team1Athlete1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing own teamBoats (team1/boat1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'teamBoats/' + team1.getPathKey() + '/' + team1Boat1.getPathKey();

            });

            it('should read', function (done) {

                assert.canRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing another teamBoats (team2/boat1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'teamBoats/' + team2.getPathKey() + '/' + team2Boat1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with inactive auth (team1User1Auth2) accessing own teamBoats (team1/boat1)', function () {

            const appName = 'team1User1Auth2';
            let path;

            beforeEach(function () {

                path = 'teamBoats/' + team1.getPathKey() + '/' + team1Boat1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing own teamErgs (team1/erg1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'teamErgs/' + team1.getPathKey() + '/' + team1Erg1.getPathKey();

            });

            it('should read', function (done) {

                assert.canRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing another teamErgs (team2/erg1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'teamErgs/' + team2.getPathKey() + '/' + team2Erg1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with inactive auth (team1User1Auth2) accessing own teamErgs (team1/erg1)', function () {

            const appName = 'team1User1Auth2';
            let path;

            beforeEach(function () {

                path = 'teamErgs/' + team1.getPathKey() + '/' + team1Erg1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing own teamFinances (team1/finance1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'teamFinances/' + team1.getPathKey() + '/' + team1Finance1.getPathKey();

            });

            it('should read', function (done) {

                assert.canRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing another teamFinances (team2/finance1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'teamFinances/' + team2.getPathKey() + '/' + team2Finance1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with inactive auth (team1User1Auth2) accessing own teamFinances (team1/finance1)', function () {

            const appName = 'team1User1Auth2';
            let path;

            beforeEach(function () {

                path = 'teamFinances/' + team1.getPathKey() + '/' + team1Finance1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing own teamOars (team1/oar1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'teamOars/' + team1.getPathKey() + '/' + team1Oar1.getPathKey();

            });

            it('should read', function (done) {

                assert.canRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing another teamOars (team2/oar1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'teamOars/' + team2.getPathKey() + '/' + team2Oar1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with inactive auth (team1User1Auth2) accessing own active auth (team1/oar1)', function () {

            const appName = 'team1User1Auth2';
            let path;

            beforeEach(function () {

                path = 'teamOars/' + team1.getPathKey() + '/' + team1Oar1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing own teamPictures (team1/picture1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'teamPictures/' + team1.getPathKey() + '/' + team1Picture1.getPathKey();

            });

            it('should read', function (done) {

                assert.canRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing another teamPictures (team2/picture1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'teamPictures/' + team2.getPathKey() + '/' + team2Picture1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with inactive auth (team1User1Auth2) accessing own teamPictures (team1/picture1)', function () {

            const appName = 'team1User1Auth2';
            let path;

            beforeEach(function () {

                path = 'teamPictures/' + team1.getPathKey() + '/' + team1Picture1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing own teamRaces (team1/race1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'teamRaces/' + team1.getPathKey() + '/' + team1Race1.getPathKey();

            });

            it('should read', function (done) {

                assert.canRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing another teamRaces (team2/race1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'teamRaces/' + team2.getPathKey() + '/' + team2Race1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with inactive auth (team1User1Auth2) accessing own teamRaces (team1/race1)', function () {

            const appName = 'team1User1Auth2';
            let path;

            beforeEach(function () {

                path = 'teamRaces/' + team1.getPathKey() + '/' + team1Race1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing own teamRegattas (team1/regatta1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'teamRegattas/' + team1.getPathKey() + '/' + team1Regatta1.getPathKey();

            });

            it('should read', function (done) {

                assert.canRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing another teamRegattas (team2/regatta1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'teamRegattas/' + team2.getPathKey() + '/' + team2Regatta1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with inactive auth (team1User1Auth2) accessing own active auth (team1/regatta1)', function () {

            const appName = 'team1User1Auth2';
            let path;

            beforeEach(function () {

                path = 'teamRegattas/' + team1.getPathKey() + '/' + team1Regatta1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing own teamRiggers (team1/rigger1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'teamRiggers/' + team1.getPathKey() + '/' + team1Rigger1.getPathKey();

            });

            it('should read', function (done) {

                assert.canRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with active auth (team1User1Auth1) accessing another teamRiggers (team2/rigger1)', function () {

            const appName = 'team1User1Auth1';
            let path;

            beforeEach(function () {

                path = 'teamRiggers/' + team2.getPathKey() + '/' + team2Rigger1.getPathKey();

            });

            it('should not read', function (done) {

                assert.cannotRead(firebaseAdmin.app(appName), path, done);

            });

        });

        describe('as user with inactive auth (team1User1Auth2) accessing own teamRiggers (team1/rigger1)', function () {

            const appName = 'team1User1Auth2';
            let path;

            beforeEach(function () {

                path = 'teamRiggers/' + team1.getPathKey() + '/' + team1Rigger1.getPathKey();

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

        describe('auth with basic perms', function () {

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

                    it('should not update `' + authKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[authKeys[x]] = auth[authKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

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

                    assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

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
                    assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

                });

                it('should not write null to status', function (done) {

                    auth.status = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

                });

                it('should write current time to updated', function (done) {

                    auth.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

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
                    assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

                });

                it('should not write Null to `ip`', function (done) {

                    auth.ip = null;
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
                    auth.status = 'active';

                });

                it('should write, valid prior data', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

                });

                it('should write a different, valid status', function (done) {

                    auth.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    auth.status = 'expired';
                    assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

                });

                it('should write current time to updated', function (done) {

                    auth.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

                });

                it('should write String to `ip`', function (done) {

                    auth.ip = faker.random.words();
                    assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

                });

                it('should write String to `browser`', function (done) {

                    auth.browser = faker.random.words();

                    assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

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

                it('should not write null to status', function (done) {

                    auth.status = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

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

                it('should not write Null to `ip`', function (done) {

                    auth.ip = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

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

        describe('auth with admin perms', function () {

            describe('as anonymous', function () {

                const appName = 'anonymous';
                let path;
                let auth;

                beforeEach(function () {

                    path = 'auths/' + team1User3Auth1.getPathKey();
                    auth = team1User3Auth1.getValues({
                        reference: false
                    });
                    auth.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

                });

            });

            describe('as user with active auth (team1User3Auth1) accessing individual keys of an auth (team1User3Auth4)', function () {

                const appName = 'team1User3Auth1';

                let path;
                const auth = team1User3Auth4.getValues({
                    reference: false
                });
                auth.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                const authKeys = Object.keys(auth);

                beforeEach(function () {

                    path = 'auths/' + team1User3Auth4.getPathKey();

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

            describe('as user with active auth (team1User3Auth1) updating individual values of an auth (team1User3Auth4)', function () {

                const appName = 'team1User3Auth1';

                const path = 'auths/' + team1User3Auth4.getPathKey();
                const auth = team1User3Auth4.getValues({
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

            describe('as user with active auth (team1User3Auth1) setting auth of another user (team1User2Auth1)', function () {

                const appName = 'team1User3Auth1';
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

            describe('as user with active auth (team1User3Auth1) creating new user active auth', function () {

                const appName = 'team1User3Auth1';
                let path;
                let auth;

                beforeEach(function () {

                    path = 'auths/';
                    auth = team1User3Auth1.getValues({
                        reference: false
                    });
                    auth.created = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    auth.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not create new auth', function (done) {

                    assert.cannotPush(firebaseAdmin.app(appName), path, auth, done);

                });

            });

            describe('as user with active auth (team1User3Auth1) creating new user inactive auth', function () {

                const appName = 'team1User3Auth1';
                let path;
                let auth;

                beforeEach(function () {

                    path = 'auths/';
                    auth = team1User3Auth2.getValues({
                        reference: false
                    });
                    auth.created = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    auth.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not create new auth', function (done) {

                    assert.cannotPush(firebaseAdmin.app(appName), path, auth, done);

                });

            });

            describe('as user with active auth (team1User3Auth1) set values of same auth (team1User3Auth1)', function () {
                const appName = 'team1User3Auth1';
                let path;
                let auth;

                beforeEach(function () {

                    path = 'auths/' + team1User3Auth1.getPathKey();
                    auth = team1User3Auth1.getValues({
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

            });

            describe('as user with active auth (team1User3Auth1) set values of active auth with same user (team1User3Auth4)', function () {

                const appName = 'team1User3Auth1';
                let path;
                let auth;

                beforeEach(function () {

                    path = 'auths/' + team1User3Auth4.getPathKey();
                    auth = team1User3Auth4.getValues({
                        reference: false
                    });
                    auth.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    auth.status = 'active';

                });

                it('should write, valid prior data', function (done) {

                    assert.canSet(firebaseAdmin.app(appName), path, auth, done);

                });

                it('should write a different, valid status', function (done) {

                    auth.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    auth.status = 'expired';
                    assert.canSet(firebaseAdmin.app(appName), path, auth, done);

                });

                it('should write current time to updated', function (done) {

                    auth.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    assert.canSet(firebaseAdmin.app(appName), path, auth, done);

                });

                it('should write String to `ip`', function (done) {

                    auth.ip = faker.random.words();
                    assert.canSet(firebaseAdmin.app(appName), path, auth, done);

                });

                it('should write String to `browser`', function (done) {

                    auth.browser = faker.random.words();

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

                it('should not write null to status', function (done) {

                    auth.status = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

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

                it('should not write Null to `ip`', function (done) {

                    auth.ip = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

                });

                it('should not write Null to `browser`', function (done) {

                    auth.browser = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

                });

            });

            describe('as user with active auth (team1User3Auth1) set values of inactive auth with same user (team1User3Auth2)', function () {

                const appName = 'team1User3Auth1';
                let path;
                let auth;

                beforeEach(function () {

                    path = 'auths/' + team1User3Auth2.getPathKey();
                    auth = team1User3Auth2.getValues({
                        reference: false
                    });
                    auth.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

                });

            });

            describe('as user with inactive auth (team1User3Auth2) setting auth of another user (team1User2Auth1)', function () {

                const appName = 'team1User3Auth2';
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

            describe('as user with inactive auth (team1User3Auth2) creating new user active auth', function () {

                const appName = 'team1User3Auth2';
                let path;
                let auth;

                beforeEach(function () {

                    path = 'auths/';
                    auth = team1User3Auth1.getValues({
                        reference: false
                    });
                    auth.created = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    auth.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not create new auth', function (done) {

                    assert.cannotPush(firebaseAdmin.app(appName), path, auth, done);

                });

            });

            describe('as user with inactive auth (team1User3Auth2) creating new user inactive auth', function () {

                const appName = 'team1User3Auth2';
                let path;
                let auth;

                beforeEach(function () {

                    path = 'auths/';
                    auth = team1User3Auth2.getValues({
                        reference: false
                    });
                    auth.created = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    auth.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not create new auth', function (done) {

                    assert.cannotPush(firebaseAdmin.app(appName), path, auth, done);

                });

            });

            describe('as user with inactive auth (team1User3Auth2) set values of same auth (team1User3Auth2)', function () {

                const appName = 'team1User3Auth2';
                let path;
                let auth;

                beforeEach(function () {

                    path = 'auths/' + team1User3Auth2.getPathKey();
                    auth = team1User3Auth2.getValues({
                        reference: false
                    });
                    auth.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

                });

            });

            describe('as user with inactive auth (team1User3Auth2) set values of active auth with same user (team1User3Auth1)', function () {

                const appName = 'team1User3Auth2';
                let path;
                let auth;

                beforeEach(function () {

                    path = 'auths/' + team1User3Auth1.getPathKey();
                    auth = team1User3Auth1.getValues({
                        reference: false
                    });
                    auth.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

                });

            });

            describe('as user with inactive auth (team1User3Auth2) set values of inactive auth with same user (team1User3Auth3)', function () {

                const appName = 'team1User3Auth2';
                let path;
                let auth;

                beforeEach(function () {

                    path = 'auths/' + team1User3Auth3.getPathKey();
                    auth = team1User3Auth3.getValues({
                        reference: false
                    });
                    auth.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, auth, done);

                });

            });
        });

        describe('Athlete tests', function () {

            describe('as user with basic permisions and an active auth (team1User1Auth1) updating individual values of an athlete (team1Athlete1)', function () {

                const appName = 'team1User1Auth1';

                const path = 'athletes/' + team1Athlete1.getPathKey();
                const athlete = team1Athlete1.getValues({
                    reference: false
                });
                const athleteKeys = Object.keys(athlete);

                for (let x = 0; x < athleteKeys.length; x++) {

                    if (athleteKeys[x] === 'updated') {
                        continue;
                    }

                    it('should update `' + athleteKeys[x] + '` with prior data and an updated timestamp', function (done) {
                        const value = {};
                        value[athleteKeys[x]] = athlete[athleteKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                        assert.canUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }



                for (let x = 0; x < athleteKeys.length; x++) {

                    if (athleteKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + athleteKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[athleteKeys[x]] = athlete[athleteKeys[x]];

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

                it('should write String, valid city', function (done) {

                    athlete.city = faker.address.city();
                    assert.canSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should write String to ergScore', function (done) {

                    athlete.ergScore = faker.random.words();
                    assert.canSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should write String to firstName', function (done) {

                    athlete.firstName = faker.name.firstName();
                    assert.canSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should write String to lastName', function (done) {

                    athlete.lastName = faker.name.lastName();
                    assert.canSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should write Number to fundRaising', function (done) {

                    athlete.fundRaising = faker.random.number() / 100;
                    assert.canSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should write String to gender', function (done) {

                    athlete.gender = faker.lorem.word();
                    assert.canSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should write String to height', function (done) {

                    athlete.height = 'tall';
                    assert.canSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should write String to phone', function (done) {

                    athlete.phone = faker.phone.phoneNumber();
                    assert.canSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should write String to side', function (done) {

                    athlete.side = faker.lorem.word();
                    assert.canSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should write String to state', function (done) {

                    athlete.state = faker.address.state();
                    assert.canSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should write String to streetAddress', function (done) {

                    athlete.streetAddress = faker.address.streetAddress();
                    assert.canSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should write Number to weight', function (done) {

                    athlete.weight = faker.random.number() / 1000;
                    assert.canSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should write String to year', function (done) {

                    athlete.year = faker.lorem.word();
                    assert.canSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should write String to email', function (done) {

                    athlete.email = faker.internet.email();
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

                it('should not write null to team', function (done) {

                    athlete.team = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write to another team', function (done) {
                    athlete.team = team2.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);
                });

                it('should not write Null to streetAddress', function (done) {

                    athlete.streetAddress = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write null to city', function (done) {

                    athlete.city = null;
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

                it('should not write Null to ergScore', function (done) {

                    athlete.ergScore = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Null to fundRaising', function (done) {

                    athlete.fundRaising = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Null to firstName', function (done) {

                    athlete.firstName = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Null to lastName', function (done) {

                    athlete.lastName = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Null to height', function (done) {

                    athlete.height = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Null to phone', function (done) {

                    athlete.phone = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Null to gender', function (done) {

                    athlete.gender = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Null to side', function (done) {

                    athlete.side = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Null to state', function (done) {

                    athlete.state = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Null to weight', function (done) {

                    athlete.weight = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Null to year', function (done) {

                    athlete.year = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write String to email', function (done) {

                    athlete.email = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });
            });

            describe('as user with active auth (team1User1Auth1) setting of another athlete belonging to a different team (team2Athlete1)', function () {

                const appName = 'team1User1Auth1';
                let path;
                let athlete;

                beforeEach(function () {

                    path = 'athletes/' + team2Athlete1.getPathKey();
                    athlete = team2Athlete1.getValues({
                        reference: false
                    });
                    athlete.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    athlete.created = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

            });

            describe('as user with active auth (team1User1Auth1) updating individual values of another teams athlete (team1Athlete1)', function () {

                const appName = 'team1User1Auth1';

                const path = 'athletes/' + team2Athlete1.getPathKey();
                const athlete = team2Athlete1.getValues({
                    reference: false
                });
                const athleteKeys = Object.keys(athlete);

                for (let x = 0; x < athleteKeys.length; x++) {

                    if (athleteKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + athleteKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[athleteKeys[x]] = athlete[athleteKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < athleteKeys.length; x++) {

                    if (athleteKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + athleteKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[athleteKeys[x]] = athlete[athleteKeys[x]];

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

            describe('as user with active auth (team1User1Auth1) set values of another teams athlete', function () {
                const appName = 'team1User1Auth1';
                let path;
                let athlete;

                beforeEach(function () {

                    path = 'athletes/' + team2Athlete1.getPathKey();
                    athlete = team2Athlete1.getValues({
                        reference: false
                    });
                    athlete.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write, valid prior data', function (done) {
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write a different, valid city', function (done) {

                    athlete.city = faker.address.city();
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write String to ergScore', function (done) {

                    athlete.ergScore = faker.random.words();
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write String to firstName', function (done) {

                    athlete.firstName = faker.name.firstName();
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write String to lastName', function (done) {

                    athlete.lastName = faker.name.lastName();
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Number to fundRaising', function (done) {

                    athlete.fundRaising = faker.random.number() / 100;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write String to gender', function (done) {

                    athlete.gender = faker.lorem.word();
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write String to height', function (done) {

                    athlete.height = 'tall';
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write String to phone', function (done) {

                    athlete.phone = faker.phone.phoneNumber();
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write String to side', function (done) {

                    athlete.side = faker.lorem.word();
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write String to state', function (done) {

                    athlete.state = faker.address.state();
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write String to streetAddress', function (done) {

                    athlete.streetAddress = faker.address.streetAddress();
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Number to weight', function (done) {

                    athlete.weight = faker.random.number() / 1000;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write String to year', function (done) {

                    athlete.year = faker.lorem.word();
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write empty athlete', function (done) {

                    athlete = {};
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write null athlete', function (done) {

                    athlete = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write null to team', function (done) {

                    athlete.team = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write to another team', function (done) {
                    athlete.team = team2.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);
                });

                it('should not write String to email', function (done) {

                    athlete.email = faker.internet.email();
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Null to streetAddress', function (done) {

                    athlete.streetAddress = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write null to city', function (done) {

                    athlete.city = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not be able to change driver', function (done) {

                    athlete.driver = true;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write null to driver', function (done) {

                    athlete.driver = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Null to ergScore', function (done) {

                    athlete.ergScore = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Null to fundRaising', function (done) {

                    athlete.fundRaising = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Null to firstName', function (done) {

                    athlete.firstName = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Null to lastName', function (done) {

                    athlete.lastName = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Null to height', function (done) {

                    athlete.height = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Null to phone', function (done) {

                    athlete.phone = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Null to gender', function (done) {

                    athlete.gender = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Null to side', function (done) {

                    athlete.side = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Null to state', function (done) {

                    athlete.state = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Null to weight', function (done) {

                    athlete.weight = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Null to year', function (done) {

                    athlete.year = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write String to email', function (done) {

                    athlete.email = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });
            });

            describe('as user with inactive auth (team1User1Auth2) set values of another athlete on the same team', function () {
                const appName = 'team1User1Auth2';
                let path;
                let athlete;

                beforeEach(function () {

                    path = 'athletes/' + team1Athlete2.getPathKey();
                    athlete = team1Athlete2.getValues({
                        reference: false
                    });
                    athlete.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write, valid prior data', function (done) {
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write a different, valid city', function (done) {

                    athlete.city = faker.address.city();
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write String to ergScore', function (done) {

                    athlete.ergScore = faker.random.words();
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write String to firstName', function (done) {

                    athlete.firstName = faker.name.firstName();
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write String to lastName', function (done) {

                    athlete.lastName = faker.name.lastName();
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Number to fundRaising', function (done) {

                    athlete.fundRaising = faker.random.number() / 100;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write String to gender', function (done) {

                    athlete.gender = faker.lorem.word();
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write String to height', function (done) {

                    athlete.height = 'tall';
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write String to phone', function (done) {

                    athlete.phone = faker.phone.phoneNumber();
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write String to side', function (done) {

                    athlete.side = faker.lorem.word();
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write String to state', function (done) {

                    athlete.state = faker.address.state();
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write String to streetAddress', function (done) {

                    athlete.streetAddress = faker.address.streetAddress();
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Number to weight', function (done) {

                    athlete.weight = faker.random.number() / 1000;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write String to year', function (done) {

                    athlete.year = faker.lorem.word();
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write String to email', function (done) {

                    athlete.email = faker.internet.email();
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write empty athlete', function (done) {
                    athlete = {};
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write null athlete', function (done) {

                    athlete = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write null to team', function (done) {

                    athlete.team = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write to another team', function (done) {
                    athlete.team = team2.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);
                });

                it('should not write Null to streetAddress', function (done) {

                    athlete.streetAddress = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write null to city', function (done) {

                    athlete.city = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not be able to change driver', function (done) {

                    athlete.driver = true;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write null to driver', function (done) {

                    athlete.driver = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Null to ergScore', function (done) {

                    athlete.ergScore = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Null to fundRaising', function (done) {

                    athlete.fundRaising = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Null to firstName', function (done) {

                    athlete.firstName = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Null to lastName', function (done) {

                    athlete.lastName = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Null to height', function (done) {

                    athlete.height = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Null to phone', function (done) {

                    athlete.phone = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Null to gender', function (done) {

                    athlete.gender = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Null to side', function (done) {

                    athlete.side = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Null to state', function (done) {

                    athlete.state = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Null to weight', function (done) {

                    athlete.weight = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write Null to year', function (done) {

                    athlete.year = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });

                it('should not write String to email', function (done) {

                    athlete.email = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, athlete, done);

                });
            });

            describe('as user with inactive auth (team1User1Auth2) updating individual values of an athlete (team1Athlete1)', function () {

                const appName = 'team1User1Auth2';

                const path = 'athletes/' + team1Athlete1.getPathKey();
                const athlete = team1Athlete1.getValues({
                    reference: false
                });
                const athleteKeys = Object.keys(athlete);

                for (let x = 0; x < athleteKeys.length; x++) {

                    if (athleteKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + athleteKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[athleteKeys[x]] = athlete[athleteKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < athleteKeys.length; x++) {

                    if (athleteKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + athleteKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[athleteKeys[x]] = athlete[athleteKeys[x]];

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

            describe('as a user with admin permisions and an active auth (team1User3Auth1)  remove athletes ', function () {
                const appName = 'team1User3Auth1';
                let path = 'athletes/' + team2Athlete2.getPathKey();

                const newApp = 'team1User1Auth1';

                it('should not remove a different teams athlete', function (done) {
                    assert.cannotSet(firebaseAdmin.app(appName), path, null, done);
                });
                it('a user without the correct permisions should not remove a teams athlete', function (done) {
                    path = 'athletes/' + team1Athlete3.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(newApp), path, null, done);
                });

                it('an admin is now removing the teams athlete', function (done) {
                    assert.canSet(firebaseAdmin.app(appName), path, null, done);

                });

            });

            describe('as a user with active auth (team1User3Auth1) updating values of a deleted athlete', function () {
                let appName = 'team1User3Auth1';
                let path = 'athletes/';
                const athlete = team1Athlete3.getValues({
                    reference: true
                });


                const athleteKeys = Object.keys(athlete);
                for (let x = 0; x < athleteKeys.length; x++) {

                    if (athleteKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + athleteKeys[x] + '` with prior data and an updated timestamp', function (done) {
                        const value = {};
                        value[athleteKeys[x]] = athlete[athleteKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < athleteKeys.length; x++) {

                    if (athleteKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + athleteKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[athleteKeys[x]] = athlete[athleteKeys[x]];

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

            describe('create new athletes', function () {
                const appName = 'team1User1Auth1';
                const path = 'athletes';

                it('should add a new athlete to the team', function (done) {
                    const athlete = team1.createAthlete();
                    const values = athlete.getValues({
                        reference: false
                    });
                    values.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    values.created = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    assert.canPush(firebaseAdmin.app(appName), path, values, done);
                });

                it('it should not add a new athlete to a different team', function (done) {
                    const athlete = team2.createAthlete();
                    const values = athlete.getValues({
                        reference: false
                    });

                    values.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    values.created = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    assert.cannotPush(firebaseAdmin.app(appName), path, values, done);
                });
            });
        });

        describe('Boat tests', function () {

            describe('as user with active auth (team1User1Auth1) updating individual values of an boat (team1Boat1)', function () {

                const appName = 'team1User1Auth1';

                const path = 'boats/' + team1Boat1.getPathKey();
                const boat = team1Boat1.getValues({
                    reference: false
                });

                const boatKeys = Object.keys(boat);

                for (let x = 0; x < boatKeys.length; x++) {

                    if (boatKeys[x] === 'updated') {
                        continue;
                    }

                    it('should update `' + boatKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[boatKeys[x]] = boat[boatKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                        assert.canUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < boatKeys.length; x++) {

                    if (boatKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + boatKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[boatKeys[x]] = boat[boatKeys[x]];

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

                it('should not write null to team', function (done) {

                    boat.team = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, boat, done);

                });

                it('should not write to another team', function (done) {
                    boat.team = team2.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, boat, done);
                });

                it('should write a different, valid manufacturer', function (done) {

                    boat.manufacturer = faker.lorem.word();
                    assert.canSet(firebaseAdmin.app(appName), path, boat, done);

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

                    boat.size = 4;
                    assert.canSet(firebaseAdmin.app(appName), path, boat, done);

                });

                it('should not write a Number greater than 8 to size', function (done) {

                    boat.size = 104;
                    assert.cannotSet(firebaseAdmin.app(appName), path, boat, done);

                });

                it('should not write a Number less than than 0 to size', function (done) {

                    boat.size = -4;
                    assert.cannotSet(firebaseAdmin.app(appName), path, boat, done);

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

            describe('as user with active auth (team1User1Auth1) setting boat of another team (team2Boat1)', function () {

                const appName = 'team1User1Auth1';
                let path;
                let boat;

                beforeEach(function () {

                    path = 'boats/' + team2Boat1.getPathKey();
                    boat = team2Boat1.getValues({
                        reference: false
                    });
                    boat.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, boat, done);

                });

            });

            describe('as user with active auth (team1User1Auth1) updating individual values of another teams boat (team2Boat1)', function () {

                const appName = 'team1User1Auth1';

                const path = 'boats/' + team2Boat1.getPathKey();
                const boat = team2Boat1.getValues({
                    reference: false
                });

                const boatKeys = Object.keys(boat);

                for (let x = 0; x < boatKeys.length; x++) {

                    if (boatKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + boatKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[boatKeys[x]] = boat[boatKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < boatKeys.length; x++) {

                    if (boatKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + boatKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[boatKeys[x]] = boat[boatKeys[x]];

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

            describe('as user with active auth (team1User1Auth1) set values of another teams boat', function () {
                const appName = 'team1User1Auth1';
                let path;
                let boat;

                beforeEach(function () {

                    path = 'boats/' + team2Boat1.getPathKey();
                    boat = team2Boat1.getValues({
                        reference: false
                    });
                    boat.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                });

                it('should not write, valid prior data', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, boat, done);

                });

                it('should not write empty boat', function (done) {

                    boat = {};
                    assert.cannotSet(firebaseAdmin.app(appName), path, boat, done);

                });

                it('should not write null boat', function (done) {

                    boat = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, boat, done);

                });

                it('should not write null to team', function (done) {

                    boat.team = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, boat, done);

                });

                it('should not write to another team', function (done) {
                    boat.team = team2.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, boat, done);
                });

                it('should not write a different, valid manufacturer', function (done) {

                    boat.manufacturer = faker.lorem.word();
                    assert.cannotSet(firebaseAdmin.app(appName), path, boat, done);

                });

                it('should not write null to manufacturer', function (done) {

                    boat.manufacturer = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, boat, done);

                });

                it('should not write a different, valid name', function (done) {

                    boat.name = faker.name.lastName();
                    assert.cannotSet(firebaseAdmin.app(appName), path, boat, done);

                });

                it('should not write null to name', function (done) {

                    boat.name = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, boat, done);

                });

                it('should not be able to change rigging', function (done) {

                    boat.rigging = faker.lorem.word();
                    assert.cannotSet(firebaseAdmin.app(appName), path, boat, done);

                });

                it('should not write null to rigging', function (done) {

                    boat.rigging = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, boat, done);

                });

                it('should not write Number to size', function (done) {

                    boat.size = 44;
                    assert.cannotSet(firebaseAdmin.app(appName), path, boat, done);

                });

                it('should not write Null to size', function (done) {

                    boat.size = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, boat, done);

                });

                it('should not write String to type', function (done) {

                    boat.type = faker.lorem.word();
                    assert.cannotSet(firebaseAdmin.app(appName), path, boat, done);

                });

                it('should not write Null to type', function (done) {

                    boat.type = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, boat, done);
                });
            });

            describe('as user with active auth (team1User1Auth2) updating individual values of the same teams boat (team1Boat1)', function () {

                const appName = 'team1User1Auth2';

                const path = 'boats/' + team1Boat1.getPathKey();
                const boat = team1Boat1.getValues({
                    reference: false
                });

                const boatKeys = Object.keys(boat);

                for (let x = 0; x < boatKeys.length; x++) {

                    if (boatKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + boatKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[boatKeys[x]] = boat[boatKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < boatKeys.length; x++) {

                    if (boatKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + boatKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[boatKeys[x]] = boat[boatKeys[x]];

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

            describe('as user with inactive auth (team1User1Auth2) set values of the same teams boat (team1Boat1)', function () {

                const appName = 'team1User1Auth2';
                let path;
                let boat;

                beforeEach(function () {

                    path = 'boats/' + team1Boat1.getPathKey();
                    boat = team1Boat1.getValues({
                        reference: false
                    });
                    boat.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, boat, done);

                });

            });

            describe('as a user with an active auth (team1User1Auth1)  remove boats on a different team', function () {
                const appName = 'team1User3Auth1';
                let path = 'boats/' + team1Boat3.getPathKey();

                it('admin is removing the teams boat', function (done) {
                    assert.canSet(firebaseAdmin.app(appName), path, null, done);

                });

                const newApp = 'team1User1Auth1';
                it('a user without the correct permisions should not remove a teams boat', function (done) {
                    assert.cannotSet(firebaseAdmin.app(newApp), path, null, done);
                });

                it('should not remove a different teams boat', function (done) {
                    path = 'boats/' + team2Boat2.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, null, done);
                });

            });

            describe('as a user with active auth (team1User3Auth1) updating values of a deleted boat', function () {
                let appName = 'team1User1Auth1';
                const path = 'boats/';
                const boat = team1Boat3.getValues({
                    reference: true
                });

                const boatKeys = Object.keys(boat);

                for (let x = 0; x < boatKeys.length; x++) {

                    if (boatKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + boatKeys[x] + '` with prior data and an updated timestamp', function (done) {
                        const value = {};
                        value[boatKeys[x]] = boat[boatKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < boatKeys.length; x++) {

                    if (boatKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + boatKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[boatKeys[x]] = boat[boatKeys[x]];

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

            describe('create new boats', function () {
                const appName = 'team1User1Auth1';
                const path = 'boats';

                it('should add a new boat to the team', function (done) {
                    const boat = team1.createBoat();
                    const values = boat.getValues({
                        reference: false
                    });
                    values.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    values.created = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    assert.canPush(firebaseAdmin.app(appName), path, values, done);
                });

                it('it should not add a new boat to a different team', function (done) {
                    const boat = team2.createBoat();
                    const values = boat.getValues({
                        reference: false
                    });

                    values.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    values.created = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    assert.cannotPush(firebaseAdmin.app(appName), path, values, done);
                });
            });
        });

        describe('Email tests', function () {

            describe('as user with active auth (team1User1Auth1) updating individual values of an email (team1User1Email1)', function () {

                const appName = 'team1User1Auth1';

                const path = 'emails/' + team1User1Email1.getPathKey();
                const email = team1User1Email1.getValues({
                    reference: false
                });

                const emailKeys = Object.keys(email);

                for (let x = 0; x < emailKeys.length; x++) {

                    if (emailKeys[x] === 'updated') {
                        continue;
                    }

                    it('should update `' + emailKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[emailKeys[x]] = email[emailKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                        assert.canUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < emailKeys.length; x++) {

                    if (emailKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + emailKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[emailKeys[x]] = email[emailKeys[x]];

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

            describe('as user with active auth (team1User1Auth1) set values of the same teams email', function () {
                const appName = 'team1User1Auth1';
                let path;
                let email;

                beforeEach(function () {

                    path = 'emails/' + team1User1Email1.getPathKey();
                    email = team1User1Email1.getValues({
                        reference: false
                    });
                    email.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                });

                it('should write, valid prior data', function (done) {

                    assert.canSet(firebaseAdmin.app(appName), path, email, done);

                });

                it('should not write empty email', function (done) {

                    email = {};
                    assert.cannotSet(firebaseAdmin.app(appName), path, email, done);

                });

                it('should not write null email', function (done) {

                    email = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, email, done);

                });

                it('should write a different, valid value', function (done) {

                    email.value = faker.internet.email();
                    assert.canSet(firebaseAdmin.app(appName), path, email, done);

                });

                it('should not write null to value', function (done) {

                    email.value = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, email, done);

                });
            });

            describe('as user with active auth (team1User1Auth1) setting email of another team (team2User1Email1)', function () {

                const appName = 'team1User1Auth1';
                let path;
                let email;

                beforeEach(function () {

                    path = 'emails/' + team2User1Email1.getPathKey();
                    email = team2User1Email1.getValues({
                        reference: false
                    });
                    email.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, email, done);

                });

            });

            describe('as user with active auth (team1User1Auth1) updating individual values of another teams email (team2User1Email1)', function () {

                const appName = 'team1User1Auth1';

                const path = 'emails/' + team2User1Email1.getPathKey();
                const email = team2User1Email1.getValues({
                    reference: false
                });

                const emailKeys = Object.keys(email);

                for (let x = 0; x < emailKeys.length; x++) {

                    if (emailKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + emailKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[emailKeys[x]] = email[emailKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < emailKeys.length; x++) {

                    if (emailKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + emailKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[emailKeys[x]] = email[emailKeys[x]];

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

            describe('as user with active auth (team1User1Auth1) set values of another teams email', function () {
                const appName = 'team1User1Auth1';
                let path;
                let email;

                beforeEach(function () {

                    path = 'emails/' + team2User1Email1.getPathKey();
                    email = team2User1Email1.getValues({
                        reference: false
                    });
                    email.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                });

                it('should not write, valid prior data', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, email, done);

                });

                it('should not write empty email', function (done) {

                    email = {};
                    assert.cannotSet(firebaseAdmin.app(appName), path, email, done);

                });

                it('should not write null email', function (done) {

                    email = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, email, done);

                });

                it('should not write a different, valid value', function (done) {

                    email.value = faker.internet.email();
                    assert.cannotSet(firebaseAdmin.app(appName), path, email, done);

                });

                it('should not write null to value', function (done) {

                    email.value = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, email, done);

                });
            });

            describe('as user with inactive auth (team1User1Auth2) updating individual values of an email (team1User1Email1)', function () {

                const appName = 'team1User1Auth2';

                const path = 'emails/' + team1User1Email1.getPathKey();
                const email = team1User1Email1.getValues({
                    reference: false
                });

                const emailKeys = Object.keys(email);

                for (let x = 0; x < emailKeys.length; x++) {

                    if (emailKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + emailKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[emailKeys[x]] = email[emailKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < emailKeys.length; x++) {

                    if (emailKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + emailKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[emailKeys[x]] = email[emailKeys[x]];

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

            describe('as user with inactive auth (team1User1Auth2) set values the same teams emails (team1User1Email1)', function () {

                const appName = 'team1User1Auth2';
                let path;
                let email;

                beforeEach(function () {

                    path = 'emails/' + team1User1Email1.getPathKey();
                    email = team1User1Email1.getValues({
                        reference: false
                    });
                    email.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, email, done);

                });

            });

            describe('as a user with an active auth (team1User1Auth1)  remove emails on a different team', function () {
                const appName = 'team1User3Auth1';
                let path = 'emails/' + team1User3Email1.getPathKey();

                it('admin is removing the teams email', function (done) {
                    assert.canSet(firebaseAdmin.app(appName), path, null, done);

                });

                const newApp = 'team1User1Auth1';
                it('a user without the correct permisions should not remove a teams email', function (done) {
                    assert.cannotSet(firebaseAdmin.app(newApp), path, null, done);
                });

                it('should not remove a different teams email', function (done) {
                    path = 'emails/' + team2User1Email1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, null, done);
                });

            });

            describe('as a user with active auth (team1User3Auth1) updating values of a deleted email', function () {
                let appName = 'team1User1Auth1';
                const path = 'emails/';
                const email = team1User3Email1.getValues({
                    reference: true
                });

                const emailKeys = Object.keys(email);

                for (let x = 0; x < emailKeys.length; x++) {

                    if (emailKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + emailKeys[x] + '` with prior data and an updated timestamp', function (done) {
                        const value = {};
                        value[emailKeys[x]] = email[emailKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < emailKeys.length; x++) {

                    if (emailKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + emailKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[emailKeys[x]] = email[emailKeys[x]];

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

            describe('create new emails', function () {
                const appName = 'team1User1Auth1';
                const path = 'emails';

                it('should add a new email to the team', function (done) {
                    const email = team1User1.createEmail();
                    const values = email.getValues({
                        reference: false
                    });
                    values.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    values.created = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    assert.canPush(firebaseAdmin.app(appName), path, values, done);
                });

                it('it should not add a new email to a different team', function (done) {
                    const email = team2User1.createEmail();
                    const values = email.getValues({
                        reference: false
                    });

                    values.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    values.created = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    assert.cannotPush(firebaseAdmin.app(appName), path, values, done);
                });
            });
        });

        describe('Erg tests', function () {

            describe('as user with active auth (team1User1Auth1) updating individual values of an erg (team1Erg1)', function () {

                const appName = 'team1User1Auth1';

                const path = 'ergs/' + team1Erg1.getPathKey();
                const erg = team1Erg1.getValues({
                    reference: false
                });

                const ergKeys = Object.keys(erg);

                for (let x = 0; x < ergKeys.length; x++) {

                    if (ergKeys[x] === 'updated') {
                        continue;
                    }

                    it('should update `' + ergKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[ergKeys[x]] = erg[ergKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                        assert.canUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < ergKeys.length; x++) {

                    if (ergKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + ergKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[ergKeys[x]] = erg[ergKeys[x]];

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

                it('should not write null to team', function (done) {

                    erg.team = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, erg, done);

                });

                it('should not write to another team', function (done) {
                    erg.team = team2.getPathKey();
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

            describe('as user with active auth (team1User1Auth1) setting erg of another team (team2Erg1)', function () {

                const appName = 'team1User1Auth1';
                let path;
                let erg;

                beforeEach(function () {

                    path = 'ergs/' + team2Erg1.getPathKey();
                    erg = team2Erg1.getValues({
                        reference: false
                    });
                    erg.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, erg, done);

                });

            });

            describe('as user with active auth (team1User1Auth1) updating individual values of another teams erg (team2Erg1)', function () {

                const appName = 'team1User1Auth1';

                const path = 'ergs/' + team2Erg1.getPathKey();
                const erg = team2Erg1.getValues({
                    reference: false
                });

                const ergKeys = Object.keys(erg);

                for (let x = 0; x < ergKeys.length; x++) {

                    if (ergKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + ergKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[ergKeys[x]] = erg[ergKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < ergKeys.length; x++) {

                    if (ergKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + ergKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[ergKeys[x]] = erg[ergKeys[x]];

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

            describe('as user with active auth (team1User1Auth1) set values of another teams erg', function () {
                const appName = 'team1User1Auth1';
                let path;
                let erg;

                beforeEach(function () {

                    path = 'ergs/' + team2Erg1.getPathKey();
                    erg = team2Erg1.getValues({
                        reference: false
                    });
                    erg.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                });

                it('should not write, valid prior data', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, erg, done);

                });

                it('should not write empty erg', function (done) {

                    erg = {};
                    assert.cannotSet(firebaseAdmin.app(appName), path, erg, done);

                });

                it('should not write null erg', function (done) {

                    erg = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, erg, done);

                });

                it('should not write null to team', function (done) {

                    erg.team = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, erg, done);

                });

                it('should not write to another team', function (done) {
                    erg.team = team2.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, erg, done);
                });

                it('should not write a different, valid condition', function (done) {

                    erg.condition = faker.lorem.word();
                    assert.cannotSet(firebaseAdmin.app(appName), path, erg, done);

                });

                it('should not write null to condition', function (done) {

                    erg.condition = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, erg, done);

                });

                it('should not write a different, valid location', function (done) {

                    erg.location = faker.name.lastName();
                    assert.cannotSet(firebaseAdmin.app(appName), path, erg, done);

                });

                it('should not write null to location', function (done) {

                    erg.location = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, erg, done);

                });

                it('should not be able to change model', function (done) {

                    erg.model = faker.lorem.word();
                    assert.cannotSet(firebaseAdmin.app(appName), path, erg, done);

                });

                it('should not write null to model', function (done) {

                    erg.model = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, erg, done);

                });

                it('should not write Number to number', function (done) {

                    erg.number = 44;
                    assert.cannotSet(firebaseAdmin.app(appName), path, erg, done);

                });

                it('should not write Null to number', function (done) {

                    erg.number = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, erg, done);

                });

                it('should not write String to screenType', function (done) {

                    erg.screenType = faker.lorem.word();
                    assert.cannotSet(firebaseAdmin.app(appName), path, erg, done);

                });

                it('should not write Null to screenType', function (done) {

                    erg.screenType = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, erg, done);
                });
            });

            describe('as user with inactive auth (team1User1Auth2) updating individual values of an erg (team1Erg1)', function () {

                const appName = 'team1User1Auth2';

                const path = 'ergs/' + team1Erg1.getPathKey();
                const erg = team1Erg1.getValues({
                    reference: false
                });

                const ergKeys = Object.keys(erg);

                for (let x = 0; x < ergKeys.length; x++) {

                    if (ergKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + ergKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[ergKeys[x]] = erg[ergKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < ergKeys.length; x++) {

                    if (ergKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + ergKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[ergKeys[x]] = erg[ergKeys[x]];

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

            describe('as user with inactive auth (team1User1Auth2) set values the same teams ergs (team1Erg1)', function () {

                const appName = 'team1User1Auth2';
                let path;
                let erg;

                beforeEach(function () {

                    path = 'ergs/' + team1Erg1.getPathKey();
                    erg = team1Erg1.getValues({
                        reference: false
                    });
                    erg.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, erg, done);

                });

            });

            describe('as a user with an active auth (team1User1Auth1)  remove ergs on a different team', function () {
                const appName = 'team1User3Auth1';
                let path = 'ergs/' + team1Erg3.getPathKey();

                it('admin is removing the teams erg', function (done) {
                    assert.canSet(firebaseAdmin.app(appName), path, null, done);

                });

                const newApp = 'team1User1Auth1';
                it('a user without the correct permisions should not remove a teams erg', function (done) {
                    assert.cannotSet(firebaseAdmin.app(newApp), path, null, done);
                });

                it('should not remove a different teams erg', function (done) {
                    path = 'ergs/' + team2Erg2.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, null, done);
                });

            });

            describe('as a user with active auth (team1User3Auth1) updating values of a deleted erg', function () {
                let appName = 'team1User1Auth1';
                const path = 'ergs/';
                const erg = team1Erg3.getValues({
                    reference: true
                });

                const ergKeys = Object.keys(erg);

                for (let x = 0; x < ergKeys.length; x++) {

                    if (ergKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + ergKeys[x] + '` with prior data and an updated timestamp', function (done) {
                        const value = {};
                        value[ergKeys[x]] = erg[ergKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < ergKeys.length; x++) {

                    if (ergKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + ergKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[ergKeys[x]] = erg[ergKeys[x]];

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

            describe('create new ergs', function () {
                const appName = 'team1User1Auth1';
                const path = 'ergs';

                it('should add a new erg to the team', function (done) {
                    const erg = team1.createErg();
                    const values = erg.getValues({
                        reference: false
                    });
                    values.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    values.created = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    assert.canPush(firebaseAdmin.app(appName), path, values, done);
                });

                it('it should not add a new erg to a different team', function (done) {
                    const erg = team2.createErg();
                    const values = erg.getValues({
                        reference: false
                    });

                    values.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    values.created = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    assert.cannotPush(firebaseAdmin.app(appName), path, values, done);
                });
            });
        });

        describe('Finance tests', function () {

            describe('as user with active auth (team1User1Auth1) updating individual values of an finance (team1Finance1)', function () {

                const appName = 'team1User1Auth1';

                const path = 'finances/' + team1Finance1.getPathKey();
                const finance = team1Finance1.getValues({
                    reference: false
                });
                const financeKeys = Object.keys(finance);

                for (let x = 0; x < financeKeys.length; x++) {

                    if (financeKeys[x] === 'updated') {
                        continue;
                    }

                    it('should update `' + financeKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[financeKeys[x]] = finance[financeKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                        assert.canUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < financeKeys.length; x++) {

                    if (financeKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + financeKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[financeKeys[x]] = finance[financeKeys[x]];

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

                it('should not write null to team', function (done) {

                    finance.team = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, finance, done);

                });

                it('should not write to another team', function (done) {
                    finance.team = team2.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, finance, done);
                });

                it('should write Number to valid expenses', function (done) {

                    finance.expenses = faker.random.number();
                    assert.canSet(firebaseAdmin.app(appName), path, finance, done);

                });

                it('should not write null to expenses', function (done) {

                    finance.expenses = null;
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

            describe('as user with active auth (team1User1Auth1) setting finance of another team (team2Finance1)', function () {

                const appName = 'team1User1Auth1';
                let path;
                let finance;

                beforeEach(function () {

                    path = 'finances/' + team2Finance1.getPathKey();
                    finance = team2Finance1.getValues({
                        reference: false
                    });
                    finance.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, finance, done);

                });

            });

            describe('as user with active auth (team1User1Auth1) updating individual values of another teams finance (team2Finance1)', function () {

                const appName = 'team1User1Auth1';

                const path = 'finances/' + team2Finance1.getPathKey();
                const finance = team2Finance1.getValues({
                    reference: false
                });
                const financeKeys = Object.keys(finance);

                for (let x = 0; x < financeKeys.length; x++) {

                    if (financeKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + financeKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[financeKeys[x]] = finance[financeKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < financeKeys.length; x++) {

                    if (financeKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + financeKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[financeKeys[x]] = finance[financeKeys[x]];

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

            describe('as user with active auth (team1User1Auth1) set values of another teams finance', function () {
                const appName = 'team1User1Auth1';
                let path;
                let finance;

                beforeEach(function () {

                    path = 'finances/' + team2Finance1.getPathKey();
                    finance = team2Finance1.getValues({
                        reference: false
                    });
                    finance.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write, valid prior data', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, finance, done);

                });

                it('should not write empty finance', function (done) {

                    finance = {};
                    assert.cannotSet(firebaseAdmin.app(appName), path, finance, done);

                });

                it('should not write null finance', function (done) {

                    finance = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, finance, done);

                });

                it('should not write null to team', function (done) {

                    finance.team = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, finance, done);

                });

                it('should not write to another team', function (done) {
                    finance.team = team2.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, finance, done);
                });

                it('should not write Number to valid expenses', function (done) {

                    finance.expenses = faker.random.number();
                    assert.cannotSet(firebaseAdmin.app(appName), path, finance, done);

                });

                it('should not write null to expenses', function (done) {

                    finance.expenses = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, finance, done);

                });

                it('should not write Number to valid gross', function (done) {

                    finance.gross = faker.random.number();
                    assert.cannotSet(firebaseAdmin.app(appName), path, finance, done);

                });

                it('should not write null to gross', function (done) {

                    finance.gross = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, finance, done);

                });

                it('should not write Number to incomes', function (done) {

                    finance.incomes = faker.random.number();
                    assert.cannotSet(firebaseAdmin.app(appName), path, finance, done);

                });

                it('should not write null to incomes', function (done) {

                    finance.incomes = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, finance, done);

                });

                it('should not write String to reason', function (done) {

                    finance.reason = faker.lorem.word();
                    assert.cannotSet(firebaseAdmin.app(appName), path, finance, done);

                });

                it('should not write Null to reason', function (done) {

                    finance.reason = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, finance, done);

                });
            });

            describe('as user with inactive auth (team1User1Auth2) set values of the same teams finances (team1Finance1)', function () {

                const appName = 'team1User1Auth2';
                let path;
                let finance;

                beforeEach(function () {

                    path = 'finances/' + team1Finance1.getPathKey();
                    finance = team1Finance1.getValues({
                        reference: false
                    });
                    finance.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, finance, done);

                });

            });

            describe('as a user with an active auth (team1User1Auth1)  remove finances on a different team', function () {
                const appName = 'team1User3Auth1';
                let path = 'finances/' + team1Finance3.getPathKey();

                it('admin is removing the teams finance', function (done) {
                    assert.canSet(firebaseAdmin.app(appName), path, null, done);

                });

                const newApp = 'team1User1Auth1';
                it('a user without the correct permisions should not remove a teams finance', function (done) {
                    assert.cannotSet(firebaseAdmin.app(newApp), path, null, done);
                });

                it('should not remove a different teams finance', function (done) {
                    path = 'finances/' + team2Finance2.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, null, done);
                });

            });

            describe('as a user with active auth (team1User3Auth1) updating values of a deleted finance', function () {
                let appName = 'team1User1Auth1';
                const path = 'finances/';
                const finance = team1Finance3.getValues({
                    reference: true
                });

                const financeKeys = Object.keys(finance);

                for (let x = 0; x < financeKeys.length; x++) {

                    if (financeKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + financeKeys[x] + '` with prior data and an updated timestamp', function (done) {
                        const value = {};
                        value[financeKeys[x]] = finance[financeKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < financeKeys.length; x++) {

                    if (financeKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + financeKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[financeKeys[x]] = finance[financeKeys[x]];

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

            describe('create new finances', function () {
                const appName = 'team1User1Auth1';
                const path = 'finances';

                it('should add a new finance to the team', function (done) {
                    const finance = team1.createFinance();
                    const values = finance.getValues({
                        reference: false
                    });
                    values.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    values.created = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    assert.canPush(firebaseAdmin.app(appName), path, values, done);
                });

                it('it should not add a new finance to a different team', function (done) {
                    const finance = team2.createFinance();
                    const values = finance.getValues({
                        reference: false
                    });

                    values.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    values.created = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    assert.cannotPush(firebaseAdmin.app(appName), path, values, done);
                });
            });
        });

        describe('Oar tests', function () {

            describe('as user with active auth (team1User1Auth1) updating individual values of an oar (team1Oar1)', function () {

                const appName = 'team1User1Auth1';

                const path = 'oars/' + team1Oar1.getPathKey();
                const oar = team1Oar1.getValues({
                    reference: false
                });
                const oarKeys = Object.keys(oar);

                for (let x = 0; x < oarKeys.length; x++) {

                    if (oarKeys[x] === 'updated') {
                        continue;
                    }

                    it('should update `' + oarKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[oarKeys[x]] = oar[oarKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                        assert.canUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < oarKeys.length; x++) {

                    if (oarKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + oarKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[oarKeys[x]] = oar[oarKeys[x]];

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

                it('should not write null to team', function (done) {

                    oar.team = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, oar, done);

                });

                it('should not write to another team', function (done) {
                    oar.team = team2.getPathKey();
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

            describe('as user with active auth (team1User1Auth1) setting oar of another team (team2Oar1)', function () {

                const appName = 'team1User1Auth1';
                let path;
                let oar;

                beforeEach(function () {

                    path = 'oars/' + team2Oar1.getPathKey();
                    oar = team2Oar1.getValues({
                        reference: false
                    });
                    oar.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, oar, done);

                });

            });

            describe('as user with active auth (team1User1Auth1) updating individual values of another teams oar (team1Oar1)', function () {

                const appName = 'team1User1Auth1';

                const path = 'oars/' + team2Oar1.getPathKey();
                const oar = team2Oar1.getValues({
                    reference: false
                });
                const oarKeys = Object.keys(oar);

                for (let x = 0; x < oarKeys.length; x++) {

                    if (oarKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + oarKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[oarKeys[x]] = oar[oarKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < oarKeys.length; x++) {

                    if (oarKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + oarKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[oarKeys[x]] = oar[oarKeys[x]];

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

            describe('as user with active auth (team1User1Auth1) set values of another teams oar', function () {
                const appName = 'team1User1Auth1';
                let path;
                let oar;

                beforeEach(function () {

                    path = 'oars/' + team2Oar1.getPathKey();
                    oar = team2Oar1.getValues({
                        reference: false
                    });
                    oar.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write, valid prior data', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, oar, done);

                });

                it('should not write empty oar', function (done) {

                    oar = {};
                    assert.cannotSet(firebaseAdmin.app(appName), path, oar, done);

                });

                it('should not write null oar', function (done) {

                    oar = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, oar, done);

                });

                it('should not write null to team', function (done) {

                    oar.team = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, oar, done);

                });

                it('should not write to another team', function (done) {
                    oar.team = team2.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, oar, done);
                });

                it('should not write a different, valid color', function (done) {

                    oar.color = faker.commerce.color();
                    assert.cannotSet(firebaseAdmin.app(appName), path, oar, done);

                });

                it('should not write null to color', function (done) {

                    oar.color = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, oar, done);

                });

                it('should not write a different, valid handleGrip', function (done) {

                    oar.handleGrip = faker.lorem.word();
                    assert.cannotSet(firebaseAdmin.app(appName), path, oar, done);

                });

                it('should not write null to handleGrip', function (done) {

                    oar.handleGrip = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, oar, done);

                });

                it('should not be able to change name', function (done) {

                    oar.name = faker.name.lastName();
                    assert.cannotSet(firebaseAdmin.app(appName), path, oar, done);

                });

                it('should not write null to name', function (done) {

                    oar.name = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, oar, done);

                });

                it('should not write Number to length', function (done) {

                    oar.length = faker.random.number();
                    assert.cannotSet(firebaseAdmin.app(appName), path, oar, done);

                });

                it('should not write Null to length', function (done) {

                    oar.length = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, oar, done);

                });

                it('should not write String to shape', function (done) {

                    oar.shape = faker.lorem.word();
                    assert.cannotSet(firebaseAdmin.app(appName), path, oar, done);

                });

                it('should not write Null to shape', function (done) {

                    oar.shape = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, oar, done);
                });
            });

            describe('as user with active auth (team1User1Auth2) updating individual values of an oar (team1Oar1)', function () {

                const appName = 'team1User1Auth2';

                const path = 'oars/' + team1Oar1.getPathKey();
                const oar = team1Oar1.getValues({
                    reference: false
                });
                const oarKeys = Object.keys(oar);

                for (let x = 0; x < oarKeys.length; x++) {

                    if (oarKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + oarKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[oarKeys[x]] = oar[oarKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < oarKeys.length; x++) {

                    if (oarKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + oarKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[oarKeys[x]] = oar[oarKeys[x]];

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

            describe('as user with inactive auth (team1User1Auth2) set values of the same teams oars (team1Oar1)', function () {

                const appName = 'team1User1Auth2';
                let path;
                let oar;

                beforeEach(function () {

                    path = 'oars/' + team1Oar1.getPathKey();
                    oar = team1Oar1.getValues({
                        reference: false
                    });
                    oar.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, oar, done);

                });

            });

            describe('as a user with an active auth (team1User1Auth1)  remove oars on a different team', function () {
                const appName = 'team1User3Auth1';
                let path = 'oars/' + team1Oar3.getPathKey();

                it('admin is removing the teams oar', function (done) {
                    assert.canSet(firebaseAdmin.app(appName), path, null, done);

                });

                const newApp = 'team1User1Auth1';
                it('a user without the correct permisions should not remove a teams oar', function (done) {
                    assert.cannotSet(firebaseAdmin.app(newApp), path, null, done);
                });

                it('should not remove a different teams oar', function (done) {
                    path = 'oars/' + team2Oar2.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, null, done);
                });

            });

            describe('as a user with active auth (team1User3Auth1) updating values of a deleted oar', function () {
                let appName = 'team1User1Auth1';
                const path = 'oars/';
                const oar = team1Oar3.getValues({
                    reference: true
                });

                const oarKeys = Object.keys(oar);

                for (let x = 0; x < oarKeys.length; x++) {

                    if (oarKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + oarKeys[x] + '` with prior data and an updated timestamp', function (done) {
                        const value = {};
                        value[oarKeys[x]] = oar[oarKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < oarKeys.length; x++) {

                    if (oarKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + oarKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[oarKeys[x]] = oar[oarKeys[x]];

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

            describe('create new oars', function () {
                const appName = 'team1User1Auth1';
                const path = 'oars';

                it('should add a new oar to the team', function (done) {
                    const oar = team1.createOar();
                    const values = oar.getValues({
                        reference: false
                    });
                    values.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    values.created = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    assert.canPush(firebaseAdmin.app(appName), path, values, done);
                });

                it('it should not add a new oar to a different team', function (done) {
                    const oar = team2.createOar();
                    const values = oar.getValues({
                        reference: false
                    });

                    values.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    values.created = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    assert.cannotPush(firebaseAdmin.app(appName), path, values, done);
                });
            });
        });

        describe('Picture tests', function () {

            describe('as user with active auth (team1User1Auth1) updating individual values of an picture (team1Regatta1)', function () {

                const appName = 'team1User1Auth1';

                const path = 'pictures/' + team1Picture1.getPathKey();
                const picture = team1Picture1.getValues({
                    reference: false
                });
                const pictureKeys = Object.keys(picture);

                for (let x = 0; x < pictureKeys.length; x++) {

                    if (pictureKeys[x] === 'updated') {
                        continue;
                    }

                    it('should update `' + pictureKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[pictureKeys[x]] = picture[pictureKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                        assert.canUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < pictureKeys.length; x++) {

                    if (pictureKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + pictureKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[pictureKeys[x]] = picture[pictureKeys[x]];

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

                it('should not write null to team', function (done) {

                    picture.team = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, picture, done);

                });

                it('should not write to another team', function (done) {
                    picture.team = team2.getPathKey();
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

            describe('as user with active auth (team1User1Auth1) setting picture of another team (team2Picture1)', function () {

                const appName = 'team1User1Auth1';
                let path;
                let picture;

                beforeEach(function () {

                    path = 'pictures/' + team2Picture1.getPathKey();
                    picture = team2Picture1.getValues({
                        reference: false
                    });
                    picture.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, picture, done);

                });

            });

            describe('as user with active auth (team1User1Auth1) updating individual values of another teams picture (team1Regatta1)', function () {

                const appName = 'team1User1Auth1';

                const path = 'pictures/' + team2Picture1.getPathKey();
                const picture = team2Picture1.getValues({
                    reference: false
                });
                const pictureKeys = Object.keys(picture);

                for (let x = 0; x < pictureKeys.length; x++) {

                    if (pictureKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + pictureKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[pictureKeys[x]] = picture[pictureKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < pictureKeys.length; x++) {

                    if (pictureKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + pictureKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[pictureKeys[x]] = picture[pictureKeys[x]];

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

            describe('as user with active auth (team1User1Auth1) set values of another teams picture', function () {
                const appName = 'team1User1Auth1';
                let path;
                let picture;

                beforeEach(function () {

                    path = 'pictures/' + team2Picture1.getPathKey();
                    picture = team2Picture1.getValues({
                        reference: false
                    });
                    picture.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write, valid prior data', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, picture, done);

                });

                it('should not write empty picture', function (done) {

                    picture = {};
                    assert.cannotSet(firebaseAdmin.app(appName), path, picture, done);

                });

                it('should not write null picture', function (done) {

                    picture = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, picture, done);

                });

                it('should not write null to team', function (done) {

                    picture.team = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, picture, done);

                });

                it('should not write to another team', function (done) {
                    picture.team = team2.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, picture, done);
                });

                it('should not write a different, valid caption', function (done) {

                    picture.caption = faker.lorem.words();
                    assert.cannotSet(firebaseAdmin.app(appName), path, picture, done);

                });

                it('should not write null to caption', function (done) {

                    picture.caption = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, picture, done);

                });

                it('should not write a different, valid url', function (done) {

                    picture.url = faker.image.imageUrl();
                    assert.cannotSet(firebaseAdmin.app(appName), path, picture, done);

                });

                it('should not write null to url', function (done) {

                    picture.url = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, picture, done);

                });
            });

            describe('as user with active auth (team1User1Auth2) updating individual values of an picture (team1Regatta1)', function () {

                const appName = 'team1User1Auth2';

                const path = 'pictures/' + team1Picture1.getPathKey();
                const picture = team1Picture1.getValues({
                    reference: false
                });
                const pictureKeys = Object.keys(picture);

                for (let x = 0; x < pictureKeys.length; x++) {

                    if (pictureKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + pictureKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[pictureKeys[x]] = picture[pictureKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < pictureKeys.length; x++) {

                    if (pictureKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + pictureKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[pictureKeys[x]] = picture[pictureKeys[x]];

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

            describe('as user with inactive auth (team1User1Auth2) set values of the same teams pictures (team1Picture1)', function () {

                const appName = 'team1User1Auth2';
                let path;
                let picture;

                beforeEach(function () {

                    path = 'pictures/' + team1Picture1.getPathKey();
                    picture = team1Picture1.getValues({
                        reference: false
                    });
                    picture.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, picture, done);

                });

            });

            describe('as a user with an active auth (team1User1Auth1)  remove pictures on a different team', function () {
                const appName = 'team1User3Auth1';
                let path = 'pictures/' + team1Picture3.getPathKey();

                it('admin is removing the teams picture', function (done) {
                    assert.canSet(firebaseAdmin.app(appName), path, null, done);

                });

                const newApp = 'team1User1Auth1';
                it('a user without the correct permisions should not remove a teams picture', function (done) {
                    assert.cannotSet(firebaseAdmin.app(newApp), path, null, done);
                });

                it('should not remove a different teams picture', function (done) {
                    path = 'pictures/' + team2Picture2.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, null, done);
                });

            });

            describe('as a user with active auth (team1User3Auth1) updating values of a deleted picture', function () {
                let appName = 'team1User1Auth1';
                const path = 'pictures/';
                const picture = team1Picture3.getValues({
                    reference: true
                });

                const pictureKeys = Object.keys(picture);

                for (let x = 0; x < pictureKeys.length; x++) {

                    if (pictureKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + pictureKeys[x] + '` with prior data and an updated timestamp', function (done) {
                        const value = {};
                        value[pictureKeys[x]] = picture[pictureKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < pictureKeys.length; x++) {

                    if (pictureKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + pictureKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[pictureKeys[x]] = picture[pictureKeys[x]];

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

            describe('create new pictures', function () {
                const appName = 'team1User1Auth1';
                const path = 'pictures';

                it('should add a new picture to the team', function (done) {
                    const picture = team1.createPicture();
                    const values = picture.getValues({
                        reference: false
                    });
                    values.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    values.created = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    assert.canPush(firebaseAdmin.app(appName), path, values, done);
                });

                it('it should not add a new picture to a different team', function (done) {
                    const picture = team2.createPicture();
                    const values = picture.getValues({
                        reference: false
                    });

                    values.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    values.created = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    assert.cannotPush(firebaseAdmin.app(appName), path, values, done);
                });
            });
        });

        describe('Race tests', function () {

            describe('as user with active auth (team1User1Auth1) updating individual values of an race (team1Race1)', function () {

                const appName = 'team1User1Auth1';

                const path = 'races/' + team1Race1.getPathKey();
                const race = team1Race1.getValues({
                    reference: false
                });
                const raceKeys = Object.keys(race);

                for (let x = 0; x < raceKeys.length; x++) {

                    if (raceKeys[x] === 'updated') {
                        continue;
                    }

                    it('should update `' + raceKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[raceKeys[x]] = race[raceKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                        assert.canUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < raceKeys.length; x++) {

                    if (raceKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + raceKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[raceKeys[x]] = race[raceKeys[x]];

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

                it('should not write null to team', function (done) {

                    race.team = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, race, done);

                });

                it('should not write to another team', function (done) {
                    race.team = team2.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, race, done);
                });

                it('should write a different, valid bowNumber', function (done) {

                    race.bowNumber = 2;
                    assert.canSet(firebaseAdmin.app(appName), path, race, done);

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

            describe('as user with active auth (team1User1Auth1) setting race of another team (team2Race1)', function () {

                const appName = 'team1User1Auth1';
                let path;
                let race;

                beforeEach(function () {

                    path = 'races/' + team2Race1.getPathKey();
                    race = team2Race1.getValues({
                        reference: false
                    });
                    race.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, race, done);

                });

            });

            describe('as user with active auth (team1User1Auth1) updating individual values of another teams race (team1Race1)', function () {

                const appName = 'team1User1Auth1';

                const path = 'races/' + team2Race1.getPathKey();
                const race = team2Race1.getValues({
                    reference: false
                });
                const raceKeys = Object.keys(race);

                for (let x = 0; x < raceKeys.length; x++) {

                    if (raceKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + raceKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[raceKeys[x]] = race[raceKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < raceKeys.length; x++) {

                    if (raceKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + raceKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[raceKeys[x]] = race[raceKeys[x]];

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

            describe('as user with active auth (team1User1Auth1) set values of another teams race', function () {
                const appName = 'team1User1Auth1';
                let path;
                let race;

                beforeEach(function () {

                    path = 'races/' + team2Race1.getPathKey();
                    race = team2Race1.getValues({
                        reference: false
                    });
                    race.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write, valid prior data', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, race, done);

                });

                it('should not write empty race', function (done) {

                    race = {};
                    assert.cannotSet(firebaseAdmin.app(appName), path, race, done);

                });

                it('should not write null race', function (done) {

                    race = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, race, done);

                });

                it('should not write null to team', function (done) {

                    race.team = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, race, done);

                });

                it('should not write to another team', function (done) {
                    race.team = team2.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, race, done);
                });

                it('should not write a different, valid bowNumber', function (done) {

                    race.bowNumber = 2;
                    assert.cannotSet(firebaseAdmin.app(appName), path, race, done);

                });

                it('should not write null to bowNumber', function (done) {

                    race.bowNumber = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, race, done);

                });

                it('should not write a different, valid eventName', function (done) {

                    race.eventName = faker.lorem.word();
                    assert.cannotSet(firebaseAdmin.app(appName), path, race, done);

                });

                it('should not write null to eventName', function (done) {

                    race.eventName = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, race, done);

                });

                it('should not be able to change raceTime', function (done) {

                    race.raceTime = faker.lorem.word();
                    assert.cannotSet(firebaseAdmin.app(appName), path, race, done);

                });

                it('should not write null to raceTime', function (done) {

                    race.raceTime = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, race, done);

                });

                it('should not write String to suggestedLaunchTime', function (done) {

                    race.suggestedLaunchTime = faker.lorem.word();
                    assert.cannotSet(firebaseAdmin.app(appName), path, race, done);

                });

                it('should not write Null to suggestedLaunchTime', function (done) {

                    race.suggestedLaunchTime = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, race, done);
                });
            });

            describe('as user with active auth (team1User1Auth2) updating individual values of an race (team1Race1)', function () {

                const appName = 'team1User1Auth2';

                const path = 'races/' + team1Race1.getPathKey();
                const race = team1Race1.getValues({
                    reference: false
                });
                const raceKeys = Object.keys(race);

                for (let x = 0; x < raceKeys.length; x++) {

                    if (raceKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + raceKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[raceKeys[x]] = race[raceKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < raceKeys.length; x++) {

                    if (raceKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + raceKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[raceKeys[x]] = race[raceKeys[x]];

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

            describe('as user with inactive auth (team1User1Auth2) set values of the same teams races (team1Race1)', function () {

                const appName = 'team1User1Auth2';
                let path;
                let race;

                beforeEach(function () {

                    path = 'races/' + team1Race1.getPathKey();
                    race = team1Race1.getValues({
                        reference: false
                    });
                    race.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, race, done);

                });

            });

            describe('as a user with an active auth (team1User1Auth1)  remove races on a different team', function () {
                const appName = 'team1User3Auth1';
                let path = 'races/' + team1Race3.getPathKey();

                it('admin is removing the teams race', function (done) {
                    assert.canSet(firebaseAdmin.app(appName), path, null, done);

                });

                const newApp = 'team1User1Auth1';
                it('a user without the correct permisions should not remove a teams race', function (done) {
                    assert.cannotSet(firebaseAdmin.app(newApp), path, null, done);
                });

                it('should not remove a different teams race', function (done) {
                    path = 'races/' + team2Race2.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, null, done);
                });

            });

            describe('as a user with active auth (team1User3Auth1) updating values of a deleted race', function () {
                let appName = 'team1User1Auth1';
                const path = 'races/';
                const race = team1Race3.getValues({
                    reference: true
                });

                const raceKeys = Object.keys(race);

                for (let x = 0; x < raceKeys.length; x++) {

                    if (raceKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + raceKeys[x] + '` with prior data and an updated timestamp', function (done) {
                        const value = {};
                        value[raceKeys[x]] = race[raceKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < raceKeys.length; x++) {

                    if (raceKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + raceKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[raceKeys[x]] = race[raceKeys[x]];

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

            describe('create new races', function () {
                const appName = 'team1User1Auth1';
                const path = 'races';

                it('should add a new race to the team', function (done) {
                    const race = team1.createRace();
                    const values = race.getValues({
                        reference: false
                    });
                    values.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    values.created = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    assert.canPush(firebaseAdmin.app(appName), path, values, done);
                });

                it('it should not add a new race to a different team', function (done) {
                    const race = team2.createRace();
                    const values = race.getValues({
                        reference: false
                    });

                    values.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    values.created = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    assert.cannotPush(firebaseAdmin.app(appName), path, values, done);
                });
            });
        });

        describe('Regatta tests', function () {

            describe('as user with active auth (team1User1Auth1) updating individual values of an regatta (team1Regatta1)', function () {

                const appName = 'team1User1Auth1';

                const path = 'regattas/' + team1Regatta1.getPathKey();
                const regatta = team1Regatta1.getValues({
                    reference: false
                });
                const regattaKeys = Object.keys(regatta);

                for (let x = 0; x < regattaKeys.length; x++) {

                    if (regattaKeys[x] === 'updated') {
                        continue;
                    }

                    it('should update `' + regattaKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[regattaKeys[x]] = regatta[regattaKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                        assert.canUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < regattaKeys.length; x++) {

                    if (regattaKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + regattaKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[regattaKeys[x]] = regatta[regattaKeys[x]];

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

                it('should not write null to team', function (done) {

                    regatta.team = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);

                });

                it('should not write to another team', function (done) {
                    regatta.team = team2.getPathKey();
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

            describe('as user with active auth (team1User1Auth1) setting regatta of another team (team2Regatta1)', function () {

                const appName = 'team1User1Auth1';
                let path;
                let regatta;

                beforeEach(function () {

                    path = 'regattas/' + team2Regatta1.getPathKey();
                    regatta = team2Regatta1.getValues({
                        reference: false
                    });
                    regatta.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);

                });

            });

            describe('as user with active auth (team1User1Auth1) updating individual values of an regatta (team1Regatta1)', function () {

                const appName = 'team1User1Auth1';

                const path = 'regattas/' + team2Regatta1.getPathKey();
                const regatta = team2Regatta1.getValues({
                    reference: false
                });
                const regattaKeys = Object.keys(regatta);

                for (let x = 0; x < regattaKeys.length; x++) {

                    if (regattaKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + regattaKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[regattaKeys[x]] = regatta[regattaKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < regattaKeys.length; x++) {

                    if (regattaKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + regattaKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[regattaKeys[x]] = regatta[regattaKeys[x]];

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

            describe('as user with active auth (team1User1Auth1) set values of the same teams regatta', function () {
                const appName = 'team1User1Auth1';
                let path;
                let regatta;

                beforeEach(function () {

                    path = 'regattas/' + team2Regatta1.getPathKey();
                    regatta = team2Regatta1.getValues({
                        reference: false
                    });
                    regatta.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write, valid prior data', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);

                });

                it('should not write empty regatta', function (done) {

                    regatta = {};
                    assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);

                });

                it('should not write null regatta', function (done) {

                    regatta = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);

                });

                it('should not write null to team', function (done) {

                    regatta.team = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);

                });

                it('should not write to another team', function (done) {
                    regatta.team = team2.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);
                });

                it('should not write a different, valid city', function (done) {

                    regatta.city = faker.address.city();
                    assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);

                });

                it('should not write null to city', function (done) {

                    regatta.city = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);

                });

                it('should not write a different, valid cost', function (done) {

                    regatta.cost = faker.random.number();
                    assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);

                });

                it('should not write null to cost', function (done) {

                    regatta.cost = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);

                });

                it('should not be able to change head', function (done) {

                    regatta.head = false;
                    assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);

                });

                it('should not write null to head', function (done) {

                    regatta.head = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);

                });

                it('should not write String to locationImage', function (done) {

                    regatta.locationImage = faker.image.imageUrl();
                    assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);

                });

                it('should not write Null to locationImage', function (done) {

                    regatta.locationImage = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);

                });

                it('should not write String to name', function (done) {

                    regatta.name = faker.lorem.words();
                    assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);

                });

                it('should not write Null to name', function (done) {

                    regatta.name = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);
                });

                it('should not write a different, valid state', function (done) {

                    regatta.state = faker.address.state();
                    assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);

                });

                it('should not write null to state', function (done) {

                    regatta.state = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);

                });

                it('should not write a different, valid streetAddress', function (done) {

                    regatta.streetAddress = faker.address.streetAddress();
                    assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);

                });

                it('should not write null to streetAddress', function (done) {

                    regatta.streetAddress = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);

                });
            });

            describe('as user with active auth (team1User1Auth2) updating individual values of an regatta (team1Regatta1)', function () {

                const appName = 'team1User1Auth2';

                const path = 'regattas/' + team1Regatta1.getPathKey();
                const regatta = team1Regatta1.getValues({
                    reference: false
                });
                const regattaKeys = Object.keys(regatta);

                for (let x = 0; x < regattaKeys.length; x++) {

                    if (regattaKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + regattaKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[regattaKeys[x]] = regatta[regattaKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < regattaKeys.length; x++) {

                    if (regattaKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + regattaKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[regattaKeys[x]] = regatta[regattaKeys[x]];

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

            describe('as user with inactive auth (team1User1Auth2) set values of the same teams regattas (team1Regatta1)', function () {

                const appName = 'team1User1Auth2';
                let path;
                let regatta;

                beforeEach(function () {

                    path = 'regattas/' + team1Regatta1.getPathKey();
                    regatta = team1Regatta1.getValues({
                        reference: false
                    });
                    regatta.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);

                });

            });

            describe('as a user with an active auth (team1User1Auth1)  remove regattas on a different team', function () {
                const appName = 'team1User3Auth1';
                let path = 'regattas/' + team1Regatta3.getPathKey();

                it('admin is removing the teams regatta', function (done) {
                    assert.canSet(firebaseAdmin.app(appName), path, null, done);

                });

                const newApp = 'team1User1Auth1';
                it('a user without the correct permisions should not remove a teams regatta', function (done) {
                    assert.cannotSet(firebaseAdmin.app(newApp), path, null, done);
                });

                it('should not remove a different teams regatta', function (done) {
                    path = 'regattas/' + team2Regatta2.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, null, done);
                });

            });

            describe('as a user with active auth (team1User3Auth1) updating values of a deleted regatta', function () {
                let appName = 'team1User1Auth1';
                const path = 'regattas/';
                const regatta = team1Regatta3.getValues({
                    reference: true
                });

                const regattaKeys = Object.keys(regatta);

                for (let x = 0; x < regattaKeys.length; x++) {

                    if (regattaKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + regattaKeys[x] + '` with prior data and an updated timestamp', function (done) {
                        const value = {};
                        value[regattaKeys[x]] = regatta[regattaKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < regattaKeys.length; x++) {

                    if (regattaKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + regattaKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[regattaKeys[x]] = regatta[regattaKeys[x]];

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

            describe('create new regattas', function () {
                const appName = 'team1User1Auth1';
                const path = 'regattas';

                it('should add a new regatta to the team', function (done) {
                    const regatta = team1.createRegatta();
                    const values = regatta.getValues({
                        reference: false
                    });
                    values.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    values.created = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    assert.canPush(firebaseAdmin.app(appName), path, values, done);
                });

                it('it should not add a new regatta to a different team', function (done) {
                    const regatta = team2.createRegatta();
                    const values = regatta.getValues({
                        reference: false
                    });

                    values.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    values.created = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    assert.cannotPush(firebaseAdmin.app(appName), path, values, done);
                });
            });
        });

        describe('Rigger tests', function () {

            describe('as user with active auth (team1User1Auth1) updating individual values of an rigger (team1Rigger1)', function () {

                const appName = 'team1User1Auth1';

                const path = 'riggers/' + team1Rigger1.getPathKey();
                const rigger = team1Rigger1.getValues({
                    reference: false
                });

                const riggerKeys = Object.keys(rigger);

                for (let x = 0; x < riggerKeys.length; x++) {

                    if (riggerKeys[x] === 'updated') {
                        continue;
                    }

                    it('should update `' + riggerKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[riggerKeys[x]] = rigger[riggerKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                        assert.canUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < riggerKeys.length; x++) {

                    if (riggerKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + riggerKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[riggerKeys[x]] = rigger[riggerKeys[x]];

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

            describe('as user with active auth (team1User1Auth1) setting rigger of another team (team2Rigger1)', function () {

                const appName = 'team1User1Auth1';
                let path;
                let rigger;

                beforeEach(function () {

                    path = 'riggers/' + team2Rigger1.getPathKey();
                    rigger = team2Rigger1.getValues({
                        reference: false
                    });
                    rigger.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, rigger, done);

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

                it('should not write null to team', function (done) {

                    rigger.team = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, rigger, done);

                });

                it('should not write to another team', function (done) {
                    rigger.team = team2.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, rigger, done);
                });

                it('should write a different, valid seatNumber', function (done) {

                    rigger.seatNumber = 3;
                    assert.cannotSet(firebaseAdmin.app(appName), path, rigger, done);

                });

                it('should not write null to seatNumber', function (done) {

                    rigger.seat = null;
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

            describe('as user with active auth (team1User1Auth1) updating individual values of another teams rigger (team1Rigger1)', function () {

                const appName = 'team1User1Auth1';

                const path = 'riggers/' + team2Rigger1.getPathKey();
                const rigger = team2Rigger1.getValues({
                    reference: false
                });

                const riggerKeys = Object.keys(rigger);

                for (let x = 0; x < riggerKeys.length; x++) {

                    if (riggerKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + riggerKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[riggerKeys[x]] = rigger[riggerKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < riggerKeys.length; x++) {

                    if (riggerKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + riggerKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[riggerKeys[x]] = rigger[riggerKeys[x]];

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

            describe('as user with active auth (team1User1Auth1) set values of the another teams rigger', function () {
                const appName = 'team1User1Auth1';
                let path;
                let rigger;

                beforeEach(function () {

                    path = 'riggers/' + team2Rigger1.getPathKey();
                    rigger = team2Rigger1.getValues({
                        reference: false
                    });
                    rigger.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write, valid prior data', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, rigger, done);

                });

                it('should not write empty rigger', function (done) {

                    rigger = {};
                    assert.cannotSet(firebaseAdmin.app(appName), path, rigger, done);

                });

                it('should not write null rigger', function (done) {

                    rigger = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, rigger, done);

                });

                it('should not write null to team', function (done) {

                    rigger.team = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, rigger, done);

                });

                it('should not write to another team', function (done) {
                    rigger.team = team2.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, rigger, done);
                });

                it('should not write a different, valid seatNumber', function (done) {

                    rigger.seatNumber = 3;
                    assert.cannotSet(firebaseAdmin.app(appName), path, rigger, done);

                });

                it('should not write null to seatNumber', function (done) {

                    rigger.seat = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, rigger, done);

                });

                it('should not write a different, valid side', function (done) {

                    rigger.side = faker.lorem.word();
                    assert.cannotSet(firebaseAdmin.app(appName), path, rigger, done);

                });

                it('should not write null to side', function (done) {

                    rigger.side = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, rigger, done);

                });

                it('should not be able to change style', function (done) {

                    rigger.style = faker.lorem.word();
                    assert.cannotSet(firebaseAdmin.app(appName), path, rigger, done);

                });

                it('should not write null to style', function (done) {

                    rigger.style = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, rigger, done);

                });

                it('should not write String to type', function (done) {

                    rigger.type = faker.lorem.word();
                    assert.cannotSet(firebaseAdmin.app(appName), path, rigger, done);

                });

                it('should not write Null to type', function (done) {

                    rigger.type = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, rigger, done);
                });
            });

            describe('as user with inactive auth (team1User1Auth2) updating individual values of a rigger (team1Rigger1)', function () {

                const appName = 'team1User1Auth2';

                const path = 'riggers/' + team1Rigger1.getPathKey();
                const rigger = team1Rigger1.getValues({
                    reference: false
                });

                const riggerKeys = Object.keys(rigger);

                for (let x = 0; x < riggerKeys.length; x++) {

                    if (riggerKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + riggerKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[riggerKeys[x]] = rigger[riggerKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < riggerKeys.length; x++) {

                    if (riggerKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + riggerKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[riggerKeys[x]] = rigger[riggerKeys[x]];

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

            describe('as user with inactive auth (team1User1Auth2) set values the same teams riggers (team1Rigger1)', function () {

                const appName = 'team1User1Auth2';
                let path;
                let regatta;

                beforeEach(function () {

                    path = 'regattas/' + team1Rigger1.getPathKey();
                    regatta = team1Rigger1.getValues({
                        reference: false
                    });
                    regatta.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);

                });

            });

            describe('as a user with an active auth (team1User1Auth1)  remove riggers on a different team', function () {
                const appName = 'team1User3Auth1';
                let path = 'riggers/' + team1Rigger3.getPathKey();

                it('admin is removing the teams rigger', function (done) {
                    assert.canSet(firebaseAdmin.app(appName), path, null, done);

                });

                const newApp = 'team1User1Auth1';
                it('a user without the correct permisions should not remove a teams rigger', function (done) {
                    assert.cannotSet(firebaseAdmin.app(newApp), path, null, done);
                });

                it('should not remove a different teams rigger', function (done) {
                    path = 'riggers/' + team2Rigger2.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, null, done);
                });

            });

            describe('as a user with active auth (team1User3Auth1) updating values of a deleted rigger', function () {
                let appName = 'team1User1Auth1';
                const path = 'riggers/';
                const rigger = team1Rigger3.getValues({
                    reference: true
                });

                const riggerKeys = Object.keys(rigger);

                for (let x = 0; x < riggerKeys.length; x++) {

                    if (riggerKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + riggerKeys[x] + '` with prior data and an updated timestamp', function (done) {
                        const value = {};
                        value[riggerKeys[x]] = rigger[riggerKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < riggerKeys.length; x++) {

                    if (riggerKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + riggerKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[riggerKeys[x]] = rigger[riggerKeys[x]];

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

            describe('create new riggers', function () {
                const appName = 'team1User1Auth1';
                const path = 'riggers';

                it('should add a new rigger to the team', function (done) {
                    const rigger = team1.createRigger();
                    const values = rigger.getValues({
                        reference: false
                    });
                    values.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    values.created = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    assert.canPush(firebaseAdmin.app(appName), path, values, done);
                });

                it('it should not add a new rigger to a different team', function (done) {
                    const rigger = team2.createRigger();
                    const values = rigger.getValues({
                        reference: false
                    });

                    values.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    values.created = firebaseAdmin.database.ServerValue.TIMESTAMP;
                    assert.cannotPush(firebaseAdmin.app(appName), path, values, done);
                });
            });

        });

        describe('User tests', function () {

            describe('as user with active auth (team1User1Auth1) updating individual values of same user (team1User1)', function () {

                const appName = 'team1User1Auth1';

                const path = 'users/' + team1User1.getPathKey();
                const user = team1User1.getValues({
                    reference: false
                });

                const userKeys = Object.keys(user);

                for (let x = 0; x < userKeys.length; x++) {

                    if (userKeys[x] === 'updated') {
                        continue;
                    }

                    it('should update `' + userKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[userKeys[x]] = user[userKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                        assert.canUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < userKeys.length; x++) {

                    if (userKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + userKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[userKeys[x]] = user[userKeys[x]];

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

            describe('as user with active auth (team1User1Auth1) set values of the same user', function () {
                const appName = 'team1User1Auth1';
                let path;
                let user;

                beforeEach(function () {

                    path = 'users/' + team1User1.getPathKey();
                    user = team1User1.getValues({
                        reference: false
                    });
                    user.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should write, valid prior data', function (done) {

                    assert.canSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write empty user', function (done) {

                    user = {};
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write null user', function (done) {

                    user = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write null to team', function (done) {

                    user.team = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write to another team', function (done) {
                    user.team = team2.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);
                });

                it('should write a different, valid credential', function (done) {

                    user.credentials = faker.lorem.words();
                    assert.canSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write null to credential', function (done) {

                    user.credentials = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should write a different, valid firstName', function (done) {

                    user.firstName = faker.name.firstName();
                    assert.canSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write null to firstName', function (done) {

                    user.firstName = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should be able to change lastName', function (done) {

                    user.lastName = faker.name.lastName();
                    assert.canSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write null to lastName', function (done) {

                    user.lastName = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should write String to perms', function (done) {

                    user.permisions = faker.lorem.word();
                    assert.canSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write Null to perms', function (done) {

                    user.permisions = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);
                });

                it('should write String to status', function (done) {

                    user.status = faker.lorem.word();
                    assert.canSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write Null to status', function (done) {

                    user.status = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);
                });

                it('should write String to userName', function (done) {

                    user.userName = faker.lorem.words();
                    assert.canSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write Null to userName', function (done) {

                    user.userName = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);
                });

                it('should write String to email', function (done) {

                    user.email = faker.internet.email();
                    assert.canSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write String to email', function (done) {

                    user.email = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });
            });

            describe('as user with active auth (team1User1Auth1) updating individual values of another teams user (team1User1)', function () {

                const appName = 'team1User1Auth1';

                const path = 'users/' + team2User1.getPathKey();
                const user = team2User1.getValues({
                    reference: false
                });

                const userKeys = Object.keys(user);

                for (let x = 0; x < userKeys.length; x++) {

                    if (userKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + userKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[userKeys[x]] = user[userKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < userKeys.length; x++) {

                    if (userKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + userKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[userKeys[x]] = user[userKeys[x]];

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

            describe('as user with active auth (team1User1Auth1) set values of the another teams user', function () {
                const appName = 'team1User1Auth1';
                let path;
                let user;

                beforeEach(function () {

                    path = 'users/' + team2User1.getPathKey();
                    user = team2User1.getValues({
                        reference: false
                    });
                    user.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write, valid prior data', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write empty user', function (done) {

                    user = {};
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write null user', function (done) {

                    user = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write null to team', function (done) {

                    user.team = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write to another team', function (done) {
                    user.team = team2.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);
                });

                it('should not write a different, valid credential', function (done) {

                    user.credantial = faker.lorem.words();
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write null to credential', function (done) {

                    user.credantial = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write a different, valid firstName', function (done) {

                    user.firstName = faker.name.firstName();
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write null to firstName', function (done) {

                    user.firstName = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not be able to change lastName', function (done) {

                    user.lastName = faker.name.lastName();
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write null to lastName', function (done) {

                    user.lastName = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write String to perms', function (done) {

                    user.permisions = faker.lorem.word();
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write Null to perms', function (done) {

                    user.permisions = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);
                });

                it('should not write String to status', function (done) {

                    user.status = faker.lorem.word();
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write Null to status', function (done) {

                    user.status = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);
                });

                it('should not write String to userName', function (done) {

                    user.userName = faker.lorem.words();
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write Null to userName', function (done) {

                    user.userName = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);
                });

                it('should not write String to email', function (done) {

                    user.email = faker.internet.email();
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write String to email', function (done) {

                    user.email = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });
            });

            describe('as user with active auth (team1User1Auth1) updating individual values of another user on the same team (team1User2)', function () {

                const appName = 'team1User1Auth1';

                const path = 'users/' + team1User2.getPathKey();
                const user = team1User2.getValues({
                    reference: false
                });

                const userKeys = Object.keys(user);

                for (let x = 0; x < userKeys.length; x++) {

                    if (userKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + userKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[userKeys[x]] = user[userKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < userKeys.length; x++) {

                    if (userKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + userKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[userKeys[x]] = user[userKeys[x]];

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

            describe('as user with active auth (team1User1Auth1) set values of another user on the same team', function () {
                const appName = 'team1User1Auth1';
                let path;
                let user;

                beforeEach(function () {

                    path = 'users/' + team1User2.getPathKey();
                    user = team1User2.getValues({
                        reference: false
                    });
                    user.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write, valid prior data', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write empty user', function (done) {

                    user = {};
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write null user', function (done) {

                    user = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write null to team', function (done) {

                    user.team = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write to another team', function (done) {
                    user.team = team2.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);
                });

                it('should not create new user for another team', function (done) {

                    const team2User2 = team2.createUser();
                    user = team2User2.getValues({
                        reference: false
                    });
                    assert.cannotPush(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write a different, valid credential', function (done) {

                    user.credantial = faker.lorem.words();
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write null to credential', function (done) {

                    user.credantial = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write a different, valid firstName', function (done) {

                    user.firstName = faker.name.firstName();
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write null to firstName', function (done) {

                    user.firstName = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not be able to change lastName', function (done) {

                    user.lastName = faker.name.lastName();
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write null to lastName', function (done) {

                    user.lastName = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write String to perms', function (done) {

                    user.permisions = faker.lorem.word();
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write Null to perms', function (done) {

                    user.permisions = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);
                });

                it('should not write String to status', function (done) {

                    user.status = faker.lorem.word();
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write Null to status', function (done) {

                    user.status = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);
                });

                it('should not write String to userName', function (done) {

                    user.userName = faker.lorem.words();
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write Null to userName', function (done) {

                    user.userName = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);
                });

                it('should not write String to email', function (done) {

                    user.email = faker.internet.email();
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });

                it('should not write String to email', function (done) {

                    user.email = faker.internet.email();
                    assert.cannotSet(firebaseAdmin.app(appName), path, user, done);

                });
            });

            describe('as user with inactive auth (team1User1Auth2) updating individual values of a user (team1User1)', function () {

                const appName = 'team1User1Auth2';

                const path = 'users/' + team1User1.getPathKey();
                const user = team1User1.getValues({
                    reference: false
                });

                const userKeys = Object.keys(user);

                for (let x = 0; x < userKeys.length; x++) {

                    if (userKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + userKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[userKeys[x]] = user[userKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < userKeys.length; x++) {

                    if (userKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + userKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[userKeys[x]] = user[userKeys[x]];

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

            describe('as user with inactive auth (team1User1Auth2) set values the same teams users (team1User1)', function () {

                const appName = 'team1User1Auth2';
                let path;
                let regatta;

                beforeEach(function () {

                    path = 'regattas/' + team1User1.getPathKey();
                    regatta = team1User1.getValues({
                        reference: false
                    });
                    regatta.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);

                });

            });

            describe('as user with inactive auth (team1User1Auth2) set values of inactive auth with same user (team1User1Auth3)', function () {

                const appName = 'team1User1Auth2';
                let path;
                let regatta;

                beforeEach(function () {

                    path = 'regattas/' + team1User1Auth3.getPathKey();
                    regatta = team1User1Auth3.getValues({
                        reference: false
                    });
                    regatta.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, regatta, done);

                });

            });

        });

        describe.only('Credential tests', function () {

            describe('as user with active auth (team1User1Auth1) updating individual values of same credential (team1Credential1)', function () {

                const appName = 'team1User1Auth1';

                const path = 'credentials/' + team1User1Credential1.getPathKey();
                const credential = team1User1Credential1.getValues({
                    reference: false
                });

                const credentialKeys = Object.keys(credential);

                for (let x = 0; x < credentialKeys.length; x++) {

                    if (credentialKeys[x] === 'updated') {
                        continue;
                    }

                    it('should update `' + credentialKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[credentialKeys[x]] = credential[credentialKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                        assert.canUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < credentialKeys.length; x++) {

                    if (credentialKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + credentialKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[credentialKeys[x]] = credential[credentialKeys[x]];

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

            describe('as user with active auth (team1User1Auth1) set values of the same credential', function () {
                const appName = 'team1User1Auth1';
                let path;
                let credential;

                beforeEach(function () {

                    path = 'credentials/' + team1User1Credential1.getPathKey();
                    credential = team1User1Credential1.getValues({
                        reference: false
                    });
                    credential.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should write, valid prior data', function (done) {

                    assert.canSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not write empty credential', function (done) {

                    credential = {};
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not write null credential', function (done) {

                    credential = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not write null to user', function (done) {

                    credential.user = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not write to another user', function (done) {
                    credential.user = team2.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);
                });

                it('should write a different, valid credential', function (done) {

                    credential.credential = faker.lorem.words();
                    assert.canSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not write null to credential', function (done) {

                    credential.credential = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not write a different hash', function (done) {

                    credential.hash = faker.name.firstName();
                    assert.canSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not write null to hash', function (done) {

                    credential.hash = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not be able to change salt', function (done) {

                    credential.salt = faker.name.lastName();
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not write null to salt', function (done) {

                    credential.salt = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });
            });

            describe('as user with active auth (team1User1Auth1) updating individual values of another teams credential (team1User1Credential1)', function () {

                const appName = 'team1User1Auth1';

                const path = 'credentials/' + team2User1Credential1.getPathKey();
                const credential = team2User1Credential1.getValues({
                    reference: false
                });

                const credentialKeys = Object.keys(credential);

                for (let x = 0; x < credentialKeys.length; x++) {

                    if (credentialKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + credentialKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[credentialKeys[x]] = credential[credentialKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < credentialKeys.length; x++) {

                    if (credentialKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + credentialKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[credentialKeys[x]] = credential[credentialKeys[x]];

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

            describe('as credential with active auth (team1User1Auth1) set values of the another teams credential', function () {
                const appName = 'team1User1Auth1';
                let path;
                let credential;

                beforeEach(function () {

                    path = 'credentials/' + team2User1Credential1.getPathKey();
                    credential = team2User1Credential1.getValues({
                        reference: false
                    });
                    credential.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write, valid prior data', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not write empty credential', function (done) {

                    credential = {};
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not write null credential', function (done) {

                    credential = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not write null to user', function (done) {

                    credential.user = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not write to another user', function (done) {
                    credential.user = team2.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);
                });

                it('should not write a different, valid credential', function (done) {

                    credential.credantial = faker.lorem.words();
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not write null to credential', function (done) {

                    credential.credantial = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not write a different, valid hash', function (done) {

                    credential.hash = faker.name.firstName();
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not write null to hash', function (done) {

                    credential.hash = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not be able to change salt', function (done) {

                    credential.salt = faker.name.lastName();
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not write null to salt', function (done) {

                    credential.salt = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });
            });

            describe('as user with active auth (team1User1Auth1) updating individual values of another credential on the same team (team1User2Credential1)', function () {

                const appName = 'team1User1Auth1';

                const path = 'credentials/' + team1User2Credential1.getPathKey();
                const credential = team1User2Credential1.getValues({
                    reference: false
                });

                const credentialKeys = Object.keys(credential);

                for (let x = 0; x < credentialKeys.length; x++) {

                    if (credentialKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + credentialKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[credentialKeys[x]] = credential[credentialKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < credentialKeys.length; x++) {

                    if (credentialKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + credentialKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[credentialKeys[x]] = credential[credentialKeys[x]];

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

            describe('as credential with active auth (team1User1Auth1) set values of another credential on the same team', function () {
                const appName = 'team1User1Auth1';
                let path;
                let credential;

                beforeEach(function () {

                    path = 'credentials/' + team1User2Credential1.getPathKey();
                    credential = team1User2Credential1.getValues({
                        reference: false
                    });
                    credential.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write, valid prior data', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not write empty credential', function (done) {

                    credential = {};
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not write null credential', function (done) {

                    credential = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not write null to user', function (done) {

                    credential.user = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not write to another user', function (done) {
                    credential.user = team2.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);
                });

                it('should not create new credential for another user', function (done) {

                    const team1User2Credential2 = team1User2.createUser1Credential();
                    credential = team1User2Credential2.getValues({
                        reference: false
                    });
                    assert.cannotPush(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not write a different, valid credential', function (done) {

                    credential.credantial = faker.lorem.words();
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not write null to credential', function (done) {

                    credential.credantial = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not write a different, valid hash', function (done) {

                    credential.hash = faker.name.firstName();
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not write null to hash', function (done) {

                    credential.hash = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not be able to change salt', function (done) {

                    credential.salt = faker.name.lastName();
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not write null to salt', function (done) {

                    credential.salt = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not write String to perms', function (done) {

                    credential.permisions = faker.lorem.word();
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });
            });

            describe('as credential with inactive auth (team1User1Auth2) updating individual values of a credential (team1User1Credential1)', function () {

                const appName = 'team1User1Auth2';

                const path = 'credentials/' + team1User1Credential1.getPathKey();
                const credential = team1User1Credential1.getValues({
                    reference: false
                });

                const credentialKeys = Object.keys(credential);

                for (let x = 0; x < credentialKeys.length; x++) {

                    if (credentialKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + credentialKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[credentialKeys[x]] = credential[credentialKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < credentialKeys.length; x++) {

                    if (credentialKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + credentialKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[credentialKeys[x]] = credential[credentialKeys[x]];

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

            describe('as credential with inactive auth (team1User1Auth2) set values the same teams credentials (team1User1Credential1)', function () {

                const appName = 'team1User1Auth2';
                let path;
                let credential;

                beforeEach(function () {

                    path = 'credentials/' + team1User1Credential1.getPathKey();
                    credential = team1User1Credential1.getValues({
                        reference: false
                    });
                    credential.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });

            });

            describe('as credential with admin permisions (team1User3Auth1) updating individual values of a credential (team1User1Credential1)', function () {

                const appName = 'team1User3Auth1';

                const path = 'credentials/' + team1User1Credential1.getPathKey();
                const credential = team1User1Credential1.getValues({
                    reference: false
                });

                const credentialKeys = Object.keys(credential);

                for (let x = 0; x < credentialKeys.length; x++) {

                    if (credentialKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + credentialKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[credentialKeys[x]] = credential[credentialKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < credentialKeys.length; x++) {

                    if (credentialKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + credentialKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[credentialKeys[x]] = credential[credentialKeys[x]];

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

            describe('as credential with admin permisions (team1User3Auth1) set values the same teams credentials (team1User1Credential1)', function () {

                const appName = 'team1User3Auth1';
                let path;
                let credential;

                beforeEach(function () {

                    path = 'credentials/' + team1User1Credential1.getPathKey();
                    credential = team1User1Credential1.getValues({
                        reference: false
                    });
                    credential.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should write, valid prior data', function (done) {

                    assert.canSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not write empty credential', function (done) {

                    credential = {};
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not write null credential', function (done) {

                    credential = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not write null to user', function (done) {

                    credential.user = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not write to another user', function (done) {
                    credential.user = team2.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);
                });

                it('should write a different, valid credential', function (done) {

                    credential.credential = faker.lorem.words();
                    assert.canSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not write null to credential', function (done) {

                    credential.credential = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not write a different hash', function (done) {

                    credential.hash = faker.name.firstName();
                    assert.canSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not write null to hash', function (done) {

                    credential.hash = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not be able to change salt', function (done) {

                    credential.salt = faker.name.lastName();
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });

                it('should not write null to salt', function (done) {

                    credential.salt = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, credential, done);

                });

            });

        });

        describe('Team tests', function () {

            describe('as credential with active auth (team1User1Auth1) updating individual values of a team (team1U)', function () {

                const appName = 'team1User1Auth1';

                const path = 'teams/' + team1.getPathKey();
                const team = team1.getValues({
                    reference: false
                });
                const teamKeys = Object.keys(team);

                for (let x = 0; x < teamKeys.length; x++) {

                    if (teamKeys[x] === 'updated') {
                        continue;
                    }

                    it('should update `' + teamKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[teamKeys[x]] = team[teamKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                        assert.canUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < teamKeys.length; x++) {

                    if (teamKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + teamKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[teamKeys[x]] = team[teamKeys[x]];

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

            describe('as user with active auth (team1User1Auth1) set values of the same team', function () {
                const appName = 'team1User1Auth1';
                let path;
                let team;

                beforeEach(function () {

                    path = 'teams/' + team1.getPathKey();
                    team = team1.getValues({
                        reference: false
                    });
                    team.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should write, valid prior data', function (done) {

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

                    team = null;
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

            describe('as user with active auth (team1User1Auth1) creating new user active auth', function () {

                const appName = 'team1User1Auth1';
                let path;
                let team;

                beforeEach(function () {

                    path = 'teams/';
                    const team3 = generator.createTeam();
                    team = team3.getValues({
                        reference: false
                    });
                    team.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not create new team', function (done) {

                    assert.cannotPush(firebaseAdmin.app(appName), path, team, done);

                });

            });

            describe('as user with active auth (team1User1Auth1) updating individual values of a team (team1)', function () {

                const appName = 'team1User1Auth1';

                const path = 'teams/' + team2.getPathKey();
                const team = team2.getValues({
                    reference: false
                });
                const teamKeys = Object.keys(team);

                for (let x = 0; x < teamKeys.length; x++) {

                    if (teamKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + teamKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[teamKeys[x]] = team[teamKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < teamKeys.length; x++) {

                    if (teamKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + teamKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[teamKeys[x]] = team[teamKeys[x]];

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

            describe('as user with active auth (team1USer1Auth1) set values of a different team', function (done) {
                const appName = 'team1User1Auth1';
                let path;
                let team;

                beforeEach(function () {

                    path = 'teams/' + team2.getPathKey();
                    team = team2.getValues({
                        reference: false
                    });
                    team.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write, valid prior data', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, team, done);

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

                    team = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, team, done);

                });

                it('should not write a different, valid city', function (done) {

                    team.city = faker.address.city();
                    assert.cannotSet(firebaseAdmin.app(appName), path, team, done);

                });

                it('should not write null to city', function (done) {

                    team.city = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, team, done);

                });

                it('should not write a different, valid color', function (done) {

                    team.color = faker.commerce.color();
                    assert.cannotSet(firebaseAdmin.app(appName), path, team, done);

                });

                it('should not write null to color', function (done) {

                    team.color = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, team, done);

                });

                it('should not be able to change logo', function (done) {

                    team.logo = faker.lorem.word();
                    assert.cannotSet(firebaseAdmin.app(appName), path, team, done);

                });

                it('should not write null to logo', function (done) {

                    team.logo = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, team, done);

                });

                it('should not write String to name', function (done) {

                    team.teamName = faker.lorem.words();
                    assert.cannotSet(firebaseAdmin.app(appName), path, team, done);

                });

                it('should not write Null to name', function (done) {

                    team.teamName = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, team, done);
                });

                it('should not write a different, valid state', function (done) {

                    team.state = faker.address.state();
                    assert.cannotSet(firebaseAdmin.app(appName), path, team, done);

                });

                it('should not write null to state', function (done) {

                    team.state = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, team, done);

                });

                it('should not write a different, valid streetAddress', function (done) {

                    team.streetAddress = faker.address.streetAddress();
                    assert.cannotSet(firebaseAdmin.app(appName), path, team, done);

                });

                it('should not write null to streetAddress', function (done) {

                    team.streetAddress = null;
                    assert.cannotSet(firebaseAdmin.app(appName), path, team, done);

                });
            });

            describe('as user with inactive auth (team1User1Auth2) set values of the same team (team1)', function () {

                const appName = 'team1User1Auth2';
                let path;
                let team;

                beforeEach(function () {

                    path = 'teams/' + team1.getPathKey();
                    team = team1.getValues({
                        reference: false
                    });
                    team.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, team, done);

                });

            });

            describe('as user with inactive auth (team1User1Auth2) updating individual values of the same team (team1)', function () {

                const appName = 'team1User1Auth2';

                const path = 'teams/' + team1.getPathKey();
                const team = team1.getValues({
                    reference: false
                });
                const teamKeys = Object.keys(team);

                for (let x = 0; x < teamKeys.length; x++) {

                    if (teamKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + teamKeys[x] + '` with prior data and an updated timestamp', function (done) {

                        const value = {};
                        value[teamKeys[x]] = team[teamKeys[x]];
                        value.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                        assert.cannotUpdate(firebaseAdmin.app(appName), path, value, done);

                    });

                }

                for (let x = 0; x < teamKeys.length; x++) {

                    if (teamKeys[x] === 'updated') {
                        continue;
                    }

                    it('should not update `' + teamKeys[x] + '` with prior data', function (done) {

                        const value = {};
                        value[teamKeys[x]] = team[teamKeys[x]];

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

            describe('as user with inactive auth (team1User1Auth2) set values of a different team (team2)', function () {

                const appName = 'team1User1Auth2';
                let path;
                let team;

                beforeEach(function () {

                    path = 'teams/' + team2.getPathKey();
                    team = team2.getValues({
                        reference: false
                    });
                    team.updated = firebaseAdmin.database.ServerValue.TIMESTAMP;

                });

                it('should not write', function (done) {

                    assert.cannotSet(firebaseAdmin.app(appName), path, team, done);

                });

            });
        });

        describe('Boat Fanouts', function () {

            let appName = 'team1User1Auth1';
            let path;

            describe('BoatAthletes', function () {
                beforeEach(function () {
                    path = 'boatAthletes/';
                });

                it('should not add athletes (team1Athlete1) on the same team as the user with basic permisions (team1User1) to the same team\'s boat (team1Boat1)', function (done) {
                    path += team1Boat1.getPathKey() + '/' + team1Athlete1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                    team1Boat1.addAthlete(team1Athlete1);
                });

                it('should add athletes (team1Athlete1) on the same team as the user with admin permisions (team1User1) to the same team\'s boat (team1Boat1)', function (done) {
                    appName = 'team1User3Auth1';
                    path += team1Boat1.getPathKey() + '/' + team1Athlete1.getPathKey();
                    assert.canSet(firebaseAdmin.app(appName), path, true, done);
                    team1Boat1.addAthlete(team1Athlete1);
                });

                it('should not add athletes (team1Athlete1) on the same team as the user (team1User1) to the a different teams boat (team2Boat1)', function (done) {
                    path += team2Boat1.getPathKey() + '/' + team1Athlete1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                    team2Boat1.addAthlete(team1Athlete1);
                });

                it('should not add a different athlete (team2Athlete1) on the a different team as the user (team1User1) to their teams boats (team2Boat1)', function (done) {
                    path += team2Boat1.getPathKey() + '/' + team2Athlete1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                    team2Boat1.addAthlete(team2Athlete1);
                });

                it('should not add a different athlete (team2Athlete1) on the a different team as the user (team1User1) to the users team\'s boats (team1Boat1)', function (done) {
                    path += team1Boat1.getPathKey() + '/' + team2Athlete1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                    team1Boat1.addAthlete(team2Athlete1);
                });

                it('a user with basic perms cannot remove own teams athlete from a boat', function (done) {
                    appName = 'team1User1Auth1';

                    path += team1Boat1.getPathKey() + '/' + team1Athlete1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, null, done);

                });

                it('a user with admin perms can remove own teams athlete from a boat', function (done) {
                    appName = 'team1User3Auth1';
                    path += team1Boat1.getPathKey() + '/' + team1Athlete1.getPathKey();
                    assert.canSet(firebaseAdmin.app(appName), path, null, done);

                });

                it('it cannot remove a different teams athlete from their own boat', function (done) {
                    appName = 'team1User1Auth1';
                    path += team2Boat1.getPathKey() + '/' + team2Athlete1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, null, done);

                });
            });

            describe('BoatOars', function () {
                beforeEach(function () {
                    path = 'boatOars/';
                });

                it('should not add oars (team1Oar1) on the same team as the user with basic permisions (team1User1) to the same team\'s boat (team1Boat1)', function (done) {
                    path += team1Boat1.getPathKey() + '/' + team1Oar1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                    team1Boat1.addOar(team1Oar1);
                });

                it('should add oars (team1Oar1) on the same team as the user with admin permisions (team1User1) to the same team\'s boat (team1Boat1)', function (done) {
                    appName = 'team1User3Auth1';
                    path += team1Boat1.getPathKey() + '/' + team1Oar1.getPathKey();
                    assert.canSet(firebaseAdmin.app(appName), path, true, done);
                    team1Boat1.addOar(team1Oar1);
                });

                it('should not add oars (team1Oar1) on the same team as the user (team1User1) to the a different teams boat (team2Boat1)', function (done) {
                    path += team2Boat1.getPathKey() + '/' + team1Oar1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                    team2Boat1.addOar(team1Oar1);
                });

                it('should not add a different oar (team2Oar1) on the a different team as the user (team1User1) to their teams boats (team2Boat1)', function (done) {
                    path += team2Boat1.getPathKey() + '/' + team2Oar1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                    team2Boat1.addOar(team2Oar1);
                });

                it('should not add a different oar (team2Oar1) on the a different team as the user (team1User1) to the users team\'s boats (team1Boat1)', function (done) {
                    path += team1Boat1.getPathKey() + '/' + team2Oar1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                    team1Boat1.addOar(team2Oar1);
                });

                it('a user with basic perms cannot remove own teams oar from a boat', function (done) {
                    appName = 'team1User1Auth1';
                    assert.cannotSet(firebaseAdmin.app(appName), path, null, done);

                });

                it('a user with admin perms can remove own teams oar from a boat', function (done) {
                    appName = 'team1User3Auth1';
                    path += team1Boat1.getPathKey() + '/' + team1Oar1.getPathKey();
                    assert.canSet(firebaseAdmin.app(appName), path, null, done);

                });


                before(function () {
                    team1Boat1.addOar(team1Oar1);
                    team2Boat1.addOar(team2Oar1);

                });

                it('it cannot remove a different teams oar from their own boat', function (done) {
                    appName = 'team1User1Auth1';
                    path += team2Boat1.getPathKey() + '/' + team2Oar1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, null, done);

                });
            });

            describe('BoatRiggers', function () {
                beforeEach(function () {
                    path = 'boatRiggers/';
                });

                it('should not add riggers (team1Rigger1) on the same team as the user with basic permisions (team1User1) to the same team\'s boat (team1Boat1)', function (done) {
                    path += team1Boat1.getPathKey() + '/' + team1Rigger1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                    team1Boat1.addRigger(team1Rigger1);
                });

                it('should add riggers (team1Rigger1) on the same team as the user with admin permisions (team1User1) to the same team\'s boat (team1Boat1)', function (done) {
                    appName = 'team1User3Auth1';
                    path += team1Boat1.getPathKey() + '/' + team1Rigger1.getPathKey();
                    assert.canSet(firebaseAdmin.app(appName), path, true, done);
                    team1Boat1.addRigger(team1Rigger1);
                });

                it('should not add riggers (team1Rigger1) on the same team as the user (team1User1) to the a different teams boat (team2Boat1)', function (done) {
                    path += team2Boat1.getPathKey() + '/' + team1Rigger1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                    team2Boat1.addRigger(team1Rigger1);
                });

                it('should not add a different rigger (team2Rigger1) on the a different team as the user (team1User1) to their teams boats (team2Boat1)', function (done) {
                    path += team2Boat1.getPathKey() + '/' + team2Rigger1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                    team2Boat1.addRigger(team2Rigger1);
                });

                it('should not add a different rigger (team2Rigger1) on the a different team as the user (team1User1) to the users team\'s boats (team1Boat1)', function (done) {
                    path += team1Boat1.getPathKey() + '/' + team2Rigger1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                    team1Boat1.addRigger(team2Rigger1);
                });

                it('a user with basic perms cannot remove own teams rigger from a boat', function (done) {
                    appName = 'team1User1Auth1';
                    path += team1Boat1.getPathKey() + '/' + team1Rigger1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, null, done);

                });

                it('a user with admin perms can remove own teams rigger from a boat', function (done) {
                    appName = 'team1User3Auth1';
                    path += team1Boat1.getPathKey() + '/' + team1Rigger1.getPathKey();
                    assert.canSet(firebaseAdmin.app(appName), path, null, done);

                });


                before(function () {
                    team1Boat1.addRigger(team1Rigger1);
                    team2Boat1.addRigger(team2Rigger1);

                });

                it('it cannot remove a different teams rigger from their own boat', function (done) {
                    appName = 'team1User1Auth1';
                    path += team2Boat1.getPathKey() + '/' + team2Rigger1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, null, done);

                });
            });

        });

        describe('Athlete Fanouts', function () {

            let appName = 'team1User1Auth1';
            let path;

            describe('AthleteFinances', function () {
                beforeEach(function () {
                    path = 'athleteFinances/';
                });

                it('should not add finances (team1Finance1) on the same team as the user with basic permisions (team1User1) to the same team\'s athlete (team1Athlete1)', function (done) {
                    path += team1Athlete1.getPathKey() + '/' + team1Finance1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                    team1Athlete1.addFinance(team1Finance1);
                });

                it('should add finances (team1Finance1) on the same team as the user with admin permisions (team1User1) to the same team\'s athlete (team1Athlete1)', function (done) {
                    appName = 'team1User3Auth1';
                    path += team1Athlete1.getPathKey() + '/' + team1Finance1.getPathKey();
                    assert.canSet(firebaseAdmin.app(appName), path, true, done);
                    team1Athlete1.addFinance(team1Finance1);
                });

                it('should not add finances (team1Finance1) on the same team as the user (team1User1) to the a different teams athlete (team2Athlete1)', function (done) {
                    path += team2Athlete1.getPathKey() + '/' + team1Finance1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                    team2Athlete1.addFinance(team1Finance1);
                });

                it('should not add a different finance (team2Finance1) on the a different team as the user (team1User1) to their teams athletes (team2Athlete1)', function (done) {
                    path += team2Athlete1.getPathKey() + '/' + team2Finance1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                    team2Athlete1.addFinance(team2Finance1);
                });

                it('should not add a different finance (team2Finance1) on the a different team as the user (team1User1) to the users team\'s athletes (team1Athlete1)', function (done) {
                    path += team1Athlete1.getPathKey() + '/' + team2Finance1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                    team1Athlete1.addFinance(team2Finance1);
                });

                it('a user with basic perms cannot remove own teams finance from a athlete', function (done) {
                    appName = 'team1User1Auth1';
                    path += team1Athlete1.getPathKey() + '/' + team1Finance1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, null, done);

                });

                it('a user with admin perms can remove own teams finance from a athlete', function (done) {
                    appName = 'team1User3Auth1';
                    path += team1Athlete1.getPathKey() + '/' + team1Finance1.getPathKey();
                    assert.canSet(firebaseAdmin.app(appName), path, null, done);

                });


                before(function () {
                    team1Athlete1.addFinance(team1Finance1);
                    team2Athlete1.addFinance(team2Finance1);

                });

                it('it cannot remove a different teams finance from their own athlete', function (done) {
                    appName = 'team1User1Auth1';
                    path += team2Athlete1.getPathKey() + '/' + team2Finance1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, null, done);

                });
            });

            describe('AthleteErgs', function () {
                beforeEach(function () {
                    path = 'athleteErgs/';
                });

                it('should not add ergs (team1Erg1) on the same team as the user with basic permisions (team1User1) to the same team\'s athlete (team1Athlete1)', function (done) {
                    path += team1Athlete1.getPathKey() + '/' + team1Erg1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                    team1Athlete1.addErg(team1Erg1);
                });

                it('should add ergs (team1Erg1) on the same team as the user with admin permisions (team1User1) to the same team\'s athlete (team1Athlete1)', function (done) {
                    appName = 'team1User3Auth1';
                    path += team1Athlete1.getPathKey() + '/' + team1Erg1.getPathKey();
                    assert.canSet(firebaseAdmin.app(appName), path, true, done);
                    team1Athlete1.addErg(team1Erg1);
                });

                it('should not add ergs (team1Erg1) on the same team as the user (team1User1) to the a different teams athlete (team2Athlete1)', function (done) {
                    path += team2Athlete1.getPathKey() + '/' + team1Erg1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                    team2Athlete1.addErg(team1Erg1);
                });

                it('should not add a different erg (team2Erg1) on the a different team as the user (team1User1) to their teams athletes (team2Athlete1)', function (done) {
                    path += team2Athlete1.getPathKey() + '/' + team2Erg1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                    team2Athlete1.addErg(team2Erg1);
                });

                it('should not add a different erg (team2Erg1) on the a different team as the user (team1User1) to the users team\'s athletes (team1Athlete1)', function (done) {
                    path += team1Athlete1.getPathKey() + '/' + team2Erg1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                    team1Athlete1.addErg(team2Erg1);
                });

                it('a user with basic perms cannot remove own teams erg from a athlete', function (done) {
                    appName = 'team1User1Auth1';
                    path += team1Athlete1.getPathKey() + '/' + team1Erg1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, null, done);

                });

                it('a user with admin perms can remove own teams erg from a athlete', function (done) {
                    appName = 'team1User3Auth1';
                    path += team1Athlete1.getPathKey() + '/' + team1Erg1.getPathKey();
                    assert.canSet(firebaseAdmin.app(appName), path, null, done);

                });


                before(function () {
                    team1Athlete1.addErg(team1Erg1);
                    team2Athlete1.addErg(team2Erg1);

                });

                it('it cannot remove a different teams erg from their own athlete', function (done) {
                    appName = 'team1User1Auth1';
                    path += team2Athlete1.getPathKey() + '/' + team2Erg1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, null, done);

                });
            });

        });

        describe('Regatta Fanouts', function () {

            let appName = 'team1User1Auth1';
            let path;

            describe('RegattaPictures', function () {
                beforeEach(function () {
                    path = 'regattaPictures/';
                });

                it('should not add pictures (team1Picture1) on the same team as the user with basic permisions (team1User1) to the same team\'s regatta (team1Regatta1)', function (done) {
                    path += team1Regatta1.getPathKey() + '/' + team1Picture1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                    team1Regatta1.addPicture(team1Picture1);
                });

                it('should add pictures (team1Picture1) on the same team as the user with admin permisions (team1User1) to the same team\'s regatta (team1Regatta1)', function (done) {
                    appName = 'team1User3Auth1';
                    path += team1Regatta1.getPathKey() + '/' + team1Picture1.getPathKey();
                    assert.canSet(firebaseAdmin.app(appName), path, true, done);
                    team1Regatta1.addPicture(team1Picture1);
                });

                it('should not add pictures (team1Picture1) on the same team as the user (team1User1) to the a different teams regatta (team2Regatta1)', function (done) {
                    path += team2Regatta1.getPathKey() + '/' + team1Picture1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                    team2Regatta1.addPicture(team1Picture1);
                });

                it('should not add a different picture (team2Picture1) on the a different team as the user (team1User1) to their teams regattas (team2Regatta1)', function (done) {
                    path += team2Regatta1.getPathKey() + '/' + team2Picture1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                    team2Regatta1.addPicture(team2Picture1);
                });

                it('should not add a different picture (team2Picture1) on the a different team as the user (team1User1) to the users team\'s regattas (team1Regatta1)', function (done) {
                    path += team1Regatta1.getPathKey() + '/' + team2Picture1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                    team1Regatta1.addPicture(team2Picture1);
                });

                it('a user with basic perms cannot remove own teams picture from a regatta', function (done) {
                    appName = 'team1User1Auth1';
                    path += team1Regatta1.getPathKey() + '/' + team1Picture1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, null, done);

                });

                it('a user with admin perms can remove own teams picture from a regatta', function (done) {
                    appName = 'team1User3Auth1';
                    path += team1Regatta1.getPathKey() + '/' + team1Picture1.getPathKey();
                    assert.canSet(firebaseAdmin.app(appName), path, null, done);

                });


                before(function () {
                    team1Regatta1.addPicture(team1Picture1);
                    team2Regatta1.addPicture(team2Picture1);

                });

                it('it cannot remove a different teams picture from their own regatta', function (done) {
                    appName = 'team1User1Auth1';
                    path += team2Regatta1.getPathKey() + '/' + team2Picture1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, null, done);

                });
            });

            describe('RegattaRaces', function () {
                beforeEach(function () {
                    path = 'regattaRaces/';
                });

                it('should not add races (team1Race1) on the same team as the user with basic permisions (team1User1) to the same team\'s regatta (team1Regatta1)', function (done) {
                    path += team1Regatta1.getPathKey() + '/' + team1Race1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                    team1Regatta1.addRaces(team1Race1);
                });

                it('should add races (team1Race1) on the same team as the user with admin permisions (team1User1) to the same team\'s regatta (team1Regatta1)', function (done) {
                    appName = 'team1User3Auth1';
                    path += team1Regatta1.getPathKey() + '/' + team1Race1.getPathKey();
                    assert.canSet(firebaseAdmin.app(appName), path, true, done);
                    team1Regatta1.addRaces(team1Race1);
                });

                it('should not add races (team1Race1) on the same team as the user (team1User1) to the a different teams regatta (team2Regatta1)', function (done) {
                    path += team2Regatta1.getPathKey() + '/' + team1Race1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                    team2Regatta1.addRaces(team1Race1);
                });

                it('should not add a different race (team2Race1) on the a different team as the user (team1User1) to their teams regattas (team2Regatta1)', function (done) {
                    path += team2Regatta1.getPathKey() + '/' + team2Race1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                    team2Regatta1.addRaces(team2Race1);
                });

                it('should not add a different race (team2Race1) on the a different team as the user (team1User1) to the users team\'s regattas (team1Regatta1)', function (done) {
                    path += team1Regatta1.getPathKey() + '/' + team2Race1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                    team1Regatta1.addRaces(team2Race1);
                });

                it('a user with basic perms cannot remove own teams race from a regatta', function (done) {
                    appName = 'team1User1Auth1';
                    path += team1Regatta1.getPathKey() + '/' + team1Race1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, null, done);

                });

                it('a user with admin perms can remove own teams race from a regatta', function (done) {
                    appName = 'team1User3Auth1';
                    path += team1Regatta1.getPathKey() + '/' + team1Race1.getPathKey();
                    assert.canSet(firebaseAdmin.app(appName), path, null, done);

                });


                before(function () {
                    team1Regatta1.addRaces(team1Race1);
                    team2Regatta1.addRaces(team2Race1);

                });

                it('it cannot remove a different teams race from their own regatta', function (done) {
                    appName = 'team1User1Auth1';
                    path += team2Regatta1.getPathKey() + '/' + team2Race1.getPathKey();
                    assert.cannotSet(firebaseAdmin.app(appName), path, null, done);

                });
            });

        });

        describe('Team Fanouts', function () {

            let path;

            const appName = 'team1User3Auth1';

            describe('teamAthletes', function () {
                it('should dispatch account fan out when valid for athletes', function (done) {
                    path = 'teamAthletes/' + team1.getPathKey() + '/' + team1Athlete1.getPathKey();

                    assert.canSet(firebaseAdmin.app(appName), path, true, done);
                });

                it('should not dispatch account an invalid fan out when valid for boats', function (done) {
                    path = 'teamBoats/' + team1.getPathKey() + '/' + team2Boat1.getPathKey();

                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                });

                it('should not dispatch account an invalid fan out for a different team\'s boats', function (done) {
                    path = 'teamBoats/' + team2.getPathKey() + '/' + team2Boat1.getPathKey();

                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);

                });

                it('should not dispatch a valid fanout for a different team\'s boats', function (done) {
                    path = 'teamBoats' + team2.getPathKey() + '/' + team2Boat1.getPathKey();

                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                });
            });

            describe('teamBoats', function () {
                it('should dispatch account fan out when valid for boats', function (done) {
                    path = 'teamBoats/' + team1.getPathKey() + '/' + team1Boat1.getPathKey();

                    assert.canSet(firebaseAdmin.app(appName), path, true, done);
                });

                it('should not dispatch account an invalid fan out when valid for boats', function (done) {
                    path = 'teamBoats/' + team1.getPathKey() + '/' + team2Boat1.getPathKey();

                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                });

                it('should not dispatch account an invalid fan out for a different team', function (done) {
                    path = 'teamBoats/' + team2.getPathKey() + '/' + team2Boat1.getPathKey();

                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);

                });

                it('should not dispatch a valid fanout for a different team', function (done) {
                    path = 'teamBoats' + team2.getPathKey() + '/' + team2Boat1.getPathKey();

                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                });
            });

            describe('teamErgs', function () {
                it('should dispatch account fan out when valid for ergs', function (done) {
                    path = 'teamErgs/' + team1.getPathKey() + '/' + team1Erg1.getPathKey();

                    assert.canSet(firebaseAdmin.app(appName), path, true, done);
                });

                it('should not dispatch account an invalid fan out when valid for ergs', function (done) {
                    path = 'teamErgs/' + team1.getPathKey() + '/' + team2Erg1.getPathKey();

                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                });

                it('should not dispatch account an invalid fan out for a different team ergs', function (done) {
                    path = 'teamErgs/' + team2.getPathKey() + '/' + team2Erg1.getPathKey();

                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);

                });

                it('should not dispatch a valid fanout for a different team ergs', function (done) {
                    path = 'teamErgs' + team2.getPathKey() + '/' + team2Erg1.getPathKey();

                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                });
            });

            describe('teamFinacnes', function () {
                it('should dispatch account fan out when valid for finances', function (done) {
                    path = 'teamFinances/' + team1.getPathKey() + '/' + team1Finance1.getPathKey();

                    assert.canSet(firebaseAdmin.app(appName), path, true, done);
                });

                it('should not dispatch account an invalid fan out when valid for finances', function (done) {
                    path = 'teamFinances/' + team1.getPathKey() + '/' + team2Finance1.getPathKey();

                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                });

                it('should not dispatch account an invalid fan out for a different team finances', function (done) {
                    path = 'teamFinances/' + team2.getPathKey() + '/' + team2Finance1.getPathKey();

                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);

                });

                it('should not dispatch a valid fanout for a different team finances', function (done) {
                    path = 'teamFinances' + team2.getPathKey() + '/' + team2Finance1.getPathKey();

                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                });
            });

            describe('teamOars', function () {
                it('should dispatch account fan out when valid for oars', function (done) {
                    path = 'teamOars/' + team1.getPathKey() + '/' + team1Oar1.getPathKey();

                    assert.canSet(firebaseAdmin.app(appName), path, true, done);
                });

                it('should not dispatch account an invalid fan out when valid for oars', function (done) {
                    path = 'teamOars/' + team1.getPathKey() + '/' + team2Oar1.getPathKey();

                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                });

                it('should not dispatch account an invalid fan out for a different team oars', function (done) {
                    path = 'teamOars/' + team2.getPathKey() + '/' + team2Oar1.getPathKey();

                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);

                });

                it('should not dispatch a valid fanout for a different team oars', function (done) {
                    path = 'teamBoats' + team2.getPathKey() + '/' + team2Boat1.getPathKey();

                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                });
            });

            describe('teamPictures', function () {
                it('should dispatch account fan out when valid for pictures', function (done) {
                    path = 'teamPictures/' + team1.getPathKey() + '/' + team1Picture1.getPathKey();

                    assert.canSet(firebaseAdmin.app(appName), path, true, done);
                });

                it('should not dispatch account an invalid fan out when valid for pictures', function (done) {
                    path = 'teamPictures/' + team1.getPathKey() + '/' + team2Picture1.getPathKey();

                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                });

                it('should not dispatch account an invalid fan out for a different team pictures', function (done) {
                    path = 'teamPictures/' + team2.getPathKey() + '/' + team2Picture1.getPathKey();

                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);

                });

                it('should not dispatch a valid fanout for a different team pictures', function (done) {
                    path = 'teamPictures' + team2.getPathKey() + '/' + team2Picture1.getPathKey();

                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                });

            });

            describe('teamRaces', function () {
                it('should dispatch account fan out when valid for races', function (done) {
                    path = 'teamRaces/' + team1.getPathKey() + '/' + team1Race1.getPathKey();

                    assert.canSet(firebaseAdmin.app(appName), path, true, done);
                });

                it('should not dispatch account an invalid fan out when valid for races', function (done) {
                    path = 'teamRaces/' + team1.getPathKey() + '/' + team2Race1.getPathKey();

                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                });

                it('should not dispatch account an invalid fan out for a different team races', function (done) {
                    path = 'teamRaces/' + team2.getPathKey() + '/' + team2Race1.getPathKey();

                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);

                });

                it('should not dispatch a valid fanout for a different team races', function (done) {
                    path = 'teamRaces' + team2.getPathKey() + '/' + team2Race1.getPathKey();

                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                });

            });


            describe('teamRegattas', function () {
                it('should dispatch account fan out when valid for regattas', function (done) {
                    path = 'teamRegattas/' + team1.getPathKey() + '/' + team1Regatta1.getPathKey();

                    assert.canSet(firebaseAdmin.app(appName), path, true, done);
                });

                it('should not dispatch account an invalid fan out when valid for regattas', function (done) {
                    path = 'teamRegattas/' + team1.getPathKey() + '/' + team2Regatta1.getPathKey();

                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                });

                it('should not dispatch account an invalid fan out for a different team regattas', function (done) {
                    path = 'teamRegattas/' + team2.getPathKey() + '/' + team2Regatta1.getPathKey();

                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);

                });

                it('should not dispatch a valid fanout for a different team regattas', function (done) {
                    path = 'teamRegattas' + team2.getPathKey() + '/' + team2Regatta1.getPathKey();

                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                });

            });

            describe('teamRiggers', function () {
                it('should dispatch account fan out when valid for riggers', function (done) {
                    path = 'teamRiggers/' + team1.getPathKey() + '/' + team1Rigger1.getPathKey();

                    assert.canSet(firebaseAdmin.app(appName), path, true, done);
                });

                it('should not dispatch account an invalid fan out when valid for  riggers', function (done) {
                    path = 'teamRiggers/' + team1.getPathKey() + '/' + team2Rigger1.getPathKey();

                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                });

                it('should not dispatch account an invalid fan out for a different team riggers', function (done) {
                    path = 'teamRiggers/' + team2.getPathKey() + '/' + team2Rigger1.getPathKey();

                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);

                });

                it('should not dispatch a valid fanout for a different team riggers', function (done) {
                    path = 'teamRiggers' + team2.getPathKey() + '/' + team2Rigger1.getPathKey();

                    assert.cannotSet(firebaseAdmin.app(appName), path, true, done);
                });

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
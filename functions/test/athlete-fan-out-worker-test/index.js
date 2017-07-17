/* globals describe: function, it: function, before: function, after: function */

require('dotenv').config({
    path: __dirname + '/../../.env'
});

const firebaseAdmin = require('firebase-admin');
const firebaseFunctions = require('firebase-functions');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const Generator = require('../../../src/generator/index.js');

console.warn = () => {};


describe('athlete-fanout', () => {
    // this.timeout(30000);

    const generator = new Generator({
        updateDataOnSetFanOut: false,
        updateDataOnCreateWorkerTask: false
    });

    const team1 = generator.createTeam();
    const athlete1 = team1.createAthlete();

    const boat1 = team1.createBoat();
    boat1.addAthlete(athlete1);

    const erg1 = team1.createErg();
    athlete1.addErg(erg1);

    let athleteFanout;

    before((done) => {

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
            mocha: true
        });

        const stubs = {
            'firebase-functions': {
                'config': configStub
            }
        };

        athleteFanout = proxyquire(__dirname + '/../../athlete-fan-out-worker', stubs);

        const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
        firebaseAdmin.initializeApp({
            credential: firebaseAdmin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: privateKey
            }),
            databaseURL: databaseURL
        });

        firebaseAdmin.database().ref().set(generator.getData()).then(() => {
            console.log('Write 2 complete');
            done();
        }).catch((err) => {
            console.log(err);
            done();
        });

    });

    it('should dispatch account fan out when valid', () => {

        const path = athlete1.getPath();
        let before = null;
        let after = athlete1.getValues();

        const params = {};
        params[athlete1.getSingular()] = athlete1.getPathKey();

        const triggerEvent = {
            data: new firebaseFunctions.database.DeltaSnapshot(firebaseAdmin, firebaseAdmin, before, after, path),
            params: params
        };

        return athleteFanout(triggerEvent)
            .then(() => {

                return firebaseAdmin.database().ref().once('value')
                    .then((taskSnapshot) => {

                        const task = taskSnapshot.val();

                    });

            });

    });

    after((done) => {
        firebaseFunctions.config.restore();
        firebaseAdmin.app().delete()
            .then(done);
    });

});
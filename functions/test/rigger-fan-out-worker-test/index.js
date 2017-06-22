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

const generator = new Generator({
    updateDataOnSetFanOut: false,
    updateDataOnCreateWorkerTask: false
});


describe('rigger-fanout', () => {

    const team1 = generator.createTeam();
    const boat1 = team1.createBoat();
    const rigger1 = boat1.createRigger();

    let riggerFanout;

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

        riggerFanout = proxyquire(__dirname + '/../../rigger-fan-out-worker', stubs);

        const privateKey = process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n');
        firebaseAdmin.initializeApp({
            credential: firebaseAdmin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: privateKey
            }),
            databaseURL: databaseURL,
        });

        firebaseAdmin.database().ref().set(generator.getData())
            .then(() => {
                done();
            });

    });

    it('should dispatch account fan out when valid', () => {

        const path = rigger1.getPath();
        let before = null;
        let after = rigger1.getValues();
        const params = {};
        params[rigger1.getSingular()] = rigger1.getPathKey();

        const triggerEvent = {
            data: new firebaseFunctions.database.DeltaSnapshot(firebaseAdmin, firebaseAdmin, before, after, path),
            params: params
        };

        return riggerFanout(triggerEvent)
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
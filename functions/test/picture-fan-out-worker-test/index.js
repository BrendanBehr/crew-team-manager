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


describe('picture-fanout', () => {
    const team1 = generator.createTeam();
    const picture1 = team1.createPicture();

    const regatta1 = team1.createRegatta();
    regatta1.addPicture(picture1);

    let pictureFanout;

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

        pictureFanout = proxyquire(__dirname + '/../../picture-fan-out-worker', stubs);

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

        const path = picture1.getPath();
        let before = null;
        let after = picture1.getValues();
        const params = {};
        params[picture1.getSingular()] = picture1.getPathKey();

        const triggerEvent = {
            data: new firebaseFunctions.database.DeltaSnapshot(firebaseAdmin, firebaseAdmin, before, after, path),
            params: params
        };

        return pictureFanout(triggerEvent)
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
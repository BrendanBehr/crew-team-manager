'use strict';

const Promise = require('bluebird');
const firebaseAdmin = require('firebase-admin');
const firebaseFunctions = require('firebase-functions');

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


module.exports = firebaseFunctions.database.ref('/races/{race}')
    .onWrite((triggerEvent) => {
        return new Promise((resolve, reject) => {

            const racePrevious = triggerEvent.data.previous.val();
            const raceCurrent = triggerEvent.data.val();

            const update = {};

            if (racePrevious) {
                update['teamRaces/' + racePrevious.team + '/' + triggerEvent.params.race] = null;
            }

            if (raceCurrent) {

                const value = {
                    eventName: raceCurrent.eventName
                };

                update['teamRaces/' + raceCurrent.team + '/' + triggerEvent.params.race] = value;

            }

            return getDatabase().ref().update(update)
                .then(resolve)
                .catch(reject);

        });

    });
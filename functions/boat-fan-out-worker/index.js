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


module.exports = firebaseFunctions.database.ref('/boats/{boat}')
    .onWrite((triggerEvent) => {
        return new Promise((resolve, reject) => {

            const boatPrevious = triggerEvent.data.previous.val();
            const boatCurrent = triggerEvent.data.val();

            const update = {};

            if (boatPrevious) {
                update['teamBoats/' + boatPrevious.team + '/' + triggerEvent.params.boat] = null;
            }

            if (boatCurrent) {

                const value = {
                    Name: boatCurrent.name
                };

                update['teamBoats/' + boatCurrent.team + '/' + triggerEvent.params.boat] = value;

            }

            return getDatabase().ref().update(update)
                .then(resolve)
                .catch(reject);

        });

    });
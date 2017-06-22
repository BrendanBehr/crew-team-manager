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


module.exports = firebaseFunctions.database.ref('/ergs/{erg}')
    .onWrite((triggerEvent) => {
        return new Promise((resolve, reject) => {

            const ergPrevious = triggerEvent.data.previous.val();
            const ergCurrent = triggerEvent.data.val();

            const update = {};

            if (ergPrevious) {
                update['teamErgs/' + ergPrevious.team + '/' + triggerEvent.params.erg] = null;
            }

            if (ergCurrent) {

                const value = {
                    Number: ergCurrent.number
                };

                update['teamErgs/' + ergCurrent.team + '/' + triggerEvent.params.erg] = value;

            }

            return getDatabase().ref().update(update)
                .then(resolve)
                .catch(reject);

        });

    });
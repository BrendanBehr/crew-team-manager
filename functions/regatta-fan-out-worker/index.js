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


module.exports = firebaseFunctions.database.ref('/regattas/{regatta}')
    .onWrite((triggerEvent) => {
        return new Promise((resolve, reject) => {

            const regattaPrevious = triggerEvent.data.previous.val();
            const regattaCurrent = triggerEvent.data.val();

            const update = {};

            if (regattaPrevious) {
                update['teamRegattas/' + regattaPrevious.team + '/' + triggerEvent.params.regatta] = null;
            }

            if (regattaCurrent) {

                const value = {
                    Name: regattaCurrent.name
                };

                update['teamRegattas/' + regattaCurrent.team + '/' + triggerEvent.params.regatta] = value;

            }

            return getDatabase().ref().update(update)
                .then(resolve)
                .catch(reject);

        });

    });
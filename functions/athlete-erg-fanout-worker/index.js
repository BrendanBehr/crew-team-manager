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


module.exports = firebaseFunctions.database.ref('/athletes/{athlete}')
    .onWrite((triggerEvent) => {
        return new Promise((resolve, reject) => {

            const athletePrevious = triggerEvent.data.previous.val();
            const athleteCurrent = triggerEvent.data.val();

            console.log(athleteCurrent);

            const update = {};

            if (athletePrevious) {

                update['teamAthletes/' + athletePrevious.team + '/' + triggerEvent.params.athlete] = null;

            }

            if (athleteCurrent) {

                const value = {
                    firstName: athleteCurrent.firstName,
                    lastName: athleteCurrent.lastName,
                    city: athleteCurrent.city,
                    state: athleteCurrent.state,
                    streetAddress: athleteCurrent.streetAddress,
                };

                update['teamAthletes/' + athleteCurrent.team + '/' + triggerEvent.params.athlete] = value;
            }

            return getDatabase().ref().update(update)
                .then(resolve)
                .catch(reject);

        });

    });
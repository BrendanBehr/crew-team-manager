'use strict';

const Promise = require('bluebird');
const google = require('googleapis');

require('dotenv').config({
    path: process.cwd() + '/../../.env'
});

const getAccessToken = () => {
    return new Promise((resolve, reject) => {

        const serviceAccount = {
            client_email: process.env.FIREBASE_CLIENT_EMAIL,
            private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            project_id: process.env.FIREBASE_PROJECT_ID,
            database_url: process.env.FIREBASE_DATABASE_URL
        };

        const scopes = [
            'https://www.googleapis.com/auth/firebase',
            'https://www.googleapis.com/auth/userinfo.email'
        ];

        const jwtClient = new google.auth.JWT(
            serviceAccount.client_email,
            null,
            serviceAccount.private_key,
            scopes,
            null
        );

        jwtClient.authorize((err, token) => {

            if (err) {
                return reject(err);
            }

            return resolve(token.access_token);

        });

    });
};

module.exports = {
    getAccessToken: getAccessToken
};
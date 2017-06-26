'use strict';

const Promise = require('bluebird');
const google = require('googleapis');

require('dotenv').config({
    path: process.cwd() + '/../../.env'
});

const getAccessToken = () => {
    return new Promise((resolve, reject) => {
        if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
            return reject(new Error('Missing environment variable `FIREBASE_SERVICE_ACCOUNT_JSON`'));
        }

        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

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
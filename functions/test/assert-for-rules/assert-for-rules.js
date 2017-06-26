'use strict';

const Promise = require('bluebird');
const auth = require('./auth.js');
const unirest = require('unirest');
const yargs = require('yargs');

require('dotenv').config({
    path: process.cwd() + '/../../.env'
});

yargs.default({
    events: true
});

const getRules = (accessToken) => {
    return new Promise((resolve, reject) => {

        if (!process.env.FIREBASE_DATABASE_URL) {
            return reject(new Error('Missing environment variable `FIREBASE_DATABASE_URL`'));
        }

        return unirest.get(process.env.FIREBASE_DATABASE_URL + '/.rules/rules.json')
            .headers({
                'Authorization': 'Bearer ' + accessToken
            })
            .end((response) => {

                if (response.error) {
                    return reject(response.error);
                }

                return resolve(response.raw_body);

            });

    });
};

const getErrors = (app, action, accessToken, rules) => {
    return new Promise((resolve, reject) => {

        if (!process.env.FIREBASE_DATABASE_URL) {
            return reject(new Error('Missing environment variable `FIREBASE_DATABASE_URL`'));
        }

        return unirest.post(process.env.FIREBASE_DATABASE_URL + '/.rules/rules.json')
            .headers({
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            })
            .send(JSON.stringify({
                rules: rules,
                action: action,
                auth: app.options.databaseAuthVariableOverride
            }))
            .end((response) => {

                if (response.error) {
                    return reject(response.error);
                }

                return resolve(response.body);

            });

    });
};

const handleDebuggableError = function (app, path, callback, assertError, action, accessToken, rules) {

    if (!yargs.argv.events) {
        return callback(assertError);
    }

    if (!accessToken) {
        return auth.getAccessToken()
            .then((accessToken) => {
                return handleDebuggableError(app, path, callback, assertError, action, accessToken, rules);
            });
    }

    if (!rules) {
        return getRules(accessToken)
            .then((rules) => {
                return handleDebuggableError(app, path, callback, assertError, action, accessToken, rules);
            });
    }

    getErrors(app, action, accessToken, rules)
        .then((errors) => {

            let type = action.type == 'get' ? 'read' : 'write';

            let lineLength = 120;
            let linePrefix = '     ';
            let lineSeperator = linePrefix;

            for (let x = 4; x < lineLength; x++) {
                lineSeperator += '-';
            }

            let lines = [];

            lines.push(assertError.message);
            lines.push('');
            lines.push('');

            let events = {};

            for (let x = 0; x < errors[type].events.length; x++) {

                if (errors[type].events[x].result == errors[type].success) {

                    errors[type].events[x].line++;

                    if (!(events[errors[type].events[x].line] && events[errors[type].events[x].line][errors[type].events[x].column])) {

                        events[errors[type].events[x].line] = events[errors[type].events[x].line] || {};
                        events[errors[type].events[x].line][errors[type].events[x].column] = true;

                        lines.push(lineSeperator);
                        lines.push(linePrefix + 'Event');
                        lines.push(lineSeperator);
                        lines.push(linePrefix + 'Type: ' + errors[type].events[x].type);
                        lines.push(linePrefix + 'Path: ' + errors[type].events[x].path);
                        lines.push(linePrefix + 'Line: ' + errors[type].events[x].line);
                        lines.push(linePrefix + 'Column: ' + errors[type].events[x].column);

                        let excerpt = linePrefix + 'Excerpt: ' + errors[type].events[x].expr.substring(errors[type].events[x].column);
                        if (excerpt.length > lineSeperator.length) {
                            excerpt = excerpt.substring(0, (lineSeperator.length - 5)) + ' ...';
                        }
                        lines.push(excerpt);

                        lines.push(lineSeperator);
                        lines.push('');
                        lines.push('');

                    }

                }

            }

            assertError.message = lines.join('\n');
            callback(assertError);

        });

};

const canRead = function (app, path, callback) {

    const db = app.database();
    const assertError = new Error('Read Denied');

    db.ref(path).once('value').then(function () {
        callback();
    }).catch(function (firebaseError) {

        const action = {
            type: 'get',
            path: path
        };

        handleDebuggableError(app, path, callback, assertError, action);

    });

};

const cannotRead = function (app, path, callback) {

    const db = app.database();
    const assertError = new Error('Read Granted');

    db.ref(path).once('value').then(function (val) {

        const action = {
            type: 'get',
            path: path
        };

        handleDebuggableError(app, path, callback, assertError, action);

    }).catch(function (firebaseError) {
        callback();
    });

};

const canSet = function (app, path, newValue, callback) {

    const db = app.database();
    const assertError = new Error('Set Denied');

    db.ref(path).set(newValue).then(function () {
        callback();
    }).catch(function (firebaseError) {

        const action = {
            type: 'put',
            path: path,
            data: newValue
        };

        handleDebuggableError(app, path, callback, assertError, action);

    });

};

const cannotSet = function (app, path, newValue, callback) {

    const db = app.database();
    const assertError = new Error('Set allowed');

    db.ref(path).set(newValue).then(function () {

        const action = {
            type: 'put',
            path: path,
            data: newValue
        };

        handleDebuggableError(app, path, callback, assertError, action);

    }).catch(function (firebaseError) {
        callback();
    });

};

const canUpdate = function (app, path, newValue, callback) {

    const db = app.database();
    const assertError = new Error('Update Denied');

    db.ref(path).update(newValue).then(function () {
        callback();
    }).catch(function (firebaseError) {

        const action = {
            type: 'patch',
            path: path,
            data: newValue
        };

        handleDebuggableError(app, path, callback, assertError, action);

    });

};

const cannotUpdate = function (app, path, newValue, callback) {

    const db = app.database();
    const assertError = new Error('Update Granted');

    db.ref(path).update(newValue).then(function () {

        const action = {
            type: 'patch',
            path: path,
            data: newValue
        };

        handleDebuggableError(app, path, callback, assertError, action);

    }).catch(function (firebaseError) {
        callback();
    });

};

const canPush = function (app, path, newValue, callback) {

    const db = app.database();
    const assertError = new Error('Push Denied');

    db.ref(path).push(newValue).then(function () {
        callback();
    }).catch(function (firebaseError) {

        path += '/' + db.ref(path).push().key;

        const action = {
            type: 'put',
            path: path,
            data: newValue
        };

        handleDebuggableError(app, path, callback, assertError, action);

    });

};

const cannotPush = function (app, path, newValue, callback) {

    const db = app.database();
    const assertError = new Error('Push Granted');

    db.ref(path).push(newValue).then(function () {

        path += '/' + db.ref(path).push().key;

        const action = {
            type: 'put',
            path: path,
            data: newValue
        };

        handleDebuggableError(app, path, callback, assertError, action);

    }).catch(function (firebaseError) {
        callback();
    });

};

module.exports = {
    canPush: canPush,
    canRead: canRead,
    canSet: canSet,
    canUpdate: canUpdate,
    cannotPush: cannotPush,
    cannotRead: cannotRead,
    cannotSet: cannotSet,
    cannotUpdate: cannotUpdate
};
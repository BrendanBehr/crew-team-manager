'use strict';

const Team = require('../team');
const firebaseAdmin = require('firebase-admin');
const serviceAccount = require('../../crew-team-manager-service-account.json');

class Generator {

    constructor() {

        this._data = {};
        this._athletes = [];
        this._boats = [];
        this._riggers = [];
        this._oars = [];
        this._regattas = [];
        this._ergs = [];
        this._teams = [];
        this._users = [];
        this._finances = [];

    }

    getAthletes() {
        return this._athletes;
    }

    getTeams() {
        return this._teams;
    }

    getRiggers() {
        return this._riggers;
    }

    getBoats() {
        return this._boats;
    }

    getOars() {
        return this._oars;
    }

    getRegattas() {
        return this._regattas;
    }

    getErgs() {
        return this._ergs;
    }

    getUsers() {
        return this._users;
    }

    getFinances() {
        return this._finances;
    }

    getData() {
        return this._data;
    }

    getFirebaseAdmin() {

        if (!this._firebaseAdmin) {

            firebaseAdmin.initializeApp({
                credential: firebaseAdmin.credential.cert(serviceAccount),
                databaseURL: 'https://laborsync-ctm.firebaseio.com'
            });

            this._firebaseAdmin = firebaseAdmin;

        }

        return this._firebaseAdmin;
    }

    getDatabase() {

        if (!this._database) {
            this._database = this.getFirebaseAdmin().database();
        }

        return this._database;

    }



    createTeam(values) {
        return new Team({
            generator: this,
            values: values
        });
    }

    createTeams(quantity) {
        const teams = [];
        while (quantity > 0) {
            teams.push(this.createTeam());
            quantity--;
        }

        return teams;
    }

    writeData() {
        this.getDatabase().ref().set(this.getData())
            .then(() => {

                this.getFirebaseAdmin().app().delete().then(() => {
                    this._firebaseAdmin = null;
                    this._database = null;
                });

            })
            .catch((err) => {

                console.log(err.message);
                this.getFirebaseAdmin().app().delete().then(() => {
                    this._firebaseAdmin = null;
                    this._database = null;
                });

            });

    }

}


module.exports = Generator;
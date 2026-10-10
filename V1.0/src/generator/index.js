'use strict';

import Team from '../team';
import { getDatabase, ref, set } from "firebase/database";
import serviceAccount from '../../ctm-service-account.json' assert { type: 'json' };

export default class Generator {

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
        this._credentials = [];

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

    getCredentials() {
        return this._credentials;
    }

    getData() {
        return this._data;
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

    getDatabase() {
        return getDatabase()
    }

    writeData() {
        const db = this.getDatabase();
        set(ref(db, '/'), this.getData());
    }
}
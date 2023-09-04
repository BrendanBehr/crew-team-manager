'use strict';

import { faker } from '@faker-js/faker';
import User from '../user';

export default class Athlete extends User {

    constructor(options) {

        options = options || {};
        options.plural = 'athletes';

        options.values = options.values || {};
        options.values.firstName = options.values.firstName || faker.person.firstName();
        options.values.lastName = options.values.lastName || faker.person.lastName();
        options.values.streetAddress = options.values.streetAddress || faker.location.streetAddress();
        options.values.city = options.values.city || faker.location.city();
        options.values.state = options.values.state || faker.location.state();
        options.values.phone = options.values.phone || faker.phone.number();
        options.values.weight = options.values.weight || faker.number.int() / 1000 + 100;
        options.values.height = options.values.height || faker.number.int() / 10000 + '\'' + Math.floor(faker.number.int() / 1000);
        options.values.ergScore = options.values.ergScore || Math.floor(faker.number.int() / 10000) + ':' + Math.floor(faker.number.int() / 1000);
        options.values.side = options.values.side || 'port';
        options.values.year = options.values.year || 'freshman';
        options.values.gender = options.values.gender || 'M/F';
        options.values.fundRaising = options.values.fundRaising || faker.number.int() / 100;
        options.values.driver = options.values.driver || 'no';
        options.values.email = options.values.email || faker.internet.email();
        options.values.updated = options.values.updated || faker.number.int();
        options.values.created = options.values.created || faker.number.int();
        options.values.credential = options.values.credential || 'NA';

        super(options);

        this._ergs = [];
        this._finances = [];
        this._emails = [];

        this.getGenerator().getAthletes().push(this);
    }

    createUser(values) {

        return new User({
            generator: this.getGenerator(),
            team: this,
            values: values
        });
    }

    getUsers() {

        const athlete = this;
        return this.getGenerator().getUser().filter((athlete) => {
            return athlete.getAthlete() == athlete;
        });
    }

    getUser() {
        return this._athlete;
    }

    addErg(erg) {
        let val = erg.getValues({
            reference: false
        });

        if (val.team == this.getTeam().getPathKey()) {
            this.getData().athleteErgs = this.getData().athleteErgs || {};
            this.getData().athleteErgs[this.getPathKey()] = this.getData().athleteErgs[this.getPathKey()] || {};

            if (!this.getData().athleteErgs[this.getPathKey()][erg.getPathKey()]) {
                const value = {
                    number: val.number,
                    model: val.model
                };
                this.getData().athleteErgs[this.getPathKey()][erg.getPathKey()] = value;
                this._ergs.push(erg);
            }

        }
    }
    setCredential(credential) {
        this._credential = credential;

        let values = {};
        values[this.getCredential().getSingular()] = this.getCredential().getPathKey();

        return this.updateValues(values);

    }

    getCredentials() {

        const athlete = this;
        return this.getGenerator().getCredential().filter((credential) => {
            return credential.getUser() == athlete;
        });

    }

    getCredential() {
        return this._credential;
    }

    removeErg(erg) {

        this.getData().athleteErgs = this.getData().athleteErgs || {};
        this.getData().athleteErgs[this.getPathKey()] = this.getData().athleteErgs[this.getPathKey()] || {};

        if (this.getData().athleteErgs[this.getPathKey()][erg.getPathKey()]) {
            this.getData().athleteErgs[this.getPathKey()][erg.getPathKey()] = null;
            this._ergs = this.getAthletes().filter((element) => {
                return element != erg;
            });
        }
    }

    getErgs() {
        return this._ergs;
    }

    addFinance(finance) {
        let val = finance.getValues({
            reference: false
        });

        if (val.team == this.getTeam().getPathKey()) {
            this.getData().athleteFinances = this.getData().athleteFinances || {};
            this.getData().athleteFinances[this.getPathKey()] = this.getData().athleteFinances[this.getPathKey()] || {};

            if (!this.getData().athleteFinances[this.getPathKey()][finance.getPathKey()]) {
                const value = {
                    reason: val.reason,
                    gross: val.gross
                };
                this.getData().athleteFinances[this.getPathKey()][finance.getPathKey()] = value;
                this._finances.push(finance);
            }
        }
    }

    removeFinance(finance) {

        this.getData().athleteFinances = this.getData().athleteFinances || {};
        this.getData().athleteFinances[this.getPathKey()] = this.getData().athleteFinances[this.getPathKey()] || {};

        if (this.getData().athleteFinances[this.getPathKey()][finance.getPathKey()]) {
            this.getData().athleteFinances[this.getPathKey()][finance.getPathKey()] = null;
            this._finances = this.getAthletes().filter((element) => {
                return element != finance;
            });
        }
    }

    getFinances() {
        return this._finances;
    }

    addEmail(email) {
        let val = email.getValues({
            reference: false
        });
        if (val.user == this.getCredential().getValues().user) {
            this.getData().athleteEmails = this.getData().athleteEmails || {};
            this.getData().athleteEmails[this.getPathKey()] = this.getData().athleteEmails[this.getPathKey()] || {};

            if (!this.getData().athleteEmails[this.getPathKey()][email.getPathKey()]) {
                this.getData().athleteEmails[this.getPathKey()][email.getPathKey()] = true;
                this._emails.push(email);
            }
        }
    }

    removeEmail(email) {

        this.getData().athleteEmails = this.getData().athleteEmails || {};
        this.getData().athleteEmails[this.getPathKey()] = this.getData().athleteEmails[this.getPathKey()] || {};

        if (this.getData().athleteEmails[this.getPathKey()][email.getPathKey()]) {
            this.getData().athleteEmails[this.getPathKey()][email.getPathKey()] = null;
            this._emails = this.getAthletes().filter((element) => {
                return element != email;
            });
        }
    }

    getEmails() {
        return this._emails;
    }
}
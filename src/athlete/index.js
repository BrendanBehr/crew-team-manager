'use strict';

const faker = require('faker');
const Entity = require('../entity');
const User = require('../athlete');

class Athlete extends Entity {

    constructor(options) {

        options = options || {};
        options.plural = 'athletes';

        options.values = options.values || {};
        options.values.firstName = options.values.firstName || faker.name.firstName();
        options.values.lastName = options.values.lastName || faker.name.lastName();
        options.values.streetAddress = options.values.streetAddress || faker.address.streetAddress();
        options.values.city = options.values.city || faker.address.city();
        options.values.state = options.values.state || faker.address.state();
        options.values.phone = options.values.phone || faker.phone.phoneNumber();
        options.values.weight = options.values.weight || faker.random.number() / 1000 + 100;
        options.values.height = options.values.height || faker.random.number() / 10000 + '\'' + Math.floor(faker.random.number() / 1000);
        options.values.ergScore = options.values.ergScore || Math.floor(faker.random.number() / 10000) + ':' + Math.floor(faker.random.number() / 1000);
        options.values.side = options.values.side || 'port';
        options.values.year = options.values.year || 'freshman';
        options.values.gender = options.values.gender || 'M/F';
        options.values.fundRaising = options.values.fundRaising || faker.random.number() / 100;
        options.values.driver = options.values.driver || 'no';
        options.values.email = options.values.email || faker.internet.email();
        options.values.updated = options.values.updated || faker.random.number();
        options.values.created = options.values.created || faker.random.number();
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
                this.getData().athleteErgs[this.getPathKey()][erg.getPathKey()] = true;
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
                this.getData().athleteFinances[this.getPathKey()][finance.getPathKey()] = true;
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

module.exports = Athlete;
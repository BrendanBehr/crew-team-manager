'use strict';

const faker = require('faker');
const Entity = require('../entity');
const Email = require('../email');
const Credential = require('../credential');
const User = require('../user');

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
        options.values.fundRaising = options.values.fundRaising || faker.finance.amount();
        options.values.driver = options.values.driver || faker.random.boolean();
        options.values.credential = options.values.credential || faker.lorem.slug();

        super(options);

        this._ergs = [];

        this.getGenerator().getAthletes().push(this);
    }
    createCredential(values) {
        return new Credential({
            generator: this.getGenerator(),
            athlete: this,
            values: values
        });
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
            return credential.getAthlete() == athlete;
        });
    }

    getCredential() {
        return this._credential;
    }

    createEmail(values) {
        return new Email({
            generator: this.getGenerator(),
            team: this,
            values: values
        });
    }

    getEmails() {
        const athlete = this;
        return this.getGenerator().getEmail().filter((email) => {
            return email.getEmail() == athlete;
        });
    }

    getEmail() {
        return this._email;
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
        return this.getGenerator().getUser().filter((user) => {
            return user.getAthlete() == athlete;
        });
    }

    getUser() {
        return this._user;
    }

    addErg(erg) {

        this.getData().athleteErgs = this.getData().athleteErgs || {};
        this.getData().athleteErgs[this.getPathKey()] = this.getData().athleteErgs[this.getPathKey()] || {};

        if (!this.getData().athleteErgs[this.getPathKey()][erg.getPathKey()]) {
            this.getData().athleteErgs[this.getPathKey()][erg.getPathKey()] = true;
            this._ergs.push(erg);
        }
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

        this.getData().athleteFinances = this.getData().athleteFinances || {};
        this.getData().athleteFinances[this.getPathKey()] = this.getData().athleteFinances[this.getPathKey()] || {};

        if (!this.getData().athleteFinances[this.getPathKey()][finance.getPathKey()]) {
            this.getData().athleteFinances[this.getPathKey()][finance.getPathKey()] = true;
            this._ergs.push(finance);
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
        return this._ergs;
    }
}

module.exports = Athlete;
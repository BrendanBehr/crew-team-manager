'use strict';

const faker = require('faker');
const Entity = require('../entity');
const Credential = require('../credential');
const Email = require('../email');
const Auth = require('../auth');
class User extends Entity {

    constructor(options) {

        options = options || {};
        options.plural = 'users';

        options.values = options.values || {};
        options.values.userName = options.values.userName || faker.random.word();
        options.values.firstName = options.values.firstName || faker.name.firstName();
        options.values.lastName = options.values.lastName || faker.name.lastName();
        options.values.credentials = options.values.credentials || faker.lorem.slug();
        options.values.status = options.values.status || 'active';
        options.values.permisions = options.values.permisions || 'basic';
        options.values.email = options.values.email || faker.internet.email();
        options.values.updated = options.values.updated || faker.random.number();
        options.values.created = options.values.created || faker.random.number();


        super(options);

        this.getGenerator().getUsers().push(this);

    }

    createCredential(values) {
        return new Credential({
            generator: this.getGenerator(),
            user: this,
            values: values,
        });

    }
    setCredential(credential) {
        this._credential = credential;

        let values = {};
        values[this.getCredential().getSingular()] = this.getCredential().getPathKey();

        return this.updateValues(values);

    }

    getCredentials() {

        const user = this;
        return this.getGenerator().getCredential().filter((credential) => {
            return credential.getUser() == user;
        });

    }

    getCredential() {
        return this._credential;
    }

    createAuth(values) {

        return new Auth({
            generator: this.getGenerator(),
            team: this,
            values: values
        });

    }

    createAuths(quantity) {

        quantity = quantity || 0;

        const auths = [];
        while (quantity > 0) {
            auths.push(this.createAuth());
            quantity--;
        }

        return auths;

    }

    getAuths() {

        const team = this;
        return this.getGenerator().getAuth().filter((auth) => {
            return auth.getTeam() == team;
        });

    }

    getAuth() {
        return this._auth;
    }

    createEmail(values) {
        return new Email({
            generator: this.getGenerator(),
            team: this,
            values: values,
        });

    }

    createEmails(quantity) {

        quantity = quantity || 0;

        const emails = [];
        while (quantity > 0) {
            emails.push(this.createEmail());
            quantity--;
        }

        return emails;

    }

    getEmails() {

        const user = this;
        return this.getGenerator().getEmail().filter((email) => {
            return email.getUser() == user;
        });

    }

    getEmail() {
        return this._email;
    }
}

module.exports = User;
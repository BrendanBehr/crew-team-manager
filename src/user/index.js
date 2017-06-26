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

    createEmail(values) {
        return new Email({
            generator: this.getGenerator(),
            user: this,
            values: values
        });
    }

    getEmails() {
        const user = this;
        return this.getGenerator().getEmail().filter((email) => {
            return email.getEmail() == user;
        });
    }

    getEmail() {
        return this._email;
    }

    createAuth(values) {
        return new Auth({
            generator: this.getGenerator(),
            user: this,
            values: values
        });
    }

    getAuths() {
        const user = this;
        return this.getGenerator().getAuth().filter((auth) => {
            return auth.getAuth() == user;
        });
    }

    getAuth() {
        return this._auth;
    }
}

module.exports = User;
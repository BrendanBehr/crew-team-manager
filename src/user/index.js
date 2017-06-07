'use strict';

const faker = require('faker');
const Entity = require('../entity');
const Credential = require('../credential');
class User extends Entity {

    constructor(options) {

        options = options || {};
        options.plural = 'users';

        options.values = options.values || {};
        options.values.userName = options.values.userName || faker.random.word();
        options.values.firstName = options.values.firstName || faker.name.firstName();
        options.values.lastName = options.values.lastName || faker.name.lastName();
        options.values.credentials = options.values.credentials || faker.lorem.slug();


        super(options);

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

        const user = this;
        return this.getGenerator().getCredential().filter((credential) => {
            return credential.getUser() == user;
        });

    }

    getCredential() {
        return this._credential;
    }
}

module.exports = User;
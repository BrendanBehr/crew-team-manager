'use strict';

const faker = require('faker');
const Entity = require('../entity');
const crypto = require('crypto');

class Credential extends Entity {

    constructor(options) {

        options = options || {};
        options.plural = 'credentials';


        options.values = options.values || {};
        options.values.hash = options.values.hash || faker.internet.password();
        options.values.salt = options.values.salt || faker.internet.password();

        super(options);

        if (options.user) {
            this.setUser(options.user);
        }

        this.getGenerator().getCredentials().push(this);

    }

    setPassword(password) {

        this._password = password;

        let salt = crypto.randomBytes(256).toString('hex');

        let hash = crypto.createHash('sha256');
        hash.update(password + salt);

        this.updateValues({
            hash: hash.digest('hex'),
            salt: salt,
            credential: password

        });

    }

    getPassword() {
        return this._password;
    }

    getUser() {
        return this._user
    }

    setUser(user) {
        this._user = user;

        this.updateValues({
            user: user.getPathKey()
        });

    }

}

module.exports = Credential;
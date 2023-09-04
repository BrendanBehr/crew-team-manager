'use strict';

import { faker } from '@faker-js/faker';
import Entity from '../entity/index.js';

// import * as CryptoJS from 'crypto-es';
import { WordArray } from 'crypto-es/lib/core.js';
import { SHA256 } from 'crypto-es/lib/sha256.js';
import { Hex } from 'crypto-es/lib/core.js';

export default class Credential extends Entity {

    constructor(options) {

        options = options || {};
        options.plural = 'credentials';


        options.values = options.values || {};
        options.values.hash = options.values.hash || faker.internet.password();
        options.values.salt = options.values.salt || faker.internet.password();
        options.values.updated = options.values.updated || faker.number.int();
        options.values.created = options.values.created || faker.number.int();

        super(options);

        if (options.user) {
            this.setUser(options.user);
        }

        this.getGenerator().getCredentials().push(this);

    }

    setPassword(password) {

        this._password = password;

        let salt = WordArray.random(128 / 8);

        let hash = SHA256(password + salt);

        this.updateValues({
            hash: hash.toString(Hex),
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
'use strict';

const faker = require('faker');
const Entity = require('../entity');
class Email extends Entity {

    constructor(options) {

        options = options || {};
        options.plural = 'emails';

        options.values = options.values || {};
        options.values.value = options.values.value || faker.internet.email();
        options.values.updated = options.values.updated || faker.random.number();
        options.values.created = options.values.created || faker.random.number();



        super(options);

        this.getGenerator().getAthletes().push(this);

    }
}

module.exports = Email;
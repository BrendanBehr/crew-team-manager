'use strict';

const faker = require('faker');
const Entity = require('../entity');

class Email extends Entity {

    constructor(options) {

        options = options || {};
        options.plural = 'emails';


        options.values = options.values || {};
        options.values.emailAddress = options.values.emailAddress || faker.internet.email();

        super(options);

        this.getGenerator().getAthletes().push(this);

    }

}

module.exports = Email;
'use strict';

const faker = require('faker');
const Entity = require('../entity');
class Auth extends Entity {

    constructor(options) {

        options = options || {};
        options.plural = 'auths';

        options.values = options.values || {};
        options.values.created = options.values.created || faker.random.number();
        options.values.updated = options.values.updated || faker.random.number();
        options.values.ip = options.values.ip || faker.internet.ip();
        options.values.browser = options.values.browser || faker.lorem.words();
        options.values.status = options.values.status || 'active';
        options.values.permisions = options.values.permisions || 'basic';



        super(options);

        this.getGenerator().getAthletes().push(this);

    }
}

module.exports = Auth;
'use strict';

const faker = require('faker');
const Entity = require('../entity');

class Picture extends Entity {

    constructor(options) {

        options = options || {};
        options.plural = 'pictures';

        options.values = options.values || {};

        options.values.url = options.values.url || faker.image.image();
        options.values.caption = options.values.caption || faker.name.firstName() + faker.name.lastName();
        options.values.updated = options.values.updated || faker.random.number();
        options.values.created = options.values.created || faker.random.number();

        super(options);

        this.getGenerator().getAthletes().push(this);

    }

}

module.exports = Picture;
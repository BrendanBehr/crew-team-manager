'use strict';

const faker = require('faker');
const Entity = require('../entity');

class Picture extends Entity {

    constructor(options) {

        options = options || {};
        options.plural = 'pictures';

        options.values = options.values || {};

        options.values.url = options.values.url || faker.image.imageUrl();

        super(options);

        this.getGenerator().getAthletes().push(this);

    }

}

module.exports = Picture;
'use strict';

const faker = require('faker');
const Entity = require('../entity');

class Oar extends Entity {

    constructor(options) {

        options = options || {};
        options.plural = 'oars';

        options.values = options.values || {};
        options.values.color = options.values.color || faker.commerce.color();
        options.values.shape = options.values.shape || 'square';
        options.values.length = options.values.length || faker.random.number() / 100;
        options.values.handleGrip = options.values.handleGrip || 'rubber';
        options.values.name = options.values.name || faker.name.lastName();

        super(options);

        this.getGenerator().getAthletes().push(this);

    }

}

module.exports = Oar;
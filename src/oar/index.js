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
        options.values.hadleGrip = options.values.hadleGrip || 'rubber';

        super(options);

        this.getGenerator().getAthletes().push(this);

    }

}

module.exports = Oar;
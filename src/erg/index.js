'use strict';

const faker = require('faker');
const Entity = require('../entity');

class Erg extends Entity {

    constructor(options) {

        options = options || {};
        options.plural = 'ergs';

        options.values = options.values || {};
        options.values.condition = options.values.condition || 'average';
        options.values.location = options.values.location || 'home';
        options.values.number = options.values.number || faker.random.number() / 10000;
        options.values.screenType = options.values.screenType || 'pm5';
        options.values.model = options.values.model || faker.random.alphaNumeric();

        super(options);

        this.getGenerator().getAthletes().push(this);

    }

}

module.exports = Erg;
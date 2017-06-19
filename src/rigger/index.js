'use strict';

const faker = require('faker');
const Entity = require('../entity');

class Rigger extends Entity {

    constructor(options) {

        options = options || {};
        options.plural = 'riggers';

        options.values = options.values || {};
        options.values.side = options.values.side || 'Port';
        options.values.style = options.values.style || 'Sweep';
        options.values.type = options.values.type || 'European';
        options.values.seat = options.values.seat || faker.random.number() / 1000;

        super(options);

        this.getGenerator().getAthletes().push(this);

    }

}

module.exports = Rigger;
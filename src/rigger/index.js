'use strict';

const faker = require('faker');
const Entity = require('../entity');

class Rigger extends Entity {

    constructor(options) {

        options = options || {};
        options.plural = 'riggers';

        options.values = options.values || {};
        options.values.style = options.values.style || 'Sweep';
        options.values.type = options.values.type || 'European';
        options.values.seat = options.values.seat || Math.floor(faker.random.number() / 10000);
        if (options.values.seat % 2 === 0) {
            options.values.side = options.values.side || 'Port';
        } else {
            options.values.side = options.values.side || 'Starboard';

        }

        super(options);

        this.getGenerator().getAthletes().push(this);

    }

}

module.exports = Rigger;
'use strict';

const faker = require('faker');
const Entity = require('../entity');

class Race extends Entity {

    constructor(options) {

        options = options || {};
        options.plural = 'races';

        options.values = options.values || {};
        options.values.eventName = options.values.eventName || faker.random.word();
        options.values.raceTime = options.values.raceTime || Math.floor(faker.random.number() / 10000) + ':' + Math.floor(faker.random.number() / 1000);
        options.values.suggestedLaunchTime = options.values.suggestedLaunchTime || Math.floor(faker.random.number() / 10000) + ':' + Math.floor(faker.random.number() / 1000);
        options.values.bowNumber = options.values.bowNumber || Math.floor(faker.random.number() / 10000);
        options.values.updated = options.values.updated || faker.random.number();
        options.values.created = options.values.created || faker.random.number();

        super(options);

        this.getGenerator().getAthletes().push(this);

    }

}

module.exports = Race;
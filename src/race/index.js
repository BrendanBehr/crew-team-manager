'use strict';

import { faker } from '@faker-js/faker';
import Entity from '../entity/index.js';

export default class Race extends Entity {

    constructor(options) {

        options = options || {};
        options.plural = 'races';

        options.values = options.values || {};
        options.values.eventName = options.values.eventName || faker.word.words();
        options.values.raceTime = options.values.raceTime || Math.floor(faker.number.int() / 10000) + ':' + Math.floor(faker.number.int() / 1000);
        options.values.suggestedLaunchTime = options.values.suggestedLaunchTime || Math.floor(faker.number.int() / 10000) + ':' + Math.floor(faker.number.int() / 1000);
        options.values.bowNumber = options.values.bowNumber || Math.floor(faker.number.int() / 10000);
        options.values.updated = options.values.updated || faker.number.int();
        options.values.created = options.values.created || faker.number.int();

        super(options);

        this.getGenerator().getAthletes().push(this);

    }
}
'use strict';

import { faker } from '@faker-js/faker';
import Entity from '../entity/index.js';

export default class Erg extends Entity {

    constructor(options) {

        options = options || {};
        options.plural = 'ergs';

        options.values = options.values || {};
        options.values.condition = options.values.condition || 'average';
        options.values.location = options.values.location || 'home';
        options.values.number = options.values.number || Math.floor(faker.number.int() / 1000);
        options.values.screenType = options.values.screenType || 'pm5';
        options.values.model = options.values.model || faker.hacker.phrase();
        options.values.updated = options.values.updated || faker.number.int();
        options.values.created = options.values.created || faker.number.int();

        super(options);

        this.getGenerator().getAthletes().push(this);

    }
}
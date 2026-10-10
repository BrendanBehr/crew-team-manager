'use strict';

import { faker } from '@faker-js/faker';
import Entity from '../entity/index.js';

export default class Oar extends Entity {

    constructor(options) {

        options = options || {};
        options.plural = 'oars';

        options.values = options.values || {};
        options.values.color = options.values.color || faker.color.human();
        options.values.shape = options.values.shape || 'square';
        options.values.length = options.values.length || faker.number.int() / 100;
        options.values.handleGrip = options.values.handleGrip || 'rubber';
        options.values.name = options.values.name || faker.person.lastName();
        options.values.updated = options.values.updated || faker.number.int();
        options.values.created = options.values.created || faker.number.int();

        super(options);

        this.getGenerator().getAthletes().push(this);
    }
}
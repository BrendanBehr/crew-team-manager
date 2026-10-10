'use strict';

import { faker } from '@faker-js/faker';
import Entity from '../entity';

export default class Email extends Entity {

    constructor(options) {

        options = options || {};
        options.plural = 'emails';

        options.values = options.values || {};
        options.values.value = options.values.value || faker.internet.email();
        options.values.updated = options.values.updated || faker.number.int();
        options.values.created = options.values.created || faker.number.int();

        super(options);

        this.getGenerator().getAthletes().push(this);
    }
}
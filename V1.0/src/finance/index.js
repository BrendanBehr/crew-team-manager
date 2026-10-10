'use strict';

import { faker } from '@faker-js/faker';
import Entity from '../entity/index.js';

export default class Finances extends Entity {

    constructor(options) {

        options = options || {};
        options.plural = 'finances';

        options.values = options.values || {};
        options.values.expenses = options.values.expenses || faker.number.int() / 10000;
        options.values.incomes = options.values.incomes || faker.number.int() / 1000;
        options.values.gross = options.values.incomes - options.values.expenses;
        options.values.reason = options.values.reason || faker.lorem.word();
        options.values.updated = options.values.updated || faker.number.int();
        options.values.created = options.values.created || faker.number.int();

        super(options);

        this.getGenerator().getAthletes().push(this);
    }
}
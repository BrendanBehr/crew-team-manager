'use strict';

const faker = require('faker');
const Entity = require('../entity');

class Finances extends Entity {

    constructor(options) {

        options = options || {};
        options.plural = 'finances';

        options.values = options.values || {};
        options.values.expenses = options.values.expenses || faker.random.number() / 10000;
        options.values.incomes = options.values.incomes || faker.random.number() / 1000;
        options.values.gross = options.values.incomes - options.values.expenses;
        options.values.reason = options.values.reason || faker.lorem.word();
        options.values.updated = options.values.updated || faker.random.number();
        options.values.created = options.values.created || faker.random.number();

        super(options);

        this.getGenerator().getAthletes().push(this);

    }

}

module.exports = Finances;
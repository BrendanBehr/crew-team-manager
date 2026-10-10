'use strict';

import { faker } from '@faker-js/faker';
import Entity from '../entity';

export default class Rigger extends Entity {

    constructor(options) {

        options = options || {};
        options.plural = 'riggers';

        options.values = options.values || {};
        options.values.style = options.values.style || 'Sweep';
        options.values.type = options.values.type || 'European';
        options.values.seat = options.values.seat || Math.floor(faker.number.int() / 10000);
        options.values.updated = options.values.updated || faker.number.int();
        options.values.created = options.values.created || faker.number.int();

        if (options.values.seat % 2 === 0) {
            options.values.side = options.values.side || 'Port';
        } else {
            options.values.side = options.values.side || 'Starboard';

        }

        if (options.values.seat == 0) {
            options.values.seat = 1;
        }

        if (options.values.seat > 8) {
            options.values.seat = options.values.seat - 2;
        }

        super(options);

        this.getGenerator().getAthletes().push(this);
    }
}
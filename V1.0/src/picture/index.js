'use strict';

import { faker } from '@faker-js/faker';
import Entity from '../entity';

export default class Picture extends Entity {

    constructor(options) {

        options = options || {};
        options.plural = 'pictures';

        options.values = options.values || {};

        options.values.url = options.values.url || faker.image.urlPicsumPhotos();
        options.values.caption = options.values.caption || faker.person.firstName() + faker.person.lastName();
        options.values.updated = options.values.updated || faker.number.int();
        options.values.created = options.values.created || faker.number.int();

        super(options);

        this.getGenerator().getAthletes().push(this);
    }
}
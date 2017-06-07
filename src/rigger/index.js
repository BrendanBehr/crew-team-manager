'use strict';

const faker = require('faker');
const Entity = require('../entity');

class Rigger extends Entity {

    constructor(options) {

        options = options || {};
        options.plural = 'riggers';

        options.values = options.values || {};
        options.values.side = options.values.side || 'Port';
        options.values.style = options.values.style || 'Sweep';
        options.values.type = options.values.type || 'European';

        super(options);

        this.getGenerator().getAthletes().push(this);

    }

}

module.exports = Rigger;
'use strict';

const faker = require('faker');
const Entity = require('../entity');
const Rigger = require('../rigger');

class Boat extends Entity {

    constructor(options) {

        options = options || {};
        options.plural = 'boats';

        options.values = options.values || {};
        options.values.name = options.values.name || faker.name.firstName() + ' ' + faker.name.lastName();
        options.values.rigging = options.values.rigging || 'port';
        options.values.size = options.values.size || 8;
        options.values.type = options.values.type || 'sweep';


        super(options);

        this._athletes = [];
        this._oars = [];

        this.getGenerator().getAthletes().push(this);

    }

    addAthlete(athlete) {

        this.getData().boatAthletes = this.getData().boatAthletes || {};
        this.getData().boatAthletes[this.getPathKey()] = this.getData().boatAthletes[this.getPathKey()] || {};

        if (!this.getData().boatAthletes[this.getPathKey()][athlete.getPathKey()]) {
            this.getData().boatAthletes[this.getPathKey()][athlete.getPathKey()] = true;
            this._athletes.push(athlete);
        }

    }

    removeAthlete(athlete) {

        this.getData().boatAthletes = this.getData().boatAthletes || {};
        this.getData().boatAthletes[this.getPathKey()] = this.getData().boatAthletes[this.getPathKey()] || {};

        if (this.getData().boatAthletes[this.getPathKey()][athlete.getPathKey()]) {
            this.getData().boatAthletes[this.getPathKey()][athlete.getPathKey()] = null;
            this._athletes = this.getAthletes().filter((element) => {
                return element != athlete;
            });
        }

    }

    getAthletes() {
        return this._athletes;
    }

    createRigger(values) {
        this._team = this.getTeam();
        return new Rigger({
            generator: this.getGenerator(),
            team: this,
            values: values
        });

    }

    createRiggers(quantity) {

        quantity = quantity || 0;

        const riggers = [];
        while (quantity > 0) {
            riggers.push(this.createRigger());
            quantity--;
        }

        return riggers;

    }

    getRiggers() {

        const team = this;
        return this.getGenerator().getRigger().filter((rigger) => {
            return rigger.getTeam() == team;
        });

    }

    getRigger() {
        return this._rigger;
    }

    addOar(oar) {

        this.getData().boatOars = this.getData().boatOars || {};
        this.getData().boatOars[this.getPathKey()] = this.getData().boatOars[this.getPathKey()] || {};

        if (!this.getData().boatOars[this.getPathKey()][oar.getPathKey()]) {
            this.getData().boatOars[this.getPathKey()][oar.getPathKey()] = true;
            this._oars.push(oar);
        }

    }

    removeOar(oar) {

        this.getData().boatOars = this.getData().boatOars || {};
        this.getData().boatathletes[this.getPathKey()] = this.getData().boatOars[this.getPathKey()] || {};

        if (this.getData().boatOars[this.getPathKey()][oar.getPathKey()]) {
            this.getData().boatOars[this.getPathKey()][oar.getPathKey()] = null;
            this._oars = this.getAthletes().filter((element) => {
                return element != oar;
            });
        }

    }

    getOars() {
        return this._oars;
    }

}

module.exports = Boat;
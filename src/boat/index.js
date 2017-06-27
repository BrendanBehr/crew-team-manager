'use strict';

const faker = require('faker');
const Entity = require('../entity');

class Boat extends Entity {

    constructor(options) {

        options = options || {};
        options.plural = 'boats';

        options.values = options.values || {};
        options.values.name = options.values.name || faker.name.firstName() + ' ' + faker.name.lastName();
        options.values.rigging = options.values.rigging || 'port';
        options.values.size = options.values.size || 8;
        options.values.type = options.values.type || 'sweep';
        options.values.manufacturer = options.values.manufacturer || 'vespoli';


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

    addOars(oar) {

        this.getData().boatOars = this.getData().boatOars || {};
        this.getData().boatOars[this.getPathKey()] = this.getData().boatOars[this.getPathKey()] || {};

        for (let x = 0; x < oar.length; x++) {
            if (!this.getData().boatOars[this.getPathKey()][oar[x].getPathKey()]) {
                this.getData().boatOars[this.getPathKey()][oar[x].getPathKey()] = true;
                this._oars.push(oar[x]);
            }
        }

    }

    removeOar(oar) {

        this.getData().boatOars = this.getData().boatOars || {};
        this.getData().boatOars[this.getPathKey()] = this.getData().boatOars[this.getPathKey()] || {};

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

    addRiggers(rigger) {

        this.getData().boatRiggers = this.getData().boatRiggers || {};
        this.getData().boatRiggers[this.getPathKey()] = this.getData().boatRiggers[this.getPathKey()] || {};

        for (let x = 0; x < rigger.length; x++) {
            if (!this.getData().boatRiggers[this.getPathKey()][rigger[x].getPathKey()]) {
                this.getData().boatRiggers[this.getPathKey()][rigger[x].getPathKey()] = true;
                this._rigger.push(rigger[x]);
            }
        }

    }

    removeRigger(rigger) {

        this.getData().boatRiggers = this.getData().boatRiggers || {};
        this.getData().boatRiggers[this.getPathKey()] = this.getData().boatRiggers[this.getPathKey()] || {};

        if (this.getData().boatOars[this.getPathKey()][rigger.getPathKey()]) {
            this.getData().boatOars[this.getPathKey()][rigger.getPathKey()] = null;
            this._riggers = this.getAthletes().filter((element) => {
                return element != rigger;
            });
        }

    }

    getRiggers() {
        return this._riggers;
    }

}

module.exports = Boat;
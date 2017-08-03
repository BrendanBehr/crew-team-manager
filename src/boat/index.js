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
        options.values.updated = options.values.updated || faker.random.number();
        options.values.created = options.values.created || faker.random.number();


        super(options);

        this._athletes = [];
        this._oars = [];
        this._riggers = [];

        this.getGenerator().getAthletes().push(this);

    }

    addAthlete(athlete) {
        let val = athlete.getValues({
            reference: false
        });
        if (val.team == this.getTeam().getPathKey()) {
            this.getData().boatAthletes = this.getData().boatAthletes || {};
            this.getData().boatAthletes[this.getPathKey()] = this.getData().boatAthletes[this.getPathKey()] || {};

            if (!this.getData().boatAthletes[this.getPathKey()][athlete.getPathKey()]) {
                const value = {
                    firstName: val.firstName,
                    lastName: val.lastName
                };
                this.getData().boatAthletes[this.getPathKey()][athlete.getPathKey()] = value;
                this._athletes.push(athlete);
            }
        }

        if (val.team != this.getTeam().getPathKey()) {
            return false;
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

    addOar(oar) {
        let val = oar.getValues({
            reference: false
        });
        if (val.team == this.getTeam().getPathKey()) {

            this.getData().boatOars = this.getData().boatOars || {};
            this.getData().boatOars[this.getPathKey()] = this.getData().boatOars[this.getPathKey()] || {};

            if (!this.getData().boatOars[this.getPathKey()][oar.getPathKey()]) {

                const value = {
                    name: val.name
                };
                this.getData().boatOars[this.getPathKey()][oar.getPathKey()] = value;
                this._oars.push(oar);
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


    addRigger(rigger) {
        let val = rigger.getValues({
            reference: false
        });

        if (val.team == this.getTeam().getPathKey()) {
            this.getData().boatRiggers = this.getData().boatRiggers || {};
            this.getData().boatRiggers[this.getPathKey()] = this.getData().boatRiggers[this.getPathKey()] || {};

            if (!this.getData().boatRiggers[this.getPathKey()][rigger.getPathKey()]) {
                const value = {
                    side: val.side,
                    seat: val.seat
                };
                this.getData().boatRiggers[this.getPathKey()][rigger.getPathKey()] = value;
                this._riggers.push(rigger);
            }
        }

    }

    removeRigger(rigger) {

        this.getData().boatRiggers = this.getData().boatRiggers || {};
        this.getData().boatRiggers[this.getPathKey()] = this.getData().boatRiggers[this.getPathKey()] || {};

        if (this.getData().boatRiggers[this.getPathKey()][rigger.getPathKey()]) {
            this.getData().boatRiggers[this.getPathKey()][rigger.getPathKey()] = null;
            this._riggers = this.getRiggers().filter((element) => {
                return element != rigger;
            });
        }

    }

    getRiggers() {
        return this._riggers;
    }

}

module.exports = Boat;
'use strict';

import { faker } from '@faker-js/faker';
import Entity from '../entity/index.js';

export default class Regatta extends Entity {

    constructor(options) {
        options = options || {};

        options.plural = 'regattas';

        options.values = options.values || {};

        options.values.name = options.values.name || 'Head of the ' + faker.word.sample();
        options.values.city = options.values.city || faker.location.city();
        options.values.cost = options.values.cost || faker.number.int() / 1000;
        options.values.state = options.values.state || faker.location.state();
        options.values.locationImage = options.values.locationImage || faker.image.url();
        options.values.streetAddress = options.values.streetAddress || faker.location.streetAddress();
        options.values.head = options.values.head || 'yes';
        options.values.updated = options.values.updated || faker.number.int();
        options.values.created = options.values.created || faker.number.int();

        super(options);
        this._races = [];
        this._pictures = [];

        this.getGenerator().getAthletes().push(this);

    }

    addRaces(race) {
        let val = race.getValues({
            reference: false
        });

        if (val.team == this.getTeam().getPathKey()) {
            this.getData().regattaRaces = this.getData().regattaRaces || {};
            this.getData().regattaRaces[this.getPathKey()] = this.getData().regattaRaces[this.getPathKey()] || {};
            if (!this.getData().regattaRaces[this.getPathKey()][race.getPathKey()]) {
                const value = {
                    eventName: val.eventName,
                    raceTime: val.raceTime,
                };
                this.getData().regattaRaces[this.getPathKey()][race.getPathKey()] = value;
                this._races.push(race);
            }
        }


    }

    removeRace(race) {

        this.getData().regattaRaces = this.getData().regattaRaces || {};
        this.getData().regattaRaces[this.getPathKey()] = this.getData().regattaRaces[this.getPathKey()] || {};

        if (this.getData().regattaRaces[this.getPathKey()][race.getPathKey()]) {
            this.getData().regattaRaces[this.getPathKey()][race.getPathKey()] = null;
            this._races = this.getRegattas().filter((element) => {
                return element != race;
            });
        }

    }

    getRaces() {
        return this._races;
    }


    addPicture(picture) {
        let val = picture.getValues({
            reference: false
        });

        if (val.team == this.getTeam().getPathKey()) {
            this.getData().regattaPictures = this.getData().regattaPictures || {};
            this.getData().regattaPictures[this.getPathKey()] = this.getData().regattaPictures[this.getPathKey()] || {};

            if (!this.getData().regattaPictures[this.getPathKey()][picture.getPathKey()]) {
                this.getData().regattaPictures[this.getPathKey()][picture.getPathKey()] = true;
                this._pictures.push(picture);
            }
        }

    }

    removePicture(picture) {

        this.getData().regattaPictures = this.getData().regattaPictures || {};
        this.getData().regattaPictures[this.getPathKey()] = this.getData().regattaPictures[this.getPathKey()] || {};

        if (this.getData().regattaPictures[this.getPathKey()][picture.getPathKey()]) {
            this.getData().regattaPictures[this.getPathKey()][picture.getPathKey()] = null;
            this._pictures = this.getRegattas().filter((element) => {
                return element != picture;
            });
        }

    }

    getPictures() {
        return this._pictures;
    }
}
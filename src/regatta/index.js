'use strict';

//Loading in faker and Entity because they will be needed
const faker = require('faker');
const Entity = require('../entity');

class Regatta extends Entity {

    constructor(options) {
        //If options exists, set options equal to that, if not
        //Set it equalk to an empty object
        options = options || {};

        //Sets the plural to regattas
        options.plural = 'regattas';

        //If values exists, set options.values equal to that, if not
        //Set it equalk to an empty object
        options.values = options.values || {};

        //For each specific value, if it exists, set the options.values.Value to it
        //If not, set it to some random value or some default value
        options.values.name = options.values.name || 'Head of the ' + faker.random.word();
        options.values.city = options.values.city || faker.address.city();
        options.values.cost = options.values.cost || faker.random.number() / 1000;
        options.values.state = options.values.state || faker.address.state();
        options.values.locationImage = options.values.locationImage || faker.image.image();
        options.values.streetAddress = options.values.streetAddress || faker.address.streetAddress();

        super(options);
        this._races = [];
        this._pictures = [];

        this.getGenerator().getAthletes().push(this);

    }

    addRace(race) {

        this.getData().regattaRaces = this.getData().regattaRaces || {};
        this.getData().regattaRaces[this.getPathKey()] = this.getData().regattaRaces[this.getPathKey()] || {};

        if (!this.getData().regattaRaces[this.getPathKey()][race.getPathKey()]) {
            this.getData().regattaRaces[this.getPathKey()][race.getPathKey()] = true;
            this._races.push(race);
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
        return this._pictures;
    }


    addPicture(picture) {

        this.getData().regattaPictures = this.getData().regattaPictures || {};
        this.getData().regattaPictures[this.getPathKey()] = this.getData().regattaPictures[this.getPathKey()] || {};

        if (!this.getData().regattaPictures[this.getPathKey()][picture.getPathKey()]) {
            this.getData().regattaPictures[this.getPathKey()][picture.getPathKey()] = true;
            this._pictures.push(picture);
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

module.exports = Regatta;
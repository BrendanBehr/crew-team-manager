'use strict';

const faker = require('faker');
const Entity = require('../entity');
const Athlete = require('../athlete');
const Boat = require('../boat');
const Erg = require('../erg');
const Finance = require('../finance');
const Oar = require('../oar');
const Race = require('../race');
const Regatta = require('../regatta');
const User = require('../user');
const Picture = require('../picture');

class Team extends Entity {

    constructor(options) {

        options = options || {};
        options.plural = 'teams';

        options.values = options.values || {};
        options.values.teamName = options.values.teamName || faker.name.firstName();
        options.values.streetAddress = options.values.streetAddress || faker.address.streetAddress();
        options.values.city = options.values.city || faker.address.city();
        options.values.state = options.values.state || faker.address.state();
        options.values.color = options.values.color || faker.commerce.color();
        options.values.logo = options.values.logo || faker.image.image();

        super(options);

        this.getGenerator().getTeams().push(this);

    }

    createAthlete(values) {

        return new Athlete({
            generator: this.getGenerator(),
            team: this,
            values: values
        });

    }

    createAthletes(quantity) {

        quantity = quantity || 0;

        const athletes = [];
        while (quantity > 0) {
            athletes.push(this.createAthlete());
            quantity--;
        }

        return athletes;

    }

    getAthletes() {

        const team = this;
        return this.getGenerator().getAthletes().filter((athlete) => {
            return athlete.getTeam() == team;
        });

    }

    getAthlete() {
        return this._athlete;
    }

    createBoat(values) {

        return new Boat({
            generator: this.getGenerator(),
            team: this,
            values: values
        });

    }

    createBoats(quantity) {

        quantity = quantity || 0;

        const boats = [];
        while (quantity > 0) {
            boats.push(this.createBoat());
            quantity--;
        }

        return boats;

    }

    getBoats() {

        const team = this;
        return this.getGenerator().getBoat().filter((boat) => {
            return boat.getTeam() == team;
        });

    }

    getBoat() {
        return this._boat;
    }

    createErg(values) {

        return new Erg({
            generator: this.getGenerator(),
            team: this,
            values: values
        });

    }

    createErgs(quantity) {

        quantity = quantity || 0;

        const ergs = [];
        while (quantity > 0) {
            ergs.push(this.createErg());
            quantity--;
        }

        return ergs;

    }

    getErgs() {

        const team = this;
        return this.getGenerator().getErg().filter((erg) => {
            return erg.getTeam() == team;
        });

    }

    getErg() {
        return this._erg;
    }

    createFinance(values) {

        return new Finance({
            generator: this.getGenerator(),
            team: this,
            values: values
        });

    }

    createFinances(quantity) {

        quantity = quantity || 0;

        const finances = [];
        while (quantity > 0) {
            finances.push(this.createFinance());
            quantity--;
        }

        return finances;

    }

    getFinances() {

        const team = this;
        return this.getGenerator().getFinance().filter((finance) => {
            return finance.getTeam() == team;
        });

    }

    getFinance() {
        return this._finance;
    }

    createOar(values) {

        return new Oar({
            generator: this.getGenerator(),
            team: this,
            values: values
        });

    }

    createOars(quantity) {

        quantity = quantity || 0;

        const oars = [];
        while (quantity > 0) {
            oars.push(this.createOar());
            quantity--;
        }

        return oars;

    }

    getOars() {

        const team = this;
        return this.getGenerator().getOar().filter((oar) => {
            return oar.getTeam() == team;
        });

    }

    getOar() {
        return this._oar;
    }

    createRace(values) {

        return new Race({
            generator: this.getGenerator(),
            team: this,
            values: values
        });

    }

    createRaces(quantity) {

        quantity = quantity || 0;

        const races = [];
        while (quantity > 0) {
            races.push(this.createRace());
            quantity--;
        }

        return races;

    }

    getRaces() {

        const team = this;
        return this.getGenerator().getRace().filter((race) => {
            return race.getTeam() == team;
        });

    }

    getRace() {
        return this._race;
    }

    createRegatta(values) {

        return new Regatta({
            generator: this.getGenerator(),
            team: this,
            values: values
        });

    }

    createRegattas(quantity) {

        quantity = quantity || 0;

        const regattas = [];
        while (quantity > 0) {
            regattas.push(this.createRegatta());
            quantity--;
        }

        return regattas;

    }

    getRegattas() {

        const team = this;
        return this.getGenerator().getRegatta().filter((regatta) => {
            return regatta.getTeam() == team;
        });

    }

    getRegatta() {
        return this._regatta;
    }

    createUser(values) {

        return new User({
            generator: this.getGenerator(),
            team: this,
            values: values
        });

    }

    createUsers(quantity) {

        quantity = quantity || 0;

        const users = [];
        while (quantity > 0) {
            users.push(this.createUser());
            quantity--;
        }

        return users;

    }

    getUsers() {

        const team = this;
        return this.getGenerator().getUser().filter((user) => {
            return user.getTeam() == team;
        });

    }

    getUser() {
        return this._user;
    }

    createPicture(values) {

        return new Picture({
            generator: this.getGenerator(),
            team: this,
            values: values
        });

    }

    createPictures(quantity) {

        quantity = quantity || 0;

        const pictures = [];
        while (quantity > 0) {
            pictures.push(this.createPicture());
            quantity--;
        }

        return pictures;

    }

    getPictures() {

        const team = this;
        return this.getGenerator().getPicture().filter((picture) => {
            return picture.getTeam() == team;
        });

    }

    getPicture() {
        return this._picture;
    }
}

module.exports = Team;
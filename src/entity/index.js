'use strict';

const pluralize = require('pluralize');

class Entity {

    constructor(options) {

        this._options = options || {};

        this._generator = this.getOptions().generator;
        this._plural = this.getOptions().plural;
        this._singular = this.getOptions().singular || pluralize.singular(this.getPlural());

        this._pathRoot = this.getPlural();
        this._pathKey = this.getGenerator().getDatabase().ref(this.getPathRoot()).push().key;
        this._path = this.getPathRoot() + '/' + this.getPathKey();

        const values = options.values || {};

        if (this.getOptions().team) {
            this._team = this.getOptions().team;
            values[this.getTeam().getSingular()] = this.getTeam().getPathKey();
        }

        this.setValues(values);

    }

    getStatus() {
        return this._status;
    }

    getPathRoot() {
        return this._pathRoot;
    }

    getPathKey() {
        return this._pathKey;
    }

    getPath() {
        return this._path;
    }

    getPlural() {
        return this._plural;
    }

    getSingular() {
        return this._singular;
    }

    getData() {
        return this.getGenerator().getData();
    }

    getOptions() {
        return this._options;
    }

    getGenerator() {
        return this._generator;
    }

    getValues() {
        return this._values;
    }

    getTeam() {
        return this._team;
    }

    setValues(values) {

        this._values = values;

        this.getData()[this.getPathRoot()] = this.getData()[this.getPathRoot()] || {};
        this.getData()[this.getPathRoot()][this.getPathKey()] = this.getValues();

        return this;
    }

    updateValues(values) {

        const valueKeys = Object.keys(values);
        valueKeys.forEach((valueKey) => {
            this._values[valueKey] = values[valueKey];
        });

        return this;

    }
}

module.exports = Entity;
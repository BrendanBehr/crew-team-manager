'use strict';

import * as Pluralize from '@capaj/pluralize';
import { getDatabase, ref, set } from "firebase/database";
const pluralize = Pluralize.pluralize;

export default class Entity {

    constructor(options) {

        this._options = options || {};

        this._generator = this.getOptions().generator;
        this._plural = this.getOptions().plural;
        this._singular = this.getOptions().singular || pluralize.singular(this.getPlural());

        this._pathRoot = this.getPlural();
        this._pathKey = ref(getDatabase(), this.getPathRoot()).key;
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
        if (this._pathRoot == "" || this._pathRoot == null) {
            this._pathRoot = this.getPlural();
        }
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

    getValues(options) {

        options = options || {};
        options.reference = typeof options.reference == 'undefined' ? true : options.reference;

        let values = this._values;

        if (!options.reference) {
            values = JSON.parse(JSON.stringify(values));
        }

        return values;

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

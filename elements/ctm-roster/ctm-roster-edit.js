import {LitElement, html, css } from 'lit';
import { Timestamp  } from "firebase/firestore";

import '@polymer/app-layout/app-layout';
import '@polymer/app-layout/app-drawer/app-drawer';
import '@polymer/app-layout/app-header/app-header';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import '@polymer/app-layout/app-header-layout/app-header-layout';

import '@polymer/paper-input/paper-input';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu';
import '@polymer/paper-item/paper-item';
import '@polymer/paper-listbox/paper-listbox';
import '@polymer/paper-toggle-button/paper-toggle-button';
import Athlete from '../../src/athlete'

export class CtmRosterEdit extends LitElement {
    static styles = css`
        :host {
            background-color: lightslategray;
            @apply(--layout-horizontal);
            @apply(--paper-font-common-base);
        }

        #layout {
            @apply(--layout-flex);
        }

        #toolbar {
            background-color: #43a047;
            color: #fff;
        }

        #editor {
            background-color: white;
            @apply(--layout-flex);
        }

        paper-input {
            padding: 0px 16px
        }

        paper-dropdown-menu {
            padding: 0px 16px
        }

        #toggle-button {
            --paper-toggle-button-checked-bar-color: var(--paper-green-500);
            --paper-toggle-button-checked-button-color: var(--paper-green-500);
            --paper-toggle-button-checked-ink-color: var(--paper-green-500);
            --paper-toggle-button-unchecked-bar-color: var(--paper-teal-500);
            --paper-toggle-button-unchecked-button-color: var(--paper-teal-500);
            --paper-toggle-button-unchecked-ink-color: var(--paper-teal-500);
        }
    `;
        
    constructor() {
        super();

        this.edit = {
            firstName : 'Sample',
            lastName : 'Name',
            year : 'Fresh',
            streetAddress : '123 Name Rd',
            city : 'City',
            state : 'State',
            phone : '1234567890',
            height : '5\'10',
            weight : '160',
            gender : 'M',
            ergScore : '6:30',
            side : 'Scull',
            fundRaising : '$0'
        };
    }

    render() {
        return html`
            <app-header-layout id="layout">
                <app-header reveals>
                    <app-toolbar id="toolbar">
                        <paper-icon-button id="back" icon="arrow-back" @click="${this._handleActionBack}"></paper-icon-button>
                        <div main-title id="title">Edit</div>
                        <paper-icon-button id="save" icon="check" @click="${this._handleActionSave}"></paper-icon-button>
                    </app-toolbar>
                </app-header>

                <div id="editor">
                    <form is="iron-form" id="form" method="post" action="/form/handler">
                        <paper-input id="first-name" label="first name" value="${this.edit.firstName}"></paper-input>
                        <paper-input id="last-name" label="last name" value="${this.edit.lastName}"></paper-input>
                        <paper-dropdown-menu label="Year" value="${this.edit.year}">
                            <paper-listbox slot="dropdown-content" id="year">
                                <paper-item>Freshman</paper-item>
                                <paper-item>Sophomore</paper-item>
                                <paper-item>Junior</paper-item>
                                <paper-item>Senior</paper-item>
                            </paper-listbox>
                        </paper-dropdown-menu>
                        <paper-input id="street-address" label="street address" value="${this.edit.streetAddress}"></paper-input>
                        <paper-input id="city" label="city" value="${this.edit.city}"></paper-input>
                        <paper-input id="state" label="state" value="${this.edit.state}"></paper-input>
                        <paper-input id="phone" label="phone number" value="${this.edit.phone}"></paper-input>
                        <paper-dropdown-menu label="Can drive" value="${this.edit.driver}">
                            <paper-listbox slot="dropdown-content" id="driver">
                                <paper-item>Yes</paper-item>
                                <paper-item>No</paper-item>
                            </paper-listbox>
                        </paper-dropdown-menu>
                        <paper-input id="height" label="height" value="${this.edit.height}"></paper-input>
                        <paper-input id="weight" label="weight" value="${this.edit.weight}"></paper-input>
                        <paper-dropdown-menu label="Gender" value="${this.edit.gender}">
                            <paper-listbox slot="dropdown-content" id="gender">
                                <paper-item>Male</paper-item>
                                <paper-item>Female</paper-item>
                                <paper-item>Other</paper-item>
                            </paper-listbox>
                        </paper-dropdown-menu>
                        <paper-input id="erg-score" label="2k time" value="${this.edit.ergScore}"></paper-input>
                        <paper-dropdown-menu label="Side" value="${this.edit.side}">
                            <paper-listbox slot="dropdown-content" id="side">
                                <paper-item>Port</paper-item>
                                <paper-item>Starboard</paper-item>
                                <paper-item>Scull</paper-item>
                            </paper-listbox>
                        </paper-dropdown-menu>
                        <paper-input id="fundraising" label="fundraising" value="${this.edit.fundRaising}"></paper-input>
                    </form>
                </div>
            </app-header-layout>`;
    }

    static properties() {
        return {
            edit: {
                type: Object
            },

            athlete: {
                type: String
            },

            _drive: {
                type: Boolean,
                value: false
            }
        }
    }

    _handleActionBack(e) {
        this.dispatchEvent(new CustomEvent('ctm-roster-edit-action-back', {
            bubbles: true,
            composed: true
        }));
    }

    _handleActionSave(e) {
        this.edit.updated = Timestamp.now();
        this.edit.fundRaising = parseInt(this.edit.fundRaising);
        this.edit.weight = parseInt(this.edit.weight);
        this.$.firebase.data = JSON.parse(JSON.stringify(this.edit));
        this.$.firebase.saveValue('athletes', this.athlete)
            .then(() => {
                this.dispatchEvent(new CustomEvent('ctm-roster-edit-action-saved', {
                    bubbles: true,
                    composed: true
                }));
            });
    }
}

customElements.define('ctm-roster-edit', CtmRosterEdit);
import {LitElement, html, css } from 'lit';
import { Timestamp  } from "firebase/firestore";
import { getDatabase, ref, set, push, child } from "firebase/database";

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

export class CtmRosterCreate extends LitElement {
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

        #creator {
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

        this.create = {
            city: '',
            driver: '',
            ergScore: '',
            firstName: '',
            fundRaising: 0,
            gender: '',
            height: '',
            lastName: '',
            phone: '',
            side: '',
            state: '',
            streetAddress: '',
            weight: 0,
            year: '',
            email: '',
            credential: 'NA',
            updated: 0,
            created: 0
        };
    }

    render() {
        return html`
        <app-header-layout id="layout">

            <app-header reveals>
                <app-toolbar id="toolbar">
                    <paper-icon-button id="cancel" icon="close" @click="${this._handleActionCancel}"></paper-icon-button>
                    <div main-title id="title">Create</div>
                    <paper-icon-button id="create" icon="check" @click="${this._handleActionCreated}"></paper-icon-button>
                </app-toolbar>
            </app-header>

            <div id="creator">
                <form is="iron-form" id="form" method="post" action="/form/handler">
                    <paper-input id="first-name" label="first name" value="${this.create.firstName}"></paper-input>
                    <paper-input id="last-name" label="last name" value="${this.create.lastName}"></paper-input>
                    <paper-dropdown-menu label="Year" value="${this.create.year}">
                        <paper-listbox slot="dropdown-content" id="year">
                            <paper-item>Freshman</paper-item>
                            <paper-item>Sophomore</paper-item>
                            <paper-item>Junior</paper-item>
                            <paper-item>Senior</paper-item>
                        </paper-listbox>
                    </paper-dropdown-menu>
                    <paper-input id="street-address" label="street address" value="${this.create.streetAddress}"></paper-input>
                    <paper-input id="city" label="city" value="${this.create.city}"></paper-input>
                    <paper-input id="state" label="state" value="${this.create.state}"></paper-input>
                    <paper-input id="phone" label="phone number" value="${this.create.phone}"></paper-input>
                    <paper-input id="email" label="email" value="${this.create.email}"></paper-input>
                    <paper-dropdown-menu label="Can drive" value="${this.create.driver}">
                        <paper-listbox slot="dropdown-content" id="driver">
                            <paper-item>Yes</paper-item>
                            <paper-item>No</paper-item>
                        </paper-listbox>
                    </paper-dropdown-menu>
                    <paper-input id="height" label="height" value="${this.create.height}"></paper-input>
                    <paper-input id="weight" label="weight" value="${this.create.weight}"></paper-input>
                    <paper-dropdown-menu label="Gender" value="${this.create.gender}">
                        <paper-listbox slot="dropdown-content" id="gender">
                            <paper-item>Male</paper-item>
                            <paper-item>Female</paper-item>
                            <paper-item>Other</paper-item>
                        </paper-listbox>
                    </paper-dropdown-menu>
                    <paper-input id="erg-score" label="2k time" value="${this.create.ergScore}"></paper-input>
                    <paper-dropdown-menu label="Side" value="${this.create.side}">
                        <paper-listbox slot="dropdown-content" id="side">
                            <paper-item>Port</paper-item>
                            <paper-item>Starboard</paper-item>
                            <paper-item>Scull</paper-item>
                        </paper-listbox>
                    </paper-dropdown-menu>
                    <paper-input id="fundraising" label="fundraising" value="${this.create.fundRaising}"></paper-input>
                </form>
            </div>

        </app-header-layout>`;
    }

    static properties() {
        return {
            create: {
                type: Object
            },

            teamId: String,

            selected: {
                type: Boolean,
                observer: '_selectedChanged'
            },
            _drive: {
                type: Boolean,
                value: false
            }
        }
    }

    _resetCreate() {
        this.create = {
            city: '',
            driver: '',
            ergScore: '',
            firstName: '',
            fundRaising: 0,
            gender: '',
            height: '',
            lastName: '',
            phone: '',
            side: '',
            state: '',
            streetAddress: '',
            weight: 0,
            year: '',
            email: '',
            credential: 'NA',
            updated: 0,
            created: 0
        }
    }

    _handleActionCancel() {
        this._resetCreate();
        this.dispatchEvent(new CustomEvent('ctm-roster-create-action-cancel', {
            bubbles: true,
            composed: true
        }));
    }

    _handleActionCreated(e) {

        this.create.updated = Timestamp.now();
        this.create.created = Timestamp.now();
        this.create.team = this.teamId;
        this.create.fundRaising = parseInt(this.create.fundRaising);
        this.create.weight = parseInt(this.create.weight);

        if (!this.create.email) {
            this.create.email = 'NA';
        }


        let firebase = getDatabase();
        let athleteRef = push(child(ref(firebase, 'athletes')), this.create);
        this.dispatchEvent(new CustomEvent('ctm-roster-create-action-created', {
                detail: {
                    athlete: athleteRef.key
                },
                bubbles: true,
                composed: true
            }));
    }

    _selectedChanged(newValue) {
        if (!newValue) {
            this.create = {};
        }
    }
}

customElements.define('ctm-roster-create', CtmRosterCreate);
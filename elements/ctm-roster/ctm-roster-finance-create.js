import {LitElement, html} from 'lit';

import '@polymer/app-layout/app-layout.html">
import '@polymer/app-layout/app-drawer/app-drawer.html">
import '@polymer/app-layout/app-header/app-header.html">
import '@polymer/app-layout/app-toolbar/app-toolbar.html">
import '@polymer/app-layout/app-header-layout/app-header-layout.html">

import '@polymer/paper-input/paper-input.html">
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.html">
import '@polymer/paper-item/paper-item.html">
import '@polymer/paper-listbox/paper-listbox.html">
import '@polymer/paper-toggle-button/paper-toggle-button.html">

import '@polymer/polymerfire/polymerfire.html">

<dom-module id="ctm-roster-finance-create">
    <template>
        <style>
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
        </style>


        <firebase-document id="firebase" app-name="laborsync-ctm">
        </firebase-document>

        <app-header-layout id="layout">

            <app-header reveals>
                <app-toolbar id="toolbar">
                    <paper-icon-button id="cancel" icon="close" on-tap="_handleActionCancel"></paper-icon-button>
                    <div main-title id="title">Create</div>
                    <paper-icon-button id="create" icon="check" on-tap="_handleActionCreate"></paper-icon-button>
                </app-toolbar>
            </app-header>

            <div id="creator">
                <form is="iron-form" id="form" method="post" action="/form/handler">
                    <paper-input id="reason" label="reason" value="{{create.reason}}"></paper-input>
                    <paper-input id="incomes" label="incomes" value="{{create.incomes}}"></paper-input>
                    <paper-input id="expenses" label="expenses" value="{{create.expenses}}"></paper-input>
                </form>
            </div>

        </app-header-layout>

    </template>

    <script>
        // Extend Polymer.Element with MyMixin
        class CTMRosterFinanceCreate extends Polymer.Element {

            static get is() {
                return 'ctm-roster-finance-create'
            }

            static get properties() {
                return {
                    create: {
                        type: Object,
                        value: {
                            reason: '',
                            incomes: null,
                            expenses: null,
                            gross: 0,
                            created: 0,
                            updated: 0
                        },

                        athlete: String
                    },

                    teamId: String,

                    finance: {
                        type: String
                    },

                    _drive: {
                        type: Boolean,
                        value: false
                    }
                }
            }

            _resetCreate() {
                this.create = {
                    reason: '',
                    incomes: null,
                    expenses: null,
                    gross: 0,
                    updated: 0,
                    created: 0
                }
            }

            _handleActionCancel(e) {
                this.dispatchEvent(new CustomEvent(CTMRosterFinanceCreate.is + '-action-cancel', {
                    bubbles: true,
                    composed: true
                }));
                this._resetCreate();
            }

            _handleActionCreate(e) {
                this.create.updated = this.$.firebase.app.firebase_.database.ServerValue.TIMESTAMP;
                this.create.created = this.$.firebase.app.firebase_.database.ServerValue.TIMESTAMP;
                this.create.team = this.teamId;
                this.create.incomes = parseInt(this.create.incomes);
                this.create.expenses = parseInt(this.create.expenses);
                this.create.gross = this.create.incomes - this.create.expenses;
                this.$.firebase.saveValue('finances')
                    .then(() => {
                        const gross = this.create.gross
                        this.$.firebase.setStoredValue(this.$.firebase.path, this.create);
                        this._resetCreate();
                        let _key = '';
                        for (let x = 10; x < this.$.firebase.path.length; x++) {
                            _key = _key + this.$.firebase.path[x];
                        }
                        const path = 'athleteFinances/' + this.athlete + '/' + _key;
                        this.$.firebase.setStoredValue(path, true)
                            .then(() => {
                                this.dispatchEvent(new CustomEvent(CTMRosterFinanceCreate.is +
                                    '-action-created', {
                                        detail: {
                                            finance: gross
                                        },
                                        bubbles: true,
                                        composed: true
                                    }));
                            })
                            .catch(() => {

                                this.dispatchEvent(new CustomEvent(CTMRosterFinanceCreate.is +
                                    '-action-fanout-fail', {
                                        bubbles: true,
                                        composed: true
                                    }));
                            });

                    });


            }

        }

        // Register custom element definition using standard platform API
        customElements.define(CTMRosterFinanceCreate.is, CTMRosterFinanceCreate);
    </script>
</dom-module>
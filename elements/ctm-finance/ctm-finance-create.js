import {LitElement, html} from 'lit';

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



export class CtmFinanceCreate extends LitElement {
    static styles = `
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
    }

    render() {
        return html`

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

        </app-header-layout>`;
    }

    static get properties() {
        return {
            create: {
                type: Object,
                value: {
                    reason: '',
                    incomes: 0,
                    expenses: 0,
                    gross: 0,
                    created: 0,
                    updated: 0
                }
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
            incomes: 0,
            expenses: 0,
            gross: 0,
            updated: 0,
            created: 0
        }
    }

    _handleActionCancel(e) {
        this.dispatchEvent(new CustomEvent(CTMFinanceCreate.is + '-action-cancel', {
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
                this.$.firebase.setStoredValue(this.$.firebase.path, this.create);
                this._resetCreate();
                let _key = '';
                for (let x = 10; x < this.$.firebase.path.length; x++) {
                    _key = _key + this.$.firebase.path[x];
                }
                this.dispatchEvent(new CustomEvent(CTMFinanceCreate.is +
                    '-action-created', {
                        detail: {
                            finance: _key
                        },
                        bubbles: true,
                        composed: true
                    }));
            });


    }

}

customElements.define('ctm-finance-create', CtmFinanceCreate);
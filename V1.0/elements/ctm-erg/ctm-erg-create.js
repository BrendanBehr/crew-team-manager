import { LitElement, html, css } from 'lit';
import { Timestamp } from "firebase/firestore";
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



export class CtmErgCreate extends LitElement {
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
            number: 0,
            location: '',
            model: '',
            screenType: '',
            condition: '',
            created: 0,
            updated: 0
        };
    }

    render() {
        return html`
            <app-header-layout id="layout">

                <app-header reveals>
                    <app-toolbar id="toolbar">
                        <paper-icon-button id="cancel" icon="close" @click="${this._handleActionCancel}"></paper-icon-button>
                        <div main-title id="title">Create</div>
                        <paper-icon-button id="create" icon="check" @click="${this._handleActionCreate}"></paper-icon-button>
                    </app-toolbar>
                </app-header>

                <div id="creator">
                    <form is="iron-form" id="form" method="post" action="/form/handler">
                        <paper-input id="number" label="number" value="${this.create.number}"></paper-input>
                        <paper-dropdown-menu label="location" value="${this.create.location}">
                            <paper-listbox slot="dropdown-content" id="location">
                                <paper-item>Home</paper-item>
                                <paper-item>Away</paper-item>
                            </paper-listbox>
                        </paper-dropdown-menu>
                        <paper-dropdown-menu label="model" value="${this.create.model}">
                            <paper-listbox slot="dropdown-content" id="model">
                                <paper-item>Model C</paper-item>
                                <paper-item>Model D</paper-item>
                                <paper-item>More E</paper-item>
                            </paper-listbox>
                        </paper-dropdown-menu>
                        <paper-dropdown-menu label="screen-type" value="${this.create.screenType}">
                            <paper-listbox slot="dropdown-content" id="screen-type">
                                <paper-item>PM5</paper-item>
                                <paper-item>PM4</paper-item>
                                <paper-item>PM3</paper-item>
                                <paper-item>PM2</paper-item>
                                <paper-item>PM1</paper-item>
                            </paper-listbox>
                        </paper-dropdown-menu>
                        <paper-dropdown-menu label="condition" value="${this.create.condition}">
                            <paper-listbox slot="dropdown-content" id="condition">
                                <paper-item>Very Bad</paper-item>
                                <paper-item>Bad</paper-item>
                                <paper-item>Below Average</paper-item>
                                <paper-item>Average</paper-item>
                                <paper-item>Above Average</paper-item>
                                <paper-item>Good</paper-item>
                                <paper-item>Very Good</paper-item>
                            </paper-listbox>
                        </paper-dropdown-menu>
                    </form>
                </div>

            </app-header-layout>
    `;
    }

    static properties() {
        return {
            create: {
                type: Object
            },

            teamId: String,

            erg: {
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
            number: 0,
            location: '',
            model: '',
            screenType: '',
            condition: '',
            updated: 0,
            created: 0
        }
    }

    _handleActionCancel(e) {
        this.dispatchEvent(new CustomEvent('ctm-erg-create-action-cancel', {
            bubbles: true,
            composed: true
        }));
        this._resetCreate();
    }

    _handleActionCreate(e) {
        this.create.updated = Timestamp.now();
        this.create.created = Timestamp.now();
        this.create.team = this.teamId;
        this.create.number = parseInt(this.create.number);

        let firebase = getDatabase();
        let ergRef = push(child(ref(firebase, 'ergs')), this.create);

        this.dispatchEvent(new CustomEvent('ctm-erg-create-action-created', {
            detail: {
                erg: ergRef.key
            },
            bubbles: true,
            composed: true
        }));
        
        /*
        this.$.firebase.saveValue('ergs')
            .then(() => {
                this.$.firebase.setStoredValue(this.$.firebase.path, this.create);
                this._resetCreate();
                let _key = '';
                for (let x = 6; x < this.$.firebase.path.length; x++) {
                    _key = _key + this.$.firebase.path[x];
                }
                this.dispatchEvent(new CustomEvent('ctm-erg-create-action-created', {
                        detail: {
                            erg: _key
                        },
                        bubbles: true,
                        composed: true
                    }));
            });
        */
    }

}

customElements.define('ctm-erg-create', CtmErgCreate);
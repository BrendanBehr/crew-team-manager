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



export class CtmRiggerCreate extends LitElement {
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
            side: '',
            style: '',
            type: '',
            seat: 0,
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
                    <paper-dropdown-menu label="side" value="${this.create.side}">
                        <paper-listbox slot="dropdown-content" id="side">
                            <paper-item>Port</paper-item>
                            <paper-item>Starboard</paper-item>
                            <paper-item>Both</paper-item>
                        </paper-listbox>
                    </paper-dropdown-menu>
                    <paper-dropdown-menu label="style" value="${this.create.style}">
                        <paper-listbox slot="dropdown-content" id="style">
                            <paper-item>Sweep</paper-item>
                            <paper-item>Scull</paper-item>
                        </paper-listbox>
                    </paper-dropdown-menu>
                    <paper-dropdown-menu label="type" value="${this.create.type}">
                        <paper-listbox slot="dropdown-content" id="type">
                            <paper-item>Wing</paper-item>
                            <paper-item>European</paper-item>
                        </paper-listbox>
                    </paper-dropdown-menu>
                    <paper-dropdown-menu label="seat" value="${this.create.seat}">
                        <paper-listbox slot="dropdown-content" id="seat">
                            <paper-item>1</paper-item>
                            <paper-item>2</paper-item>
                            <paper-item>3</paper-item>
                            <paper-item>4</paper-item>
                            <paper-item>5</paper-item>
                            <paper-item>6</paper-item>
                            <paper-item>7</paper-item>
                            <paper-item>8</paper-item>
                        </paper-listbox>
                    </paper-dropdown-menu>
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

            rigger: {
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
            side: '',
            style: '',
            type: '',
            seat: 0,
            updated: 0,
            created: 0
        }
    }

    _handleActionCancel(e) {
        this.dispatchEvent(new CustomEvent('ctm-rigger-create-action-cancel', {
            bubbles: true,
            composed: true
        }));
        this._resetCreate();
    }

    _handleActionCreate(e) {
        this.create.updated = Timestamp.now();
        this.create.created = Timestamp.now();
        this.create.team = this.teamId;
        this.create.seat = parseInt(this.create.seat);
        this.$.firebase.saveValue('riggers')
            .then(() => {
                this.$.firebase.setStoredValue(this.$.firebase.path, this.create);
                this._resetCreate();
                let _key = '';
                for (let x = 9; x < this.$.firebase.path.length; x++) {
                    _key = _key + this.$.firebase.path[x];
                }
                this.dispatchEvent(new CustomEvent('ctm-rigger-create-action-created', {
                        detail: {
                            rigger: _key
                        },
                        bubbles: true,
                        composed: true
                    }));
            });
    }
}

customElements.define('ctm-rigger-create', CtmRiggerCreate);
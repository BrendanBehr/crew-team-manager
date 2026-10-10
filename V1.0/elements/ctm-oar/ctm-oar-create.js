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



export class CtmOarCreate extends LitElement {
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

        this._resetCreate();
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
                    <paper-input id="name" label="name" value="${this.create.name}"></paper-input>
                    <paper-input id="color" label="color" value="${this.create.color}"></paper-input>
                    <paper-dropdown-menu label="shape" value="${this.create.shape}">
                        <paper-listbox slot="dropdown-content" id="shape">
                            <paper-item>Fat2</paper-item>
                            <paper-item>Smoothie2 Vortex Edge</paper-item>
                            <paper-item>Smoothie2 Plain Edge</paper-item>
                            <paper-item>Big Blade</paper-item>
                            <paper-item>Apex Blade</paper-item>
                        </paper-listbox>
                    </paper-dropdown-menu>
                    <paper-dropdown-menu label="handle-grip" value="${this.create.handleGrip}">
                        <paper-listbox slot="dropdown-content" id="handle-grip">
                            <paper-item>Rubber</paper-item>
                            <paper-item>Wood</paper-item>
                            <paper-item>Foam</paper-item>
                        </paper-listbox>
                    </paper-dropdown-menu>
                    <paper-input id="length" label="length" value="${this.create.length}"></paper-input>
                </form>
            </div>

        </app-header-layout>`;
    }

    static properties() {
        return {
            create: {
                type: Object
            },

            oar: {
                type: String
            },

            _drive: {
                type: Boolean,
                value: false
            },

            teamId: String
        }
    }

    _resetCreate() {
        this.create = {
            name: '',
            color: '',
            shape: '',
            handleGrip: '',
            length: '',
            team: '',
            updated: 0,
            created: 0
        }
    }

    _handleActionCancel(e) {
        this.dispatchEvent(new CustomEvent('ctm-oar-create-action-cancel', {
            bubbles: true,
            composed: true
        }));
        this._resetCreate();
    }

    _handleActionCreate(e) {
        this.create.updated = Timestamp.now();
        this.create.created = Timestamp.now();
        this.create.team = this.teamId;
        this.create.length = parseInt(this.create.length);
        this.$.firebase.saveValue('oars')
            .then(() => {
                this.$.firebase.setStoredValue(this.$.firebase.path, this.create);
                this._resetCreate();
                let _key = '';
                for (let x = 6; x < this.$.firebase.path.length; x++) {
                    _key = _key + this.$.firebase.path[x];
                }
                this.dispatchEvent(new CustomEvent('ctm-oar-create-action-created', {
                        bubbles: true,
                        composed: true,
                        detail: {
                            oar: _key
                        }
                    }));
            });


    }

}

customElements.define('ctm-oar-create', CtmOarCreate);
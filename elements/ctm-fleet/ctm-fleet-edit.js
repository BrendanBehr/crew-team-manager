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



export class CtmFleetEdit extends LitElement {
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
            name: '',
            size: 0,
            rigging: '',
            type: '',
            manufacturer: '',
            updated: 0,
            created: 0
        }
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
                    <paper-input id="name" label="name" value="${this.edit.name}"></paper-input>
                    <paper-dropdown-menu label="size" value="${this.edit.size}">
                        <paper-listbox slot="dropdown-content" id="size">
                            <paper-item>1</paper-item>
                            <paper-item>2</paper-item>
                            <paper-item>4</paper-item>
                            <paper-item>8</paper-item>
                        </paper-listbox>
                    </paper-dropdown-menu>
                    <paper-dropdown-menu label="rigging" value="${this.edit.rigging}">
                        <paper-listbox slot="dropdown-content" id="rigging">
                            <paper-item>Port</paper-item>
                            <paper-item>Starboard</paper-item>
                            <paper-item>Scull</paper-item>
                        </paper-listbox>
                    </paper-dropdown-menu>
                    <paper-dropdown-menu label="type" value="${this.edit.type}">
                        <paper-listbox slot="dropdown-content" id="type">
                            <paper-item>Sweep</paper-item>
                            <paper-item>Sculling</paper-item>
                        </paper-listbox>
                    </paper-dropdown-menu>
                    <paper-input id="manufacturer" label="manufacturer" value="${this.edit.manufacturer}"></paper-input>
                </form>
            </div>

        </app-header-layout>`;
    }

    static properties() {
        return {
            edit: {
                type: Object
            },

            boat: {
                type: String
            },

            _drive: {
                type: Boolean,
                value: false
            }
        }
    }

    _handleActionBack(e) {
        this.dispatchEvent(new CustomEvent('ctm-fleet-edit-action-back', {
            bubbles: true,
            composed: true
        }));
    }

    _handleActionSave(e) {
        this.edit.updated = Timestamp.now();
        this.edit.size = parseInt(this.edit.size);
        this.$.firebase.data = JSON.parse(JSON.stringify(this.edit));
        this.$.firebase.saveValue('boats', this.boat)
            .then(() => {
                this.dispatchEvent(new CustomEvent('ctm-fleet-edit-action-saved', {
                    bubbles: true,
                    composed: true
                }));
            });
    }
}

customElements.define('ctm-fleet-edit', CtmFleetEdit);
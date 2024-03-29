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



export class CtmOarEdit extends LitElement {
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
            color: '',
            shape: '',
            handleGrip: '',
            length: '',
            team: '',
            updated: 0,
            created: 0
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
                    <paper-input id="name" label="name" value="${this.edit.name}"></paper-input>
                    <paper-input id="color" label="color" value="${this.edit.color}"></paper-input>
                    <paper-dropdown-menu label="shape" value="${this.edit.shape}">
                        <paper-listbox slot="dropdown-content" id="shape">
                            <paper-item>Fat2</paper-item>
                            <paper-item>Smoothie2 Vortex Edge</paper-item>
                            <paper-item>Smoothie2 Plain Edge</paper-item>
                            <paper-item>Big Blade</paper-item>
                            <paper-item>Apex Blade</paper-item>
                        </paper-listbox>
                    </paper-dropdown-menu>
                    <paper-dropdown-menu label="handle-grip" value="${this.edit.handleGrip}">
                        <paper-listbox slot="dropdown-content" id="handle-grip">
                            <paper-item>Rubber</paper-item>
                            <paper-item>Wood</paper-item>
                            <paper-item>Foam</paper-item>
                        </paper-listbox>
                    </paper-dropdown-menu>
                    <paper-input id="length" label="length" value="${this.edit.length}" type="number"></paper-input>
                </form>
            </div>

        </app-header-layout>`;
    }

    static properties() {
        return {
            edit: {
                type: Object
            },

            oar: {
                type: String
            },

            _drive: {
                type: Boolean,
                value: false
            }
        }
    }

    _handleActionBack(e) {
        this.dispatchEvent(new CustomEvent('ctm-oar-edit-action-back', {
            bubbles: true,
            composed: true
        }));
    }

    _handleActionSave(e) {
        this.edit.updated = Timestamp.now();
        this.edit.length = parseInt(this.edit.length);
        this.$.firebase.data = JSON.parse(JSON.stringify(this.edit));
        this.$.firebase.saveValue('oars', this.oar)
            .then(() => {
                this.dispatchEvent(new CustomEvent('ctm-oar-edit-action-saved', {
                    bubbles: true,
                    composed: true
                }));
            });


    }

}

customElements.define('ctm-oar-edit', CtmOarEdit);
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



export class CtmFleetCreate extends LitElement {
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
                    <paper-input id="name" label="name" value="{{create.name}}"></paper-input>
                    <paper-dropdown-menu label="size" value="{{create.size}}">
                        <paper-listbox slot="dropdown-content" id="size">
                            <paper-item>1</paper-item>
                            <paper-item>2</paper-item>
                            <paper-item>4</paper-item>
                            <paper-item>8</paper-item>
                        </paper-listbox>
                    </paper-dropdown-menu>
                    <paper-dropdown-menu label="rigging" value="{{create.rigging}}">
                        <paper-listbox slot="dropdown-content" id="rigging">
                            <paper-item>Port</paper-item>
                            <paper-item>Starboard</paper-item>
                            <paper-item>Scull</paper-item>
                        </paper-listbox>
                    </paper-dropdown-menu>
                    <paper-dropdown-menu label="type" value="{{create.type}}">
                        <paper-listbox slot="dropdown-content" id="type">
                            <paper-item>Sweep</paper-item>
                            <paper-item>Sculling</paper-item>
                        </paper-listbox>
                    </paper-dropdown-menu>
                    <paper-input id="manufacturer" label="manufacturer" value="{{create.manufacturer}}"></paper-input>
                </form>
            </div>

        </app-header-layout>`;
    }

    static get properties() {
        return {
            create: {
                type: Object,
                value: {
                    name: '',
                    size: 0,
                    rigging: '',
                    type: '',
                    manufacturer: '',
                    created: 0,
                    updated: 0
                }
            },

            teamId: String,

            boat: {
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
            name: '',
            size: 0,
            rigging: '',
            type: '',
            manufacturer: '',
            updated: 0,
            created: 0
        }
    }

    _handleActionCancel(e) {
        this._resetCreate();
        this.dispatchEvent(new CustomEvent('ctm-fleet-create-action-cancel', {
            bubbles: true,
            composed: true
        }));
    }

    _handleActionCreate(e) {
        this.create.updated = this.$.firebase.app.firebase_.database.ServerValue.TIMESTAMP;
        this.create.created = this.$.firebase.app.firebase_.database.ServerValue.TIMESTAMP;
        this.create.team = this.teamId;
        this.create.size = parseInt(this.create.size);
        this.$.firebase.saveValue('boats')
            .then(() => {
                this.$.firebase.setStoredValue(this.$.firebase.path, this.create);
                this._resetCreate();
                let _key = '';
                for (let x = 7; x < this.$.firebase.path.length; x++) {
                    _key = _key + this.$.firebase.path[x];
                }
                this.dispatchEvent(new CustomEvent('ctm-fleet-create-action-created', {
                        detail: {
                            boat: _key
                        },
                        bubbles: true,
                        composed: true
                    }));
            });


    }

}

customElements.define('ctm-fleet-create', CtmFleetCreate);
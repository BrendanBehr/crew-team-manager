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



export class CtmRiggerEdit extends LitElement {
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
    }

    render() {
        return html`
        <app-header-layout id="layout">

            <app-header reveals>
                <app-toolbar id="toolbar">
                    <paper-icon-button id="back" icon="arrow-back" on-tap="_handleActionBack"></paper-icon-button>
                    <div main-title id="title">Edit</div>
                    <paper-icon-button id="save" icon="check" on-tap="_handleActionSave"></paper-icon-button>
                </app-toolbar>
            </app-header>

            <div id="editor">
                <form is="iron-form" id="form" method="post" action="/form/handler">
                    <paper-dropdown-menu label="side" value="{{edit.side}}">
                        <paper-listbox slot="dropdown-content" id="side">
                            <paper-item>Port</paper-item>
                            <paper-item>Starboard</paper-item>
                            <paper-item>Both</paper-item>
                        </paper-listbox>
                    </paper-dropdown-menu>
                    <paper-dropdown-menu label="style" value="{{edit.style}}">
                        <paper-listbox slot="dropdown-content" id="style">
                            <paper-item>Sweep</paper-item>
                            <paper-item>Scull</paper-item>
                        </paper-listbox>
                    </paper-dropdown-menu>
                    <paper-dropdown-menu label="type" value="{{edit.type}}">
                        <paper-listbox slot="dropdown-content" id="type">
                            <paper-item>Wing</paper-item>
                            <paper-item>European</paper-item>
                        </paper-listbox>
                    </paper-dropdown-menu>
                    <paper-dropdown-menu label="seat" value="{{edit.seat}}">
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

    static get properties() {
        return {
            edit: {
                type: Object
            },

            rigger: {
                type: String
            },

            _drive: {
                type: Boolean,
                value: false
            }
        }
    }

    _handleActionBack(e) {
        this.dispatchEvent(new CustomEvent('ctm-rigger-edit-action-back', {
            bubbles: true,
            composed: true
        }));
    }

    _handleActionSave(e) {
        this.edit.updated = this.$.firebase.app.firebase_.database.ServerValue.TIMESTAMP;
        this.edit.seat = parseInt(this.edit.seat);
        this.$.firebase.data = JSON.parse(JSON.stringify(this.edit));
        this.$.firebase.saveValue('riggers', this.rigger)
            .then(() => {
                this.dispatchEvent(new CustomEvent('ctm-rigger-edit-action-saved', {
                    bubbles: true,
                    composed: true
                }));
            });
    }
}

customElements.define('ctm-rigger-edit', CtmRiggerEdit);
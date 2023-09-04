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



export class CtmPictureEdit extends LitElement {
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
                    <paper-input id="caption" label="caption" value="{{edit.caption}}"></paper-input>
                    <paper-input id="url" label="url" value="{{edit.url}}"></paper-input>
                </form>
            </div>

        </app-header-layout>`;
    }

    static get properties() {
        return {
            edit: {
                type: Object
            },

            picture: {
                type: String
            },

            _drive: {
                type: Boolean,
                value: false
            }
        }
    }

    _handleActionBack(e) {
        this.dispatchEvent(new CustomEvent('ctm-picture-edit-action-back', {
            bubbles: true,
            composed: true
        }));
    }

    _handleActionSave(e) {
        this.edit.updated = this.$.firebase.app.firebase_.database.ServerValue.TIMESTAMP;
        this.$.firebase.data = JSON.parse(JSON.stringify(this.edit));
        this.$.firebase.saveValue('pictures', this.picture)
            .then(() => {
                this.dispatchEvent(new CustomEvent('ctm-picture-edit-action-saved', {
                    bubbles: true,
                    composed: true
                }));
            });


    }

}

customElements.define('ctm-picture-edit', CtmPictureEdit);
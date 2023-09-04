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



export class CtmSchedulePictureCreate extends LitElement {
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

        #createor {
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

            <div id="createor">
                <form is="iron-form" id="form" method="post" action="/form/handler">
                    <paper-input id="caption" label="caption" value="{{create.caption}}"></paper-input>
                    <paper-input id="url" label="url" value="{{create.url}}"></paper-input>
                </form>
            </div>

        </app-header-layout>`;
    }

    static get properties() {
        return {
            create: {
                type: Object,
                value: {
                    caption: '',
                    url: '',
                    created: 0,
                    updated: 0
                }
            },

            teamId: String,

            picture: {
                type: String
            },

            _drive: {
                type: Boolean,
                value: false
            },

            regatta: String,
        }
    }

    _resetCreate() {
        this.create = {
            caption: '',
            url: '',
            updated: 0,
            created: 0
        }
    }

    _handleActionCancel() {
        this.dispatchEvent(new CustomEvent('ctm-schedule-picture-create-action-cancel', {
            bubbles: true,
            composed: true
        }));
        this._resetCreate();
    }

    _handleActionCreate(e) {
        this.create.updated = this.$.firebase.app.firebase_.database.ServerValue.TIMESTAMP;
        this.create.created = this.$.firebase.app.firebase_.database.ServerValue.TIMESTAMP;
        this.create.team = this.teamId;
        this.$.firebase.saveValue('pictures')
            .then(() => {
                this.$.firebase.setStoredValue(this.$.firebase.path, this.create);
                this._resetCreate();
                let _key = '';
                for (let x = 10; x < this.$.firebase.path.length; x++) {
                    _key = _key + this.$.firebase.path[x];
                }
                const path = 'regattaPictures/' + this.regatta + '/' + _key;
                this.$.firebase.setStoredValue(path, true)
                    .then(() => {

                        this.dispatchEvent(new CustomEvent('ctm-schedule-picture-create-action-created', {
                                bubbles: true,
                                composed: true
                            }));
                    })
                    .catch(() => {

                        this.dispatchEvent(new CustomEvent('ctm-schedule-picture-create-action-fanout-fail', {
                                bubbles: true,
                                composed: true
                            }));
                    });

            });


    }

}

customElements.define('ctm-schedule-picture-create', CtmSchedulePictureCreate);
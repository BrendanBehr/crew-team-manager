import {LitElement, html} from 'lit';

import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-pages/iron-pages';

import '@polymer/app-layout/app-layout';
import '@polymer/app-layout/app-drawer/app-drawer';
import '@polymer/app-layout/app-header/app-header';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import '@polymer/app-layout/app-header-layout/app-header-layout';

import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-spinner/paper-spinner-lite';



import './ctm-erg-detail-loading';
import './ctm-erg-detail-results';
import './ctm-erg-detail-message';

export class CtmErgDetail extends LitElement {
    static styles = `
        :host {
            background-color: lightslategray;
            @apply(--layout-horizontal);
            @apply(--paper-font-common-base);
        }

            :host([menu-hidden]) #menu {
            display: none;
        }

        #pages {
            @apply(--layout-vertical);
            @apply(--layout-flex);
        }

        #loading {
            @apply(--layout-flex);
        }

        #layout {
            @apply(--layout-flex);
        }

        #results {
            @apply(--layout-flex);
        }

        #message {
            @apply(--layout-flex);
        }

        #toolbar {
            background-color: #164410;
            color: #fff;
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
                    <div main-title id="title">Details</div>
                    <paper-icon-button id="edit" icon="create" on-tap="_handleActionEdit"></paper-icon-button>
                    <paper-icon-button id="delete" icon="delete" on-tap="_handleActionDelete"></paper-icon-button>
                </app-toolbar>
            </app-header>
            <iron-pages id="pages" attr-for-selected="id" selected="[[page]]">
                <ctm-erg-detail-loading id="loading"></ctm-erg-detail-loading>
                <ctm-erg-detail-results id="results" data="{{_data}}" team="{{_team}}"></ctm-erg-detail-results>
                <ctm-erg-detail-message id="message"></ctm-erg-detail-message>
            </iron-pages>


        </app-header-layout>`;
    }

    static get observers() {
        return [
            '_updatePage(erg)',
            '_changePage(page)'
        ]
    }

    static get properties() {
        return {
            page: {
                type: String
            },

            _data: {
                type: Object,
                value: {}
            },

            _team: {
                type: Object,
                value: {}
            },

            erg: {
                type: String,
                value: ''
            },

        }
    }

    _changePage(page) {

        this.importLazyGroup(page).then(function () {}.bind(this));
    }

    _updatePage(erg) {
        let page = 'message';

        if (erg) {
            page = 'results';

        }

        this.page = page;

    }

    _handleActionBack() {
        this.dispatchEvent(new CustomEvent(CTMErgDetail.is + '-action-back', {
            bubbles: true,
            composed: true
        }));
    }

    _handleActionEdit(e) {
        this.dispatchEvent(new CustomEvent(CTMErgDetail.is + '-action-edit', {
            bubbles: true,
            composed: true,
            detail: {
                erg: JSON.parse(JSON.stringify(this._data))
            }
        }));

    }

    _handleActionDelete(e) {
        this.$.firebase.destroy()
            .then(() => {
                this.dispatchEvent(new CustomEvent('ctm-erg-detail-action-delete', {
                        bubbles: true,
                        composed: true
                    }));
            })
            .catch(() => {

                this.dispatchEvent(new CustomEvent('ctm-erg-detail-action-delete-fail', {
                        bubbles: true,
                        composed: true
                    }));
            });
    }
}

// Register custom element definition using standard platform API
customElements.define('ctm-erg-detail', CtmErgDetail);
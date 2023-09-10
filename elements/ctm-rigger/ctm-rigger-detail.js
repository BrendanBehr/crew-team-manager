import {LitElement, html, css } from 'lit';

import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-pages/iron-pages';

import '@polymer/app-layout/app-layout';
import '@polymer/app-layout/app-drawer/app-drawer';
import '@polymer/app-layout/app-header/app-header';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import '@polymer/app-layout/app-header-layout/app-header-layout';

import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-spinner/paper-spinner-lite';



import './ctm-rigger-detail-loading';
import './ctm-rigger-detail-results';
import './ctm-rigger-detail-message';

export class CtmRiggerDetail extends LitElement {
    static styles = css`
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
                    <paper-icon-button id="back" icon="arrow-back" @click="${this._handleActionBack}"></paper-icon-button>
                    <div main-title id="title">Details</div>
                    <paper-icon-button id="edit" icon="create" @click="${this._handleActionEdit}"></paper-icon-button>
                    <paper-icon-button id="delete" icon="delete" @click="${this._handleActionDelete}"></paper-icon-button>
                </app-toolbar>
            </app-header>
            <iron-pages id="pages" attr-for-selected="id" selected="${this.page}">
                <ctm-rigger-detail-loading id="loading"></ctm-rigger-detail-loading>
                <ctm-rigger-detail-results id="results" data="${this._data}" boat="${this._boat}" team="${this._team}"></ctm-rigger-detail-results>
                <ctm-rigger-detail-message id="message"></ctm-rigger-detail-message>
            </iron-pages>
        </app-header-layout>`;
    }

    static get observers() {
        return [
            '_updatePage(rigger)',
            '_changePage(page)'
        ]

    }

    static properties() {
        return {
            page: {
                type: String
            },

            _data: {
                type: Object,
                value: {}
            },

            _boat: {
                type: Object,
                value: {}
            },

            _team: {
                type: Object,
                value: {}
            },

            rigger: {
                type: String,
                value: ''
            },

        }
    }

    _changePage(page) {

        this.importLazyGroup(page).then(function () {}.bind(this));
    }

    _updatePage(rigger) {
        let page = 'message';

        if (rigger) {
            page = 'results';

        }

        this.page = page;
    }



    _handleActionBack(e) {
        this.dispatchEvent(new CustomEvent('ctm-rigger-detail-action-back', {
            bubbles: true,
            composed: true
        }));
    }

    _handleActionEdit(e) {
        this.dispatchEvent(new CustomEvent('ctm-rigger-detail-action-edit', {
            bubbles: true,
            composed: true,
            detail: {
                rigger: JSON.parse(JSON.stringify(this._data))
            }
        }));

    }

    _handleActionDelete(e) {
        this.$.firebase.destroy()
            .then(() => {

                this.dispatchEvent(new CustomEvent('ctm-rigger-detail-action-delete', {
                        bubbles: true,
                        composed: true
                    }));
            })
            .catch(() => {

                this.dispatchEvent(new CustomEvent('ctm-rigger-detail-action-delete-fail', {
                        bubbles: true,
                        composed: true
                    }));
            });
    }
}

customElements.define('ctm-rigger-detail', CtmRiggerDetail);
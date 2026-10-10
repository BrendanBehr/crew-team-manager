import {LitElement, html, css } from 'lit';

import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-pages/iron-pages';

import '@polymer/app-layout/app-header-layout/app-header-layout';
import '@polymer/app-layout/app-drawer/app-drawer';
import '@polymer/app-layout/app-header/app-header';
import '@polymer/app-layout/app-toolbar/app-toolbar';

import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-styles/color';
import '@polymer/paper-styles/typography';
import '@polymer/paper-fab/paper-fab';



import './ctm-rigger-list-loading';
import './ctm-rigger-list-results';
import './ctm-rigger-list-message';

export class CtmRiggerList extends LitElement {
    static styles = css`
        :host {
            background-color: lightslategray;
            @apply(--layout-horizontal);
            @apply(--paper-font-common-base);
        }

            :host([menu-hidden]) #menu {
            display: none;
        }

        #layout {
            /*@apply(--layout-flex);*/
            @apply(--layout-vertical);
        }

        #toolbar {
            background-color: #164410;
            color: #fff;
        }

        #pages {
            @apply(--layout-flex);
            position: relative;
        }

        #loading {
            @apply(--layout-fit);
        }

        #results {
            @apply(--layout-fit);
        }

        #message {
            @apply(--layout-fit);
        }

        #fab {
            position: absolute;
            background-color: #164410;
            right: 16px;
            bottom: 16px;
        }

        #delete,
        #back {
            display: none;
        }

        #back[reveal],
        #delete[reveal] {
            display: inline-block;
        }
    `;
            
    constructor() {
        super();
    }

    render() {
        return html`
        <app-header-layout id="layout" has-scrolling-region fullbleed>

            <app-header slot="header" reveals>
                <app-toolbar id="toolbar">
                    <paper-icon-button id="menu" icon="menu" @click="${this._handleActionMenu}"></paper-icon-button>
                    <paper-icon-button id="back" icon="arrow-back" reveal="${this.reveal}" @click="${this._handleActionBack}"></paper-icon-button>
                    <div main-title id="title">Riggers</div>
                    <paper-icon-button id="delete" icon="delete" reveal="${this.reveal}" @click="${this._handleActionDeleteItems}"></paper-icon-button>
                    <paper-icon-button id="logout" icon="exit-to-app" @click="${this._handleActionLogout}"></paper-icon-button>
                </app-toolbar>
            </app-header>
            <iron-pages id="pages" attr-for-selected="id" selected="${this.page}">
                <ctm-rigger-list-loading id="loading"></ctm-rigger-list-loading>
                <ctm-rigger-list-results id="results" data="${this._data}" boat="${this._boat}" selected="${this.selected}" on-ctm-rigger-list-results-action-delete-multiple="_prepareDelete"></ctm-rigger-list-results>
                <ctm-rigger-list-message id="message"></ctm-rigger-list-message>
            </iron-pages>
            <paper-fab id="fab" icon="add" @click="${this._handleActionCreate}">
            </paper-fab>

        </app-header-layout>

        <paper-toast id="toast" duration="4000">${this._toast}</paper-toast>`;
    }

    static get observers() {
        return [
            '_updatePage(_data.splices)',
            '_changePage(page)'
        ]
    }


    static properties() {
        return {
            page: {
                type: String
            },

            _data: {
                type: Object
            },

            teamId: String,

            _deleteItems: {
                type: Object,
                value: []
            },

            selected: {
                type: Boolean,
                value: false
            }

        }
    }

    _changePage(page) {

        this.importLazyGroup(page).then(function () {}.bind(this));
    }

    _handleActionMenu() {
        this.dispatchEvent(new CustomEvent('ctm-rigger-list-action-menu', {
            bubbles: true,
            composed: true
        }));
    }

    _handleActionLogout() {
        this.dispatchEvent(new CustomEvent('ctm-rigger-list-action-logout', {
            bubbles: true,
            composed: true
        }));
    }

    _handleActionCreate() {
        this.dispatchEvent(new CustomEvent('ctm-rigger-list-action-create', {
            bubbles: true,
            composed: true
        }));
    }

    _updatePage(dataSplices) {

        if (dataSplices === undefined) {
            return;
        }

        let page = 'message';

        if (dataSplices) {
            if (dataSplices.indexSplices[0].object.length) {
                page = 'results';
            }

        }

        this.page = page;
    }

    _handleActionBack() {
        this.reveal = false;
        this.selected = false;
        this._deleteItems = [];
    }

    _prepareDelete(e) {
        this.reveal = true;
        this.selected = true;
        this._deleteItems.push(e.detail.rigger)
    }

    _handleActionDeleteItems() {
        let key;
        let path;
        this._toast = 'Deleting Items';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
        this.reveal = false;
        this.selected = false;
        for (let x = 0; x < this._deleteItems.length; x++) {
            key = this._deleteItems[x].$key;
            path = 'riggers/' + key;
            this.$.firebase.path = path;
            this.$.firebase.destroy();
        }
    }

}

customElements.define('ctm-rigger-list', CtmRiggerList);
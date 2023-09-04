import {LitElement, html} from 'lit';

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



import './ctm-picture-list-loading';
import './ctm-picture-list-results';
import './ctm-picture-list-message';

export class CtmPictureList extends LitElement {
    static styles = `
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
            background-color: #164410;
            position: absolute;
            bottom: 16px;
            right: 16px;
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
                    <paper-icon-button id="menu" icon="menu" on-tap="_handleActionMenu"></paper-icon-button>
                    <paper-icon-button id="back" icon="arrow-back" reveal$="[[reveal]]" on-tap="_handleActionBack"></paper-icon-button>
                    <div main-title id="title">Pictures</div>
                    <paper-icon-button id="delete" icon="delete" reveal$="[[reveal]]" on-tap="_handleActionDeleteItems"></paper-icon-button>
                    <paper-icon-button id="logout" icon="exit-to-app" on-tap="_handleActionLogout"></paper-icon-button>
                </app-toolbar>
            </app-header>
            <iron-pages id="pages" attr-for-selected="id" selected="[[page]]">
                <ctm-picture-list-loading id="loading"></ctm-picture-list-loading>
                <ctm-picture-list-results id="results" data="[[_data]]" selected="[[selected]]" on-ctm-picture-list-results-action-delete-multiple="_prepareDelete"></ctm-picture-list-results>
                <ctm-picture-list-message id="message"></ctm-picture-list-message>
            </iron-pages>

            <paper-fab id="fab" icon="add" on-tap="_handleActionCreate"></paper-fab>
        </app-header-layout>

        <paper-toast id="toast" duration="4000">[[_toast]]</paper-toast>`;
    }

    static get observers() {
        return [
            '_updatePage(_data.splices)',
            '_changePage(page)'
        ]
    }

    static get properties() {
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
            },

            reveal: {
                type: Boolean,
                value: false
            }

        }
    }

    _changePage(page) {

        this.importLazyGroup(page).then(function () {}.bind(this));
    }

    _handleActionMenu() {
        this.dispatchEvent(new CustomEvent('ctm-picture-list-action-menu', {
            bubbles: true,
            composed: true
        }));
    }

    _handleActionLogout() {
        this.dispatchEvent(new CustomEvent('ctm-picture-list-action-logout', {
            bubbles: true,
            composed: true
        }));
    }

    _handleActionCreate() {
        this.dispatchEvent(new CustomEvent('ctm-picture-list-action-create', {
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
        this._deleteItems.push(e.detail.picture)
    }

    _handleActionDeleteItems() {
        let key;
        let path;
        this._toast = 'Deleting Items';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
        this.reveal = false;
        for (let x = 0; x < this._deleteItems.length; x++) {
            key = this._deleteItems[x].$key;
            path = 'pictures/' + key;
            this.$.firebase.path = path;
            this.$.firebase.destroy();
        }
    }
}

customElements.define('ctm-picture-list', CtmPictureList);
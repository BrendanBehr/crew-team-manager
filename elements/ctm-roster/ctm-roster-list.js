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
import '@polymer/paper-toast/paper-toast';



import './ctm-roster-list-loading';
import './ctm-roster-list-results';
import './ctm-roster-list-message';

export class CtmRosterList extends LitElement {
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

        #loading,
        #results,
        #message {
            @apply(--layout-fit);
        }

        #fab {
            position: absolute;
            background-color: #164410;
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
                    <div main-title id="title">Roster</div>
                    <paper-icon-button id="delete" icon="delete" reveal$="[[reveal]]" on-tap="_handleActionDeleteItems"></paper-icon-button>
                    <paper-icon-button id="logout" icon="exit-to-app" on-tap="_handleActionLogout"></paper-icon-button>
                </app-toolbar>
            </app-header>
            <iron-pages id="pages" attr-for-selected="id" selected="[[page]]">
                <ctm-roster-list-loading id="loading"></ctm-roster-list-loading>
                <ctm-roster-list-results id="results" data="[[_data]]" selected="[[selected]]" on-ctm-roster-list-results-action-delete-multiple="_prepareDelete"></ctm-roster-list-results>
                <ctm-roster-list-message id="message"></ctm-roster-list-message>
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

            reveal: {
                type: Boolean,
                value: false
            },

            _deleteItems: {
                type: Object,
                value: []
            },

            reveal: {
                type: Boolean,
                value: false
            },

            selected: {
                type: Boolean,
                value: false
            }

        }
    }

    _handleActionBack() {
        this.reveal = false;
        this.selected = false;
        this._deleteItems = [];
    }

    _prepareDelete(e) {
        this.reveal = true;
        this.selected = true;
        this._deleteItems.push(e.detail.athlete)
    }

    _changePage(page) {

        this.importLazyGroup(page).then(function () {}.bind(this));
    }

    _handleActionMenu() {
        this.dispatchEvent(new CustomEvent('ctm-roster-list-action-menu', {
            bubbles: true,
            composed: true
        }));
    }

    _handleActionLogout() {
        this.dispatchEvent(new CustomEvent('ctm-roster-list-action-logout', {
            bubbles: true,
            composed: true
        }));
    }

    _handleActionCreate() {
        this.dispatchEvent(new CustomEvent('ctm-roster-list-action-create', {
            bubbles: true,
            composed: true
        }));
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
            path = 'athletes/' + key;
            console.log(path)
            this.$.firebase.path = path;
            this.$.firebase.destroy();
        }
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

}

customElements.define('ctm-roster-list', CtmRosterList);
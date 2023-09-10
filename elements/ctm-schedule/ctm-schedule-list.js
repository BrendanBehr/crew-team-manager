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



import './ctm-schedule-list-loading';
import './ctm-schedule-list-results';
import './ctm-schedule-list-message';

export class CtmScheduleList extends LitElement {
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
                    <paper-icon-button id="menu" icon="menu" @click="${this._handleActionMenu}"></paper-icon-button>
                    <paper-icon-button id="back" icon="arrow-back" reveal="${this.reveal}" @click="${this._handleActionBack}"></paper-icon-button>
                    <div main-title id="title">Regattas</div>
                    <paper-icon-button id="delete" icon="delete" reveal="${this.reveal}" @click="${this._handleActionDeleteItems}"></paper-icon-button>
                    <paper-icon-button id="logout" icon="exit-to-app" @click="${this._handleActionLogout}"></paper-icon-button>
                </app-toolbar>
            </app-header>
            <iron-pages id="pages" attr-for-selected="id" selected="${this.page}">
                <ctm-schedule-list-loading id="loading"></ctm-schedule-list-loading>
                <ctm-schedule-list-results id="results" data="${this._data}" selected="${this.selected}" on-ctm-schedule-list-results-action-delete-multiple="_prepareDelete"></ctm-schedule-list-results>
                <ctm-schedule-list-message id="message"></ctm-schedule-list-message>
            </iron-pages>

            <paper-fab id="fab" icon="add" @click="${this._handleActionCreate}"></paper-fab>

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
                type: Object,
                avatar: ''
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

            selected: {
                type: Boolean,
                value: false
            }

        }
    }

    _changePage(page) {

        this.importLazyGroup(page).then(function () {}.bind(this));
    }

    _handleActionCreate() {
        this.dispatchEvent(new CustomEvent('ctm-schedule-list-action-create', {
            bubbles: true,
            composed: true
        }));
    }

    _handleActionLogout() {
        this.dispatchEvent(new CustomEvent('ctm-schedule-list-action-logout', {
            bubbles: true,
            composed: true
        }));
    }

    _handleActionMenu() {
        this.dispatchEvent(new CustomEvent('ctm-schedule-list-action-menu', {
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
            //If it is a head race then it will find the value of the specific name
            let index = dataSplices.indexSplices[0].object.length - 1;
            if (dataSplices.indexSplices[0].object[index].name) {
                dataSplices.indexSplices[
                        0].object[index].avatar = dataSplices.indexSplices[0].object[
                        index]
                    .name[12];
            }
            //If it isn't a head race then it will use the default name 
            else {
                dataSplices.indexSplices[0].object[index].avatar = dataSplices.indexSplices[0].object[
                    index].name;
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
        this._deleteItems.push(e.detail.regatta)
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
            path = 'regattas/' + key;
            this.$.firebase.path = path;
            this.$.firebase.destroy();
        }
    }

}

customElements.define('ctm-schedule-list', CtmScheduleList);
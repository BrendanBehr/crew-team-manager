import {LitElement, html, css } from 'lit';
import { Timestamp  } from "firebase/firestore";

import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-pages/iron-pages';

import '@polymer/app-layout/app-layout';
import '@polymer/app-layout/app-drawer/app-drawer';
import '@polymer/app-layout/app-header/app-header';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import '@polymer/app-layout/app-header-layout/app-header-layout';

import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-spinner/paper-spinner-lite';
import '@polymer/paper-toast/paper-toast';



import './ctm-roster-detail-loading';
import './ctm-roster-detail-results';
import './ctm-roster-detail-message';

export class CtmRosterDetail extends LitElement {
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

        #fabs-layout {
            position: absolute;
            bottom: 16px;
            right: 16px;
        }

        .fab {
            display: none;
        }

        #fabs-layout #add {
            display: inherit;
            background-color: #164410;
        }

        #fabs-layout:hover .fab {
            display: inherit;
        }

        #fabs-layout:hover #add {
            display: none;
        }

        #erg {
            background-color: #ff9800;
            margin-bottom: 16px;
        }

        #finance {
            background-color: #311b92;
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
                <ctm-roster-detail-loading id="loading"></ctm-roster-detail-loading>
                <ctm-roster-detail-results id="results" data="${this._data}" team="${this._team}" erg="${this._ergs}"></ctm-roster-detail-results>
                <ctm-roster-detail-message id="message"></ctm-roster-detail-message>
            </iron-pages>

            <paper-toast id="toast" duration="4000">${this._toast}</paper-toast>

        </app-header-layout>

        <div id="fabs-layout">
            <div id="fabs">
                <paper-fab id="erg" class="fab" icon="places:fitness-center" @click="${this._handleActionAddErg}"></paper-fab>
                <paper-fab id="finance" class="fab" icon="editor:attach-money" @click="${this._handleActionAddFinance}"></paper-fab>
                <paper-fab id="add" class="fab" icon="icons:add"></paper-fab>
            </div>
        </div>`;
    }

    static get observers() {
        return [
            '_updatePage(athlete)',
            '_changePage(page)',
            '_getGross(gross)'
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

            _team: {
                type: Object,
                value: {}
            },

            athlete: {
                type: String,
                value: ''
            },

            _ergs: {
                type: Object,
                value: {}
            },

            gross: {
                type: Number,
                value: 0
            }

        }
    }

    _resetData() {
        this.gross = 0;
    }

    _changePage(page) {

        this.importLazyGroup(page).then(function () {}.bind(this));
    }

    _updatePage(athlete) {
        let page = 'message';

        if (athlete) {
            page = 'results';

        }

        this.page = page;
    }

    _handleActionBack(e) {
        this._resetData();
        this.dispatchEvent(new CustomEvent('ctm-roster-detail-action-back', {
            bubbles: true,
            composed: true
        }));
    }

    _handleActionEdit(e) {
        this.dispatchEvent(new CustomEvent('ctm-roster-detail-action-edit', {
            bubbles: true,
            composed: true,
            detail: {
                athlete: JSON.parse(JSON.stringify(this._data))
            }
        }));

    }

    _handleActionDelete(e) {
        this.$.firebase.path = 'athleteErgs/' + this.athlete;
        this.$.firebase.destroy()
            .catch(() => {

                this.dispatchEvent(new CustomEvent('ctm-roster-detail-action-delete-fail', {
                        bubbles: true,
                        composed: true
                    }));
            });
        this.$.firebase.path = 'athleteFinances/' + this.athlete;
        this.$.firebase.destroy()
            .catch(() => {

                this.dispatchEvent(new CustomEvent('ctm-roster-detail-action-delete-fail', {
                        bubbles: true,
                        composed: true
                    }));
            });
        this.$.firebase.path = 'athletes/' + this.athlete;
        this.$.firebase.destroy()
            .then(() => {

                this.dispatchEvent(new CustomEvent('ctm-roster-detail-action-delete', {
                        bubbles: true,
                        composed: true
                    }));
            })
            .catch(() => {

                this.dispatchEvent(new CustomEvent('ctm-roster-detail-action-delete-fail', {
                        bubbles: true,
                        composed: true
                    }));
            });
    }

    _handleActionAddErg() {
        this.dispatchEvent(new CustomEvent('ctm-roster-detail-action-add-erg', {
            bubbles: true,
            composed: true
        }));
    }

    _handleActionAddFinance() {
        this.dispatchEvent(new CustomEvent('ctm-roster-detail-action-add-finance', {
            bubbles: true,
            composed: true
        }));
    }

    _getGross(gross) {
        if (gross != 0) {


            this._data.updated = Timestamp.now();
            this._data.fundRaising = gross + this._data.fundRaising;
            this.$.firebase.data = JSON.parse(JSON.stringify(this._data));
            this.$.firebase.saveValue('athletes', this.athlete)
                .then(() => {});
        }
    }
}

customElements.define('ctm-roster-detail', CtmRosterDetail);
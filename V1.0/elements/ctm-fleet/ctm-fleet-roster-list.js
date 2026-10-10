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



import './ctm-fleet-roster-list-loading';
import './ctm-fleet-roster-list-results';
import './ctm-fleet-roster-list-message';

export class CtmFleetRosterList extends LitElement {
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
            @apply(--layout-vertical);
            @apply(--layout-flex);
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
    `;
        
    constructor() {
        super();
    }

    render() {
        return html`
        <app-header-layout id="layout" has-scrolling-region fullbleed>

            <app-header slot="header" reveals>
                <app-toolbar id="toolbar">
                    <paper-icon-button id="back" icon="arrow-back" @click="${this._handleActionBack}"></paper-icon-button>
                    <div main-title id="title">Select Athletes To Add</div>
                    <paper-icon-button id="add" icon="check" @click="${this._handleActionAdd}"></paper-icon-button>
                </app-toolbar>
            </app-header>
            <iron-pages id="pages" attr-for-selected="id" selected="${this.page}">
                <ctm-fleet-roster-list-loading id="loading"></ctm-fleet-roster-list-loading>
                <ctm-fleet-roster-list-results id="results" data="${this._data}" selected="${this.selected}" on-ctm-fleet-roster-list-results-action-select-athletes="_selectAthletes"></ctm-fleet-roster-list-results>
                <ctm-fleet-roster-list-message id="message"></ctm-fleet-roster-list-message>
            </iron-pages>

        </app-header-layout>`;
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
                type: String,
            },

            _data: {
                type: Object
            },

            teamId: String,

            selectedAthletes: {
                type: Array,
                value: []
            },

            boat: {
                type: String,
                value: ''
            },

            selected: {
                type: Boolean,
                value: false
            }
        }
    }

    _selectAthletes(e) {

        for (let x = 0; x < this.selectedAthletes.length; x++) {
            if (this.selectedAthletes[x] == e.detail.athlete) {
                this.selectedAthletes.splice(x, x);
                return;
            }
        }
        this.selected = true;
        this.selectedAthletes.push(e.detail.athlete)
    }

    _handleActionAdd() {
        let path;
        this.selected = false;
        this.$.firebase.saveValue('boatAthletes', this.boat)
            .then(() => {
                for (let x = 0; x < this.selectedAthletes.length; x++) {
                    path = 'boatAthletes/' + this.boat + '/' + this.selectedAthletes[x]
                    this.$.firebase.setStoredValue(path, true);

                }
                this.dispatchEvent(new CustomEvent('ctm-fleet-roster-list-action-add-athletes', {
                        bubbles: true,
                        composed: true
                    }));
            })
            .catch(() => {

                this.dispatchEvent(new CustomEvent('ctm-fleet-roster-list-action-fanout-fail', {
                        bubbles: true,
                        composed: true
                    }));
            });

    }

    _handleActionBack() {
        this.selected = false;
        this.dispatchEvent(new CustomEvent('ctm-fleet-roster-list-action-back', {
            bubbles: true,
            composed: true,
        }));
    }

    _changePage(page) {

        this.importLazyGroup(page).then(function () {}.bind(this));
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

customElements.define('ctm-fleet-roster-list', CtmFleetRosterList);
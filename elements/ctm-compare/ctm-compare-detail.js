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

import './ctm-compare-detail-loading';
import './ctm-compare-detail-results';
import './ctm-compare-detail-message';

export class CtmCompareDetail extends LitElement {
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

        #layout {
            @apply(--layout-flex);
        }

        #results,
        #loading,
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
                </app-toolbar>
            </app-header>
            <iron-pages id="pages" attr-for-selected="id" selected="${this.page}">
                <ctm-compare-detail-loading id="loading"></ctm-compare-detail-loading>
                <ctm-compare-detail-results id="results" data-one="${this._dataAthleteOne}" data-two="${this._dataAthleteTwo}" team="${this._team}"></ctm-compare-detail-results>
                <ctm-compare-detail-message id="message"></ctm-compare-detail-message>
            </iron-pages>


        </app-header-layout>
        `;
    }

    static get observers() {
        return [
            '_updateAthletes(athletes)',
            '_updatePage(athleteOne, athleteTwo)',
            '_changePage(page)'
        ]

    }

    static properties() {
        return {
            page: {
                type: String
            },

            _dataAthleteOne: {
                type: Object,
                value: {}
            },

            _dataAthleteTwo: {
                type: Object,
                value: {}
            },

            _team: {
                type: Object,
                value: {}
            },

            athletes: {
                type: Object
            },

            athleteOne: {
                type: String,
                value: ''
            },

            athleteTwo: {
                type: String,
                value: ''
            }

        }
    }

    _updateAthletes(athletes) {
        this.athleteOne = athletes.athlete1;
        this.athleteTwo = athletes.athlete2;
    }

    _changePage(page) {
        this.importLazyGroup(page).then(function () {}.bind(this));
    }

    _updatePage(athlete1, athlete2) {
        let page = 'message';
        if (athlete1 && athlete2) {
            page = 'results';

        }
        this.page = page;
    }

    _handleActionBack(e) {
        this.dispatchEvent(new CustomEvent('ctm-compare-detail-action-back', {
            bubbles: true,
            composed: true
        }));
    }
}

 customElements.define('ctm-compare-detail', CtmCompareDetail);
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

import './ctm-compare-list-loading';
import './ctm-compare-list-results';
import './ctm-compare-list-message';

export class CtmCompareList extends LitElement {
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

        #loading,
        #results,
        #message {
            @apply(--layout-fit);
        }

        #compare {
            color: #fff;
            right: 0px;
        }

        #selected-athletes {
            @apply(--layout-horizontal);
        }

        #first-athlete,
        #second-athlete {
            @apply(--layout-flex);
            background-color: #4caf50;
        }
        `;

    constructor() {
        super();
    }

    render() {
        return html`
        <iron-pages id="pages" attr-for-selected="id" selected="${this.page}">
            <ctm-compare-list-loading id="loading"></ctm-compare-list-loading>
            <ctm-compare-list-results id="results" data="${this._data}" on-ctm-compare-list-results-first-athlete="_handleAthlete1"
                on-ctm-compare-list-results-second-athlete="_handleAthlete2"></ctm-compare-list-results>
            <ctm-compare-list-message id="message"></ctm-compare-list-message>
        </iron-pages>
        `;
    }

    static properties = {
        page: {
            type: String
        },

        _data: {
            type: Object
        },

        wideLayout: {
            type: Boolean,
            value: false,
        },

        _athlete1: {
            type: Object,
        },

        _athlete2: {
            type: Object,
        },

        _athlete1Show: {
            type: Boolean,
            value: false
        },

        _athlete2Show: {
            type: Boolean,
            value: false
        },

        teamId: String
    }

    static get observers() {
        return [
            '_updatePage(_data.splices)',
            '_changePage(page)'
        ]
    }
    _changePage(page) {

        this.importLazyGroup(page).then(function () {}.bind(this));
    }

    _handleActionMenu() {
        this.dispatchEvent(new CustomEvent(CtmCompareList.is + '-action-menu', {
            bubbles: true,
            composed: true
        }));
    }


    _handleActionCreate() {
        this.dispatchEvent(new CustomEvent(CtmCompareList.is + '-action-create', {
            bubbles: true,
            composed: true
        }));
    }

    _updatePage(dataSplices) {

        let page = 'message';

        if (dataSplices) {
            if (dataSplices.indexSplices[0].object.length) {
                page = 'results';
            }
        }

        this.page = page;

    }

    _handleAthlete1(e) {
        this._athlete1 = e.detail.athlete;
        this._athlete1Show;
    }

    _handleAthlete2(e) {
        this._athlete2 = e.detail.athlete;
        this._athlete2Show;
    }

    _handleActionLogout() {
        this.dispatchEvent(new CustomEvent(CtmStage.is + '-action-logout', {
            bubbles: true,
            composed: true
        }));
    }

    _handleActionCompare(e) {
        const athlete1 = this._athlete1;
        const athlete2 = this._athlete2;
        if (athlete1 && athlete2) {
            this.dispatchEvent(new CustomEvent(CtmCompareListResults.is + '-action-detail', {
                bubbles: true,
                composed: true,
                detail: {
                    firstAthlete: athlete1.$key,
                    secondAthlete: athlete2.$key

                }
            }));
        }

        if (!athlete1 || !athlete2) {
            this.dispatchEvent(new CustomEvent(CtmCompareListResults.is + '-action-toast', {
                bubbles: true,
                composed: true,
            }));
        }

    }

}
customElements.define('ctm-compare-list', CtmCompareList);
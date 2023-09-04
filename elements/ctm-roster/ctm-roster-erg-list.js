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



import './ctm-roster-erg-list-loading';
import './ctm-roster-erg-list-results';
import './ctm-roster-erg-list-message';

export class CtmRosterErgList extends LitElement {
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
                    <paper-icon-button id="back" icon="arrow-back" on-tap="_handleActionBack"></paper-icon-button>
                    <div main-title id="title">Select Ergs To Add</div>
                    <paper-icon-button id="add" icon="check" on-tap="_handleActionAdd"></paper-icon-button>
                </app-toolbar>
            </app-header>

            <iron-pages id="pages" attr-for-selected="id" selected="[[page]]">
                <ctm-roster-erg-list-loading id="loading"></ctm-roster-erg-list-loading>
                <ctm-roster-erg-list-results id="results" data="[[_data]]" selected="[[selected]]" on-ctm-roster-erg-list-results-action-select-ergs="_selectErgs"></ctm-roster-erg-list-results>
                <ctm-roster-erg-list-message id="message"></ctm-roster-erg-list-message>
            </iron-pages>

        </app-header-layout>`;
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
                type: String,
            },

            _data: {
                type: Object
            },

            teamId: String,

            selectedErgs: {
                type: Object,
                value: {}
            },

            athlete: {
                type: String,
                value: ''
            },

            selected: {
                type: Boolean,
                value: false
            }
        }
    }

    _selectErgs(e) {
        this.selected = true;
        this.selectedErgs = e.detail.erg;
    }

    _handleActionAdd() {
        let path;
        let name;
        this.selected = false;
        this.$.firebase.saveValue('athleteErgs', this.athlete)
            .then(() => {
                name = this.selectedErgs.number + ', ' + this.selectedErgs.model
                path = 'athleteErgs/' + this.athlete + '/' + this.selectedErgs.$key;
                this.$.firebase.setStoredValue(path, name)
                    .then(() => {
                        this.dispatchEvent(new CustomEvent('ctm-roster-erg-list-action-add-ergs', {
                                bubbles: true,
                                composed: true
                            }));
                    })
                    .catch(() => {

                        this.dispatchEvent(new CustomEvent('ctm-roster-erg-list-action-fanout-fail', {
                                bubbles: true,
                                composed: true
                            }));
                    });


            });
    }

    _handleActionBack() {
        this.selected = false;
        this.dispatchEvent(new CustomEvent('ctm-roster-erg-list-action-back', {
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

customElements.define('ctm-roster-erg-list', CtmRosterErgList);
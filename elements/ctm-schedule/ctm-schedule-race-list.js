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



import './ctm-schedule-race-list-loading';
import './ctm-schedule-race-list-results';
import './ctm-schedule-race-list-message';

export class CtmScheduleRaceList extends LitElement {
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
                    <div main-title id="title">Select Races To Add</div>
                    <paper-icon-button id="add" icon="check" on-tap="_handleActionAdd"></paper-icon-button>
                </app-toolbar>
            </app-header>
            <iron-pages id="pages" attr-for-selected="id" selected="[[page]]">
                <ctm-schedule-race-list-loading id="loading"></ctm-schedule-race-list-loading>
                <ctm-schedule-race-list-results id="results" data="[[_data]]" selected="[[selected]]" on-ctm-schedule-race-list-results-action-select-races="_selectRace"></ctm-schedule-race-list-results>
                <ctm-schedule-race-list-message id="message"></ctm-schedule-race-list-message>
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
                type: String
            },

            _data: {
                type: Object
            },

            teamId: String,

            selectedRace: {
                type: Array,
                value: []
            },

            regatta: String,

            selected: {
                type: Boolean,
                value: false
            }
        }
    }

    _selectRace(e) {
        for (let x = 0; x < this.selectedRace.length; x++) {
            if (this.selectedRace[x] == e.detail.race) {
                this.selectedRace.splice(x, x);
                return;
            }
        }
        this.selected = true;

        this.selectedRace.push(e.detail.race)
    }

    _handleActionAdd() {
        let path;
        this.selected = false;
        this.$.firebase.saveValue('regattaRaces', this.regatta)
            .then(() => {
                for (let x = 0; x < this.selectedRace.length; x++) {
                    path = 'regattaRaces/' + this.regatta + '/' + this.selectedRace[x];
                    this.$.firebase.setStoredValue(path, true)
                        .then(() => {
                            this.dispatchEvent(new CustomEvent('ctm-schedule-race-list-action-add-race', {
                                    bubbles: true,
                                    composed: true,
                                }));
                        })
                        .catch(() => {

                            this.dispatchEvent(new CustomEvent('ctm-schedule-race-list-action-fanout-fail', {
                                    bubbles: true,
                                    composed: true
                                }));
                        });
                }



            });
    }

    _handleActionBack() {
        this.selected = false;
        this.dispatchEvent(new CustomEvent('ctm-schedule-race-list-action-back', {
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

customElements.define('ctm-schedule-race-list', CTMScheduleRaceList);
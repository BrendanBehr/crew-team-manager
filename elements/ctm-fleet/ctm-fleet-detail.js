import {LitElement, html} from 'lit';

import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-pages/iron-pages';

import '@polymer/app-layout/app-layout';
import '@polymer/app-layout/app-drawer/app-drawer';
import '@polymer/app-layout/app-header/app-header';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import '@polymer/app-layout/app-header-layout/app-header-layout';

import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-spinner/paper-spinner-lite';
import '@polymer/paper-fab/paper-fab';



import './ctm-fleet-detail-loading';
import './ctm-fleet-detail-results';
import './ctm-fleet-detail-message';

export class CtmFleetDetail extends LitElement {
    static styles = `
        :host {
            background-color: lightslategray;
            @apply(--layout-horizontal);
            @apply(--paper-font-common-base);
            @apply(--position-relative);
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
        #message,
        #loading {
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

        #athlete {
            background-color: #ff9800;
            margin-bottom: 16px;
        }

        #rigger {
            background-color: #311b92;
            margin-bottom: 16px;
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
                    <paper-icon-button id="back" icon="arrow-back" on-tap="_handleActionBack"></paper-icon-button>
                    <div main-title id="title">Details</div>
                    <paper-icon-button id="edit" icon="create" on-tap="_handleActionEdit"></paper-icon-button>
                    <paper-icon-button id="delete" icon="delete" on-tap="_handleActionDelete"></paper-icon-button>
                </app-toolbar>
            </app-header>
            <iron-pages id="pages" attr-for-selected="id" selected="[[page]]">
                <ctm-fleet-detail-loading id="loading"></ctm-fleet-detail-loading>
                <ctm-fleet-detail-results id="results" data="{{_data}}" team={{_team}} athlete="[[_athletes]]" oar="[[_oars]]"
                    rigger="[[_riggers]]"></ctm-fleet-detail-results>
                <ctm-fleet-detail-message id="message"></ctm-fleet-detail-message>
            </iron-pages>

        </app-header-layout>


        <div id="fabs-layout">
            <div id="fabs">
                <paper-fab id="athlete" class="fab" icon="rowing" on-tap="_handleActionAddAthlete"></paper-fab>
                <paper-fab id="rigger" class="fab" icon="build" on-tap="_handleActionAddRigger"></paper-fab>
                <paper-fab id="oar" class="fab" icon="av:shuffle" on-tap="_handleActionAddOar"></paper-fab>
                <paper-fab id="add" class="fab" icon="icons:add"></paper-fab>
            </div>
        </div>`;
    }

    static get observers() {
        return [
            '_updatePage(boat)',
            '_changePage(page)'
        ]
    }

    static get properties() {
        return {
            page: {
                type: String
            },

            _data: {
                type: Object,
                value: {}
            },

            _athletes: {
                type: Object
            },

            _oars: {
                type: Object
            },

            _riggers: {
                type: Object
            },

            _team: {
                type: Object,
                value: {}
            },

            boat: {
                type: String,
                value: ''
            },

            teamId: String

        }
    }

    _changePage(page) {
        this.importLazyGroup(page).then(function () {}.bind(this));
    }

    _updatePage(boat) {
        let page = 'message';

        if (boat) {
            page = 'results';

        }
        this.page = page;
    }

    _handleActionAdd() {
        this.dispatchEvent(new CustomEvent('ctm-fleet-detail-action-add', {
            bubbles: true,
            composed: true
        }));
    }

    _handleActionBack(e) {
        this.dispatchEvent(new CustomEvent('ctm-fleet-detail-action-back', {
            bubbles: true,
            composed: true
        }));
    }

    _handleActionEdit(e) {
        this.dispatchEvent(new CustomEvent('ctm-fleet-detail-action-edit', {
            bubbles: true,
            composed: true,
            detail: {
                boat: JSON.parse(JSON.stringify(this._data))
            }
        }));

    }

    _handleActionDelete(e) {
        this.$.firebase.path = 'boatAthletes/' + this.boat;
        this.$.firebase.destroy()
            .catch(() => {

                this.dispatchEvent(new CustomEvent('ctm-fleet-detail-action-delete-fail', {
                        bubbles: true,
                        composed: true
                    }));
            });
        this.$.firebase.path = 'boatOars/' + this.boat;
        this.$.firebase.destroy()
            .catch(() => {

                this.dispatchEvent(new CustomEvent('ctm-fleet-detail-action-delete-fail', {
                        bubbles: true,
                        composed: true
                    }));
            });
        this.$.firebase.path = 'boatRiggers/' + this.boat;
        this.$.firebase.destroy()
            .catch(() => {

                this.dispatchEvent(new CustomEvent('ctm-fleet-detail-action-delete-fail', {
                        bubbles: true,
                        composed: true
                    }));
            });
        this.$.firebase.path = 'boats/' + this.boat;
        this.$.firebase.destroy()
            .then(() => {

                this.dispatchEvent(new CustomEvent('ctm-fleet-detail-action-delete', {
                        bubbles: true,
                        composed: true
                    }));
            })
            .catch(() => {

                this.dispatchEvent(new CustomEvent('ctm-fleet-detail-action-delete-fail', {
                        bubbles: true,
                        composed: true
                    }));
            });
    }

    _handleActionAddAthlete() {
        this.dispatchEvent(new CustomEvent('ctm-fleet-detail-action-add-athlete', {
            bubbles: true,
            composed: true
        }));
    }

    _handleActionAddOar() {
        this.dispatchEvent(new CustomEvent('ctm-fleet-detail-action-add-oar', {
            bubbles: true,
            composed: true
        }));
    }

    _handleActionAddRigger() {
        this.dispatchEvent(new CustomEvent('ctm-fleet-detail-action-add-rigger', {
            bubbles: true,
            composed: true
        }));
    }
}

customElements.define('ctm-fleet-detail', CTMFleetDetail);
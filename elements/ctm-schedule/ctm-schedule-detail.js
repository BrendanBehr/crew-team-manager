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



import './ctm-schedule-detail-loading';
import './ctm-schedule-detail-results';
import './ctm-schedule-detail-message';

export class CtmScheduleDetail extends LitElement {
    static styles = `
        :host {
            background-color: lightslategray;
            @apply(--layout-horizontal);
            @apply(--paper-font-common-base);
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

        #race {
            background-color: #ff9800;
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
                <ctm-schedule-detail-loading id="loading"></ctm-schedule-detail-loading>
                <ctm-schedule-detail-results id="results" data="{{_data}}" race="[[_races]]"></ctm-schedule-detail-results>
                <ctm-schedule-detail-message id="message"></ctm-schedule-detail-message>
            </iron-pages>


        </app-header-layout>

        <div id="fabs-layout">
            <div id="fabs">
                <paper-fab id="race" class="fab" icon="gavel" on-tap="_handleActionAddRace"></paper-fab>
                <paper-fab id="picture" class="fab" icon="image:camera-roll" on-tap="_handleActionAddPicture"></paper-fab>
                <paper-fab id="add" class="fab" icon="icons:add"></paper-fab>
            </div>
        </div>`;
    }

    static get observers() {
        return [
            '_updatePage(regatta)',
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

            regatta: {
                type: String,
                value: ''
            },

            _races: {
                type: Object,
                value: {}
            }

        }
    }

    _changePage(page) {

        this.importLazyGroup(page).then(function () {}.bind(this));
    }

    _updatePage(regatta) {
        let page = 'message';

        if (regatta) {
            page = 'results';

        }

        this.page = page;
    }

    _handleActionBack(e) {
        this.dispatchEvent(new CustomEvent('ctm-schedule-detail-action-back', {
            bubbles: true,
            composed: true
        }));
    }

    _handleActionEdit(e) {
        this.dispatchEvent(new CustomEvent('ctm-schedule-detail-action-edit', {
            bubbles: true,
            composed: true,
            detail: {
                regatta: JSON.parse(JSON.stringify(this._data))
            }
        }));

    }

    _handleActionDelete(e) {
        this.$.firebase.path = 'regattaPictures/' + this.regatta;
        this.$.firebase.destroy()
            .catch(() => {

                this.dispatchEvent(new CustomEvent('ctm-schedule-detail-action-delete-fail', {
                        bubbles: true,
                        composed: true
                    }));
            });
        this.$.firebase.path = 'regattaRaces/' + this.regatta;
        this.$.firebase.destroy()
            .catch(() => {

                this.dispatchEvent(new CustomEvent('ctm-schedule-detail-action-delete-fail', {
                        bubbles: true,
                        composed: true
                    }));
            });
        this.$.firebase.path = 'regattas/' + this.regatta;
        this.$.firebase.destroy()
            .then(() => {

                this.dispatchEvent(new CustomEvent('ctm-schedule-detail-action-delete', {
                        bubbles: true,
                        composed: true
                    }));
            })
            .catch(() => {

                this.dispatchEvent(new CustomEvent('ctm-schedule-detail-action-delete-fail', {
                        bubbles: true,
                        composed: true
                    }));
            });

    }

    _handleActionAddRace() {
        this.dispatchEvent(new CustomEvent('ctm-schedule-detail-action-add-race', {
            bubbles: true,
            composed: true
        }));
    }

    _handleActionAddPicture() {
        this.dispatchEvent(new CustomEvent('ctm-schedule-detail-action-add-picture', {
            bubbles: true,
            composed: true
        }));
    }
}

customElements.define('ctm-schedule-detail', CtmScheduleDetail);
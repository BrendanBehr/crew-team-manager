import {LitElement, html} from 'lit';

import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-pages/iron-pages';

import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-spinner/paper-spinner-lite';
import '@polymer/paper-toast/paper-toast';
import '@polymer/paper-styles/typography';


import 'lazy-import" group="list" href="ctm-fleet-list';
import 'lazy-import" group="detail" href="ctm-fleet-detail';
import 'lazy-import" group="edit" href="ctm-fleet-edit';
import 'lazy-import" group="create" href="ctm-fleet-create';
import 'lazy-import" group="athlete" href="ctm-fleet-roster-list';
import 'lazy-import" group="oar" href="ctm-fleet-oar-list';
import 'lazy-import" group="rigger" href="ctm-fleet-rigger-list';

export class CtmFleet extends LitElement {
    static styles = `
        :host {
            background-color: lightslategray;
            @apply(--layout-horizontal);
        }

        #pages {
            @apply(--layout-flex);
            position: relative;
        }

        #list,
        #detail,
        #edit,
        #athlete,
        #oar,
        #rigger {
            @apply(--layout-fit);
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
        <iron-pages id="pages" attr-for-selected="id" selected="[[page]]">
            <ctm-fleet-list id="list" menu-hidden$="[[wideLayout]]" page="loading" on-ctm-fleet-list-results-action-detail="_handleActionDetail"
                on-ctm-fleet-list-action-create="_handleActionCreate" team-id="[[teamId]]">
            </ctm-fleet-list>

            <ctm-fleet-detail id="detail" boat="[[_boat]]" page="loading" on-ctm-fleet-detail-action-back="_handleActionBack"
                on-ctm-fleet-detail-action-edit="_handleActionEdit" on-ctm-fleet-detail-action-delete="_handleActionDelete"
                on-ctm-fleet-detail-action-add-rigger="_handleActionAddRigger" on-ctm-fleet-detail-action-add-athlete="_handleActionAddAthlete"
                on-ctm-fleet-detail-action-add-oar="_handleActionAddOar" team-id="[[teamId]]" on-ctm-fleet-detail-action-delete-fail="_handleActionFail">
            </ctm-fleet-detail>

            <ctm-fleet-edit edit="[[_edit]]" id="edit" boat="[[_boat]]" on-ctm-fleet-edit-action-back="_handleActionBackOnce"
                on-ctm-fleet-edit-action-saved="_handleActionSaved">
            </ctm-fleet-edit>

            <ctm-fleet-create id="create" team-id="[[teamId]]" on-ctm-fleet-create-action-cancel="_handleActionCancel"
                on-ctm-fleet-create-action-created="_handleActionCreated">
            </ctm-fleet-create>

            <ctm-fleet-roster-list id="athlete" team-id="[[teamId]]" boat="[[_boat]]" page="loading" on-ctm-fleet-roster-list-action-back="_handleActionBackOnce"
                on-ctm-fleet-roster-list-action-add-athletes="_handleActionAddedAthletes" on-ctm-fleet-detail-action-fanout-fail="_handleActionFail"></ctm-fleet-roster-list>
            <ctm-fleet-oar-list id="oar" team-id="[[teamId]]" boat="[[_boat]]" page="loading" on-ctm-fleet-oar-list-action-back="_handleActionBackOnce"
                on-ctm-fleet-oar-list-action-add-oars="_handleActionAddedOars" on-ctm-fleet-detail-action-fanout-fail="_handleActionFail"></ctm-fleet-oar-list>
            <ctm-fleet-rigger-list id="rigger" team-id="[[teamId]]" boat="[[_boat]]" page="loading" on-ctm-fleet-rigger-list-action-back="_handleActionBackOnce"
                on-ctm-fleet-rigger-list-action-add-riggers="_handleActionAddedRiggers" on-ctm-fleet-detail-action-fanout-fail="_handleActionFail"></ctm-fleet-rigger-list>
        </iron-pages>

        <paper-toast id="toast" duration="4000">[[_toast]]</paper-toast>`;
    }

    static get observers() {
        return [
            '_changePage(page)'
        ]
    }

    static get properties() {
        return {
            page: {
                type: String
            },

            _edit: {
                type: Object
            },

            wideLayout: {
                type: Boolean,
                value: false,
            },

            _boat: {
                type: String
            },

            _toast: {
                type: String
            },

            teamId: String,

            athlete: {
                type: Object
            },

            oars: {
                type: Object
            },

            riggers: {
                type: Object
            }
        }
    }

    _changePage(page) {

        this.importLazyGroup(page).then(function () {
            this.page = page;
        }.bind(this));
    }

    _handleActionDetail(e) {
        this._boat = e.detail.boat;
        this.page = 'detail';
    }

    _handleActionBack(e) {
        this.page = 'list';
    }

    _handleActionCreate() {
        this.page = 'create';
    }

    _handleActionCancel(e) {
        this.page = 'list';
        this._toast = 'Cancelled Boat Create';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }

    _handleActionBackOnce(e) {
        this.page = 'detail';
    }

    _handleActionEdit(e) {

        this._edit = e.detail.boat;
        this.page = 'edit';

    }

    _handleActionSaved(e) {
        this.page = 'detail';
        this._toast = 'Boat Saved';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }

    _handleActionDelete(e) {
        this.page = 'list';
        this._toast = 'Boat Deleted';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }

    _handleActionCreated(e) {
        this.page = 'detail';
        this._boat = e.detail.boat;
        this._toast = 'Boat Created';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }

    _handleActionAddAthlete() {
        this.page = 'athlete';
    }

    _handleActionAddedAthletes(e) {
        this._toast = 'Athletes Added';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
        this.page = 'detail';
    }

    _handleActionAddOar() {
        this.page = 'oar';
    }

    _handleActionAddedOars(e) {
        this._toast = 'Oars Added';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
        this.page = 'detail';
    }

    _handleActionAddRigger() {
        this.page = 'rigger';
    }

    _handleActionAddedRiggers(e) {
        this._toast = 'Riggers Added';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
        this.page = 'detail';
    }

    _handleActionFail() {
        this.page = 'list'
        this._toast = 'You do not have permision to do that';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }
}

customElements.define('ctm-fleet', CtmFleet);
import {LitElement, html} from 'lit';

import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-pages/iron-pages';

import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-spinner/paper-spinner-lite';
import '@polymer/paper-toast/paper-toast';
import '@polymer/paper-styles/typography';



import './ctm-schedule-list';
import './ctm-schedule-detail';
import './ctm-schedule-edit';
import './ctm-schedule-create';
import './ctm-schedule-race-list';
import './ctm-schedule-picture-create';

export class CtmSchedule extends LitElement {
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
        #create,
        #race,
        #picture {
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
            <ctm-schedule-list id="list" menu-hidden$="[[wideLayout]]" on-ctm-schedule-list-results-action-detail="_handleActionDetail"
                on-ctm-schedule-list-action-create="_handleActionCreate" team-id="[[teamId]]">
            </ctm-schedule-list>

            <ctm-schedule-detail id="detail" regatta="[[_regatta]]" on-ctm-schedule-detail-action-back="_handleActionBack"
                on-ctm-schedule-detail-action-edit="_handleActionEdit" on-ctm-schedule-detail-action-delete="_handleActionDelete"
                on-ctm-schedule-detail-action-add-race="_handleActionAddRace" on-ctm-schedule-detail-action-delete-fail="_handleActionFail"
                on-ctm-schedule-detail-action-add-picture="_handleActionAddPicture">
            </ctm-schedule-detail>

            <ctm-schedule-edit edit="[[_edit]]" id="edit" regatta="[[_regatta]]" on-ctm-schedule-edit-action-back="_handleActionBackOnce"
                on-ctm-schedule-edit-action-saved="_handleActionSaved">
            </ctm-schedule-edit>

            <ctm-schedule-create id="create" team-id="[[teamId]]" on-ctm-schedule-create-action-cancel="_handleActionCancel"
                on-ctm-schedule-create-action-created="_handleActionCreated">
            </ctm-schedule-create>

            <ctm-schedule-race-list id="race" team-id="[[teamId]]" regatta="[[_regatta]]" page="loading" on-ctm-schedule-race-list-action-back="_handleActionBackOnce"
                on-ctm-schedule-race-list-action-add-race="_handleActionAddedRaces" on-ctm-schedule-race-list-action-fanout-fail="_handleActionFail">
            </ctm-schedule-race-list>

            <ctm-schedule-picture-create id="picture" regatta="[[_regatta]]" team-id="[[teamId]]" on-ctm-schedule-picture-create-action-cancel="_handleActionCanceled"
                on-ctm-schedule-picture-create-action-created="_handleActionAddedPicture" on-ctm-schedule-picture-create-action-fanout-fail="_handleActionFail">
            </ctm-schedule-picture-create>
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

            _regatta: {
                type: String
            },

            _toast: {
                type: String
            },

            teamId: String
        }
    }

    _changePage(page) {

        this.importLazyGroup(page).then(function () {}.bind(this));
    }

    _handleActionDetail(e) {
        this._regatta = e.detail.regatta;
        this.page = 'detail';
    }

    _handleActionCreate(e) {
        this.page = 'create';
    }

    _handleActionBack(e) {
        this.page = 'list';
    }

    _handleActionBackOnce(e) {
        this.page = 'detail';
    }

    _handleActionEdit(e) {

        this._edit = e.detail.regatta;
        this.page = 'edit';

    }

    _handleActionSaved(e) {
        this.page = 'detail';
        this._toast = 'Regatta Saved';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }

    _handleActionCreated(e) {
        this.page = 'detail';
        this._regatta = e.detail.regatta;
        this._toast = 'Regatta Saved';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }

    _handleActionDelete(e) {
        this.page = 'list';
        this._toast = 'Regatta Deleted';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }

    _handleActionCancel(e) {
        this.page = 'list';
        this._toast = 'Cancelled Regatta Create';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }

    _handleActionAddRace() {
        this.page = 'race';
    }

    _handleActionAddedRaces(e) {
        this._toast = 'RacesAdded';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
        this.page = 'detail';
    }

    _handleActionCanceled() {
        this.page = 'detail'
    }

    _handleActionAddPicture() {
        this.page = 'picture';
    }

    _handleActionAddedPicture() {
        this._toast = 'Pictures Added';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
        this.page = 'detail'
    }

    _handleActionFail() {
        this.page = 'list'
        this._toast = 'You do not have permision to do that';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }
}

customElements.define('ctm-schedule', CtmSchedule);
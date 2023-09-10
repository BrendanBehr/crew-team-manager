import {LitElement, html, css } from 'lit';

import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-pages/iron-pages';

import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-spinner/paper-spinner-lite';
import '@polymer/paper-toast/paper-toast';
import '@polymer/paper-styles/typography';

import './ctm-roster-list';
import './ctm-roster-detail';
import './ctm-roster-edit';
import './ctm-roster-create';
import './ctm-roster-erg-list';
import './ctm-roster-finance-create';

export class CtmRoster extends LitElement {
    static styles = css`
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
        #erg {
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
        <iron-pages id="pages" attr-for-selected="id" selected="${this.page}" page="loading" selected-attribute="selected">
            <ctm-roster-list id="list" menu-hidden="${this.wideLayout}" on-ctm-roster-list-results-action-detail="_handleActionDetail"
                on-ctm-roster-list-action-create="_handleActionCreate" team-id="${this.teamId}">
            </ctm-roster-list>

            <ctm-roster-detail id="detail" athlete="${this._athlete}" page="loading" on-ctm-roster-detail-action-back="_handleActionBack"
                on-ctm-roster-detail-action-edit="_handleActionEdit" gross="${this._gross}" on-ctm-roster-detail-action-delete="_handleActionDelete"
                on-ctm-roster-detail-action-add-erg="_handleActionAddErg" on-ctm-roster-detail-action-add-finance="_handleActionAddFinance"
                on-ctm-roster-detail-action-delete-fail="_handleActionFail">
            </ctm-roster-detail>

            <ctm-roster-edit edit="${this._edit}" id="edit" athlete="${this._athlete}" on-ctm-roster-edit-action-back="_handleActionBackOnce"
                on-ctm-roster-edit-action-saved="_handleActionSaved">
            </ctm-roster-edit>

            <ctm-roster-create id="create" team-id="${this.teamId}" on-ctm-roster-create-action-cancel="_handleActionCancel"
                on-ctm-roster-create-action-created="_handleActionCreated">
            </ctm-roster-create>

            <ctm-roster-erg-list id="erg" team-id="${this.teamId}" athlete="${this._athlete}" page="loading" on-ctm-roster-erg-list-action-back="_handleActionBackOnce"
                on-ctm-roster-erg-list-action-add-ergs="_handleActionAddedErgs" on-ctm-roster-erg-list-action-fanout-fail="_handleActionFail">
            </ctm-roster-erg-list>

            <ctm-roster-finance-create id="finance" team-id="${this.teamId}" athlete="${this._athlete}" on-ctm-roster-finance-create-action-cancel="_handleActionCanceled"
                on-ctm-roster-finance-create-action-created="_handleActionAddedFinance" on-ctm-roster-finance-create-action-fanout-fail="_handleActionFail">
            </ctm-roster-finance-create>
        </iron-pages>

        <paper-toast id="toast" duration="4000">${this._toast}</paper-toast>`;
    }

    static get observers() {
        return [
            '_changePage(page)'
        ]
    }

    static properties() {
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

            _athlete: {
                type: String
            },

            _toast: {
                type: String
            },

            teamId: String,

            _gross: Number
        }
    }

    _changePage(page) {

        this.importLazyGroup(page).then(function () {}.bind(this));
    }

    _handleActionDetail(e) {
        this._athlete = e.detail.athlete;
        this.page = 'detail';
    }

    _handleActionBack(e) {
        this.page = 'list';
    }

    _handleActionBackOnce(e) {
        this.page = 'detail';
    }

    _handleActionEdit(e) {

        this._edit = e.detail.athlete;
        this.page = 'edit';

    }

    _handleActionCreated(e) {
        this.page = 'detail';
        this._toast = 'Athlete Created';
        this._athlete = e.detail.athlete;
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }

    _handleActionSaved(e) {
        this.page = 'detail';
        this._toast = 'Athlete Saved';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }

    _handleActionCreate(e) {
        this.page = 'create';
    }

    _handleActionCancel(e) {
        this.page = 'list';
        this._toast = 'Cancelled Athlete Create';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }

    _handleActionDelete(e) {
        this.page = 'list';
        this._toast = 'Athlete Deleted';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }

    _handleActionAddErg() {
        this.page = 'erg';
    }

    _handleActionAddedErgs() {
        this._toast = 'Erg Added';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
        this.page = 'detail';
    }

    _handleActionCanceled() {
        this.page = 'detail'
    }

    _handleActionAddFinance() {
        this.page = 'finance';
    }

    _handleActionAddedFinance(e) {
        this._gross = e.detail.finance;
        this._toast = 'Finance Added';
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

customElements.define('ctm-roster', CtmRoster);
import {LitElement, html} from 'lit';

import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-pages/iron-pages';

import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-spinner/paper-spinner-lite';
import '@polymer/paper-toast/paper-toast';
import '@polymer/paper-styles/typography';



import './ctm-finance-list';
import './ctm-finance-detail';
import './ctm-finance-edit';
import './ctm-finance-create';

export class CtmFinance extends LitElement {
    static styles = `
        :host {
            background-color: lightslategray;
            @apply(--layout-horizontal);
        }

        #pages {
            @apply(--layout-flex);
            position: relative;
        }

        #list {
            @apply(--layout-fit);
        }

        #detail {
            @apply(--layout-fit);
        }

        #edit {
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
            <ctm-finance-list id="list" menu-hidden$="[[wideLayout]]" page="loading" on-ctm-finance-list-results-action-detail="_handleActionDetail"
                on-ctm-finance-list-action-create="_handleActionCreate" team-id="[[teamId]]">
            </ctm-finance-list>

            <ctm-finance-detail id="detail" finance="[[_finance]]" page="loading" on-ctm-finance-detail-action-back="_handleActionBack"
                on-ctm-finance-detail-action-edit="_handleActionEdit" on-ctm-finance-detail-action-delete="_handleActionDelete"
                on-ctm-finance-detail-action-delete-fail="_handleActionFail">
            </ctm-finance-detail>

            <ctm-finance-edit edit="[[_edit]]" id="edit" finance="[[_finance]]" on-ctm-finance-edit-action-back="_handleActionBackOnce"
                on-ctm-finance-edit-action-saved="_handleActionSaved">
            </ctm-finance-edit>

            <ctm-finance-create id="create" team-id="[[teamId]]" on-ctm-finance-create-action-cancel="_handleActionCanceled"
                on-ctm-finance-create-action-created="_handleActionCreated">
            </ctm-finance-create>
        </iron-pages>

        <paper-toast id="toast" duration="4000">[[_toast]]</paper-toast>
        `;
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

            _finance: {
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
        this._finance = e.detail.finance;
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

        this._edit = e.detail.finance;
        this.page = 'edit';

    }

    _handleActionSaved(e) {
        this.page = 'detail';
        this._toast = 'Finance Saved';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }

    _handleActionDelete(e) {
        this.page = 'list';
        this._toast = 'Finance Deleted';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }

    _handleActionCreated(e) {
        this.page = 'detail';
        this._toast = 'Finance Saved';
        this._finance = e.detail.finance;
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }

    _handleActionCanceled(e) {
        this.page = 'list';
        this._toast = 'Cancelled Finance Create';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }

    _handleActionFail() {
        this.page = 'list'
        this._toast = 'You do not have permision to do that';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }
}

customElements.define('ctm-finance', CtmFinance);
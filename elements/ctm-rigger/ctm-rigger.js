import {LitElement, html} from 'lit';

import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-pages/iron-pages';

import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-spinner/paper-spinner-lite';
import '@polymer/paper-toast/paper-toast';
import '@polymer/paper-styles/typography';



import './ctm-rigger-list';
import './ctm-rigger-detail';
import './ctm-rigger-edit';
import './ctm-rigger-create';

export class CtmRigger extends LitElement {
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
            <ctm-rigger-list id="list" menu-hidden$="[[wideLayout]]" on-ctm-rigger-list-results-action-detail="_handleActionDetail"
                on-ctm-rigger-list-action-create="_handleActionCreate" team-id="[[teamId]]">
            </ctm-rigger-list>

            <ctm-rigger-detail id="detail" rigger="[[_rigger]]" on-ctm-rigger-detail-action-back="_handleActionBack"
                on-ctm-rigger-detail-action-edit="_handleActionEdit" on-ctm-rigger-detail-action-delete="_handleActionDelete"
                on-ctm-rigger-detail-action-delete-fail="_handleActionFail">
            </ctm-rigger-detail>

            <ctm-rigger-edit edit="[[_edit]]" id="edit" rigger="[[_rigger]]" on-ctm-rigger-edit-action-back="_handleActionBackOnce"
                on-ctm-rigger-edit-action-saved="_handleActionSaved">
            </ctm-rigger-edit>


            <ctm-rigger-create id="create" team-id="[[teamId]]" on-ctm-rigger-create-action-cancel="_handleActionCancel"
                on-ctm-rigger-create-action-created="_handleActionCreated">
            </ctm-rigger-create>
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

            _rigger: {
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
        this._rigger = e.detail.rigger;
        this.page = 'detail';
    }

    _handleActionBack(e) {
        this.page = 'list';
    }

    _handleActionBackOnce(e) {
        this.page = 'detail';
    }

    _handleActionEdit(e) {

        this._edit = e.detail.rigger;
        this.page = 'edit';

    }

    _handleActionSaved(e) {
        this.page = 'detail';
        this._toast = 'Rigger Saved';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }

    _handleActionDelete(e) {
        this.page = 'list';
        this._toast = 'Rigger Deleted';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }

    _handleActionCreated(e) {
        this.page = 'detail';
        this._toast = 'Rigger Created';
        this._rigger = e.detail.rigger;
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }

    _handleActionCancel(e) {
        this.page = 'list';
        this._toast = 'Cancelled Create Rigger';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }

    _handleActionCreate(e) {
        this.page = 'create';
    }

    _handleActionFail() {
        this.page = 'list'
        this._toast = 'You do not have permision to do that';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }
}

customElements.define('ctm-rigger', CtmRigger);
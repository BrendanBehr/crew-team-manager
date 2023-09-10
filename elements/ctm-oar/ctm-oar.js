import {LitElement, html, css } from 'lit';

import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-pages/iron-pages';

import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-spinner/paper-spinner-lite';
import '@polymer/paper-toast/paper-toast';
import '@polymer/paper-styles/typography';



import './ctm-oar-list';
import './ctm-oar-detail';
import './ctm-oar-edit';
import './ctm-oar-create';

export class CtmOar extends LitElement {
    static styles = css`
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
        <iron-pages id="pages" attr-for-selected="id" selected="${this.page}">
            <ctm-oar-list id="list" menu-hidden="${this.wideLayout}" page="loading" on-ctm-oar-list-results-action-detail="_handleActionDetail"
                on-ctm-oar-list-action-create="_handleActionCreate" team-id="${this.teamId}">
            </ctm-oar-list>

            <ctm-oar-detail id="detail" oar="${this._oar}" page="loading" on-ctm-oar-detail-action-back="_handleActionBack"
                on-ctm-oar-detail-action-edit="_handleActionEdit" on-ctm-oar-detail-action-delete="_handleActionDelete"
                on-ctm-oar-detail-action-delete-fail="_handleActionFail">
            </ctm-oar-detail>

            <ctm-oar-edit edit="${this._edit}" id="edit" oar="${this._oar}" on-ctm-oar-edit-action-back="_handleActionBackOnce"
                on-ctm-oar-edit-action-saved="_handleActionSaved">
            </ctm-oar-edit>

            <ctm-oar-create id="create" team-id="${this.teamId}" on-ctm-oar-create-action-cancel="_handleActionCancel"
                team-id="${this.teamId}" on-ctm-oar-create-action-created="_handleActionCreated">
            </ctm-oar-create>
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

            _oar: {
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
        this._oar = e.detail.oar;
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

        this._edit = e.detail.oar;
        this.page = 'edit';

    }

    _handleActionSaved(e) {
        this.page = 'detail';
        this._toast = 'Oar Saved';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }

    _handleActionDelete(e) {
        this.page = 'list';
        this._toast = 'Oar Deleted';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }

    _handleActionCreated(e) {
        this.page = 'detail';
        this._toast = 'Oar Saved';
        this._oar = e.detail.oar;
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }

    _handleActionCancel(e) {
        this.page = 'list';
        this._toast = 'Cancelled Oar Create';
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

customElements.define('ctm-oar', CtmOar);
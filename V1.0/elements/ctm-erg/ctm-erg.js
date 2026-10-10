import {LitElement, html, css } from 'lit';

import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-pages/iron-pages';

import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-spinner/paper-spinner-lite';
import '@polymer/paper-toast/paper-toast';
import '@polymer/paper-styles/typography';



export class CtmErg extends LitElement {
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
            <ctm-erg-list id="list" menu-hidden="${this.wideLayout}" page="loading" on-ctm-erg-list-results-action-detail="_handleActionDetail"
                on-ctm-erg-list-action-create="_handleActionCreate" team-id="${this.teamId}">
            </ctm-erg-list>

            <ctm-erg-detail id="detail" erg="${this._erg}" page="loading" on-ctm-erg-detail-action-back="_handleActionBack"
                on-ctm-erg-detail-action-edit="_handleActionEdit" on-ctm-erg-detail-action-delete="_handleActionDelete"
                on-ctm-erg-detail-action-delete-fail="_handleActionFail">
            </ctm-erg-detail>

            <ctm-erg-edit edit="${this._edit}" id="edit" erg="${this._erg}" on-ctm-erg-edit-action-back="_handleActionBackOnce"
                on-ctm-erg-edit-action-saved="_handleActionSaved">
            </ctm-erg-edit>

            <ctm-erg-create id="create" team-id="${this.teamId}" on-ctm-erg-create-action-cancel="_handleActionCancel"
                on-ctm-erg-create-action-created="_handleActionCreated">
            </ctm-erg-create>
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

            _erg: {
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
        this._erg = e.detail.erg;
        this.page = 'detail';
    }

    _handleActionCreate() {
        this.page = 'create';
    }

    _handleActionBack() {
        this.page = 'list';
    }

    _handleActionBackOnce(e) {
        this.page = 'detail';
    }

    _handleActionEdit(e) {
        this._edit = e.detail.erg;
        this.page = 'edit';

    }

    _handleActionSaved(e) {
        this.page = 'detail';
        this._toast = 'Erg Saved';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }

    _handleActionDelete(e) {
        this.page = 'list';
        this._toast = 'Erg Deleted';
        this.$.toast.fitInto = this.$.pages;
    }

    _handleActionCreated(e) {
        this.page = 'detail';
        this._toast = 'Erg Created';
        this._erg = e.detail.erg;
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }

    _handleActionCancel(e) {
        this.page = 'list';
        this._toast = 'Cancelled Erg Create';
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

customElements.define('ctm-erg', CtmErg);
import {LitElement, html, css } from 'lit';

import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-pages/iron-pages';

import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-spinner/paper-spinner-lite';
import '@polymer/paper-toast/paper-toast';
import '@polymer/paper-styles/typography';



import './ctm-picture-list';
import './ctm-picture-detail';
import './ctm-picture-edit';
import './ctm-picture-create';

export class CtmPicture extends LitElement {
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
            <ctm-picture-list id="list" menu-hidden="${this.wideLayout}" page="loading" on-ctm-picture-list-results-action-detail="_handleActionDetail"
                on-ctm-picture-list-action-create="_handleActionCreate" team-id="${this.teamId}">
            </ctm-picture-list>

            <ctm-picture-detail id="detail" picture="${this.picture}" page="loading" on-ctm-picture-detail-action-back="_handleActionBack"
                on-ctm-picture-detail-action-edit="_handleActionEdit" on-ctm-picture-detail-action-delete="_handleActionDelete"
                on-ctm-picture-detail-action-delete-fail="_handleActionFail">
            </ctm-picture-detail>

            <ctm-picture-edit edit="${this._edit}" id="edit" picture="${this.picture}" on-ctm-picture-edit-action-back="_handleActionBackOnce"
                on-ctm-picture-edit-action-saved="_handleActionSaved">
            </ctm-picture-edit>

            <ctm-picture-create id="create" team-id="${this.teamId}" on-ctm-picture-create-action-cancel="_handleActionCancel"
                on-ctm-picture-create-action-created="_handleActionCreated">
            </ctm-picture-create>
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

            picture: {
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
        this.picture = e.detail.picture;
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

        this._edit = e.detail.picture;
        this.page = 'edit';

    }

    _handleActionSaved(e) {
        this.page = 'detail';
        this._toast = 'Picture Saved';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }

    _handleActionDelete(e) {
        this.page = 'list';
        this._toast = 'Picture Deleted';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }

    _handleActionCreated(e) {
        this.page = 'detail';
        this._toast = 'Picture Created';
        this.picture = e.detail.picture;
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }

    _handleActionCancel(e) {
        this.page = 'list';
        this._toast = 'Cancelled Picture Create';
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

customElements.define('ctm-picture', CtmPicture);
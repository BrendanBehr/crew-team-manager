import {LitElement, html, css } from 'lit';

import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-pages/iron-pages';

import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-spinner/paper-spinner-lite';
import '@polymer/paper-toast/paper-toast';
import '@polymer/paper-styles/typography';



import './ctm-race-list';
import './ctm-race-detail';
import './ctm-race-edit';
import './ctm-race-create';

export class CtmRace extends LitElement {
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
                <ctm-race-list id="list" menu-hidden="${this.wideLayout}" page="loading" on-ctm-race-list-results-action-detail="_handleActionDetail"
                    on-ctm-race-list-action-create="_handleActionCreate" team-id="${this.teamId}">
                </ctm-race-list>

                <ctm-race-detail id="detail" race="${this._race}" page="loading" on-ctm-race-detail-action-back="_handleActionBack"
                    on-ctm-race-detail-action-edit="_handleActionEdit" on-ctm-race-detail-action-delete="_handleActionDelete"
                    on-ctm-race-detail-action-delete-fail="_handleActionFail">
                </ctm-race-detail>

                <ctm-race-edit edit="${this._edit}" id="edit" race="${this._race}" on-ctm-race-edit-action-back="_handleActionBackOnce"
                    on-ctm-race-edit-action-saved="_handleActionSaved">
                </ctm-race-edit>

                <ctm-race-create id="create" team-id="${this.teamId}" on-ctm-race-create-action-cancel="_handleActionCancel"
                    on-ctm-race-create-action-created="_handleActionCreated">
                </ctm-race-create>
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

            _race: {
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
        this._race = e.detail.race;
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

        this._edit = e.detail.race;
        this.page = 'edit';

    }

    _handleActionSaved(e) {
        this.page = 'detail';
        this._toast = 'Race Saved';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }

    _handleActionDelete(e) {
        this.page = 'list';
        this._toast = 'Race Deleted';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }

    _handleActionCreated(e) {
        this.page = 'detail';
        this._toast = 'Race Created';
        this._race = e.detail.race;
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }

    _handleActionCancel(e) {
        this.page = 'list';
        this._toast = 'Cancelled Race Create';
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

customElements.define('ctm-race', CtmRace);
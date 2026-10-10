import {LitElement, html, css } from 'lit';

import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-pages';

import '@polymer/paper-icon-button';
import '@polymer/paper-spinner/paper-spinner';
import '@polymer/paper-toast';
import '@polymer/paper-styles/paper-styles';

export class CtmTeam extends LitElement {
    static styles = css`
    :host {
        background-color: lightslategray;
        @apply(--layout-horizontal);
    }

    #pages {
        @apply(--layout-flex);
        position: relative;
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

            <ctm-team-detail menu-hidden="${this.wideLayout}" id="detail" team="${this.teamId}" @ctm-team-detail-action-edit="${this._handleActionEdit}">
            </ctm-team-detail>

            <ctm-team-edit edit="${this._edit}" id="edit" team="${this.teamId}" @ctm-team-edit-action-back="${this._handleActionBackOnce}"
                @ctm-team-edit-action-saved="${this._handleActionSaved}">
            </ctm-team-edit>
        </iron-pages>

        <paper-toast id="toast" duration="4000">${this._toast}</paper-toast>
    `;
  }
  static properties = {
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

        _team: {
            type: String
        },

        _toast: {
            type: String
        },

        teamId: String
    }

    _changePage(page) {

    }

    _handleActionBackOnce(e) {
        this.page = 'detail';
    }

    _handleActionEdit(e) {

        this._edit = e.detail.team;
        this.page = 'edit';

    }

    _handleActionSaved(e) {
        this.page = 'detail';
        this._toast = 'Team Saved';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }
}
customElements.define('ctm-team', CtmTeam);
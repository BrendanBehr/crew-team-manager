import {LitElement, html, css } from 'lit';


import '@polymer/iron-icons';
import '@polymer/iron-pages';

import '@polymer/app-layout';
import '@polymer/app-layout/app-drawer/app-drawer';
import '@polymer/app-layout/app-header/app-header';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import '@polymer/app-layout/app-header-layout/app-header-layout';

import '@polymer/paper-icon-button';
import '@polymer/paper-spinner/paper-spinner';

export class CtmTeamDetail extends LitElement {
    static styles = css`
    :host {
       background-color: lightslategray;
       @apply(--layout-horizontal);
       @apply(--paper-font-common-base);
   }

    :host([menu-hidden]) #menu {
       display: none;
   }

   #pages {
       @apply(--layout-vertical);
       @apply(--layout-flex);
   }

   #loading {
       @apply(--layout-flex);
   }

   #layout {
       @apply(--layout-flex);
   }

   #results {
       @apply(--layout-flex);
   }

   #message {
       @apply(--layout-flex);
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
        <app-header reveals>
            <app-toolbar id="toolbar">
                <paper-icon-button id="menu" icon="menu" @click="${this._handleActionMenu}"></paper-icon-button>
                <div main-title id="title">Team: ${this._data.teamName}</div>
                <paper-icon-button id="edit" icon="create" @click="${this._handleActionEdit}"></paper-icon-button>
                <paper-icon-button id="logout" icon="exit-to-app" @click="${this._handleActionLogout}"></paper-icon-button>
            </app-toolbar>
        </app-header>
        <iron-pages id="pages" attr-for-selected="id" selected="${this.page}">
            <ctm-team-detail-loading id="loading"></ctm-team-detail-loading>
            <ctm-team-detail-results id="results" data="${this._data}"></ctm-team-detail-results>
            <ctm-team-detail-message id="message"></ctm-team-detail-message>
        </iron-pages>
    `;
  }
  
  static properties = {
        data: {
            type: Object,
        }
    }

    static get observers() {
        return [
            '_updatePage(team)',
            '_changePage(page)'
        ];
    }

    _changePage(page) {

        this.importLazyGroup(page).then(function () {}.bind(this));
    }

    _updatePage(team) {

        if (team === undefined) {
            return;
        }

        let page = 'message';

        if (team) {
            page = 'results';

        }

        this.page = page;
    }

    _handleActionLogout() {
        this.dispatchEvent(new CustomEvent(CtmStage.is + '-action-logout', {
            bubbles: true,
            composed: true
        }));
    }

    _handleActionMenu() {
        this.dispatchEvent(new CustomEvent(CtmTeamDetail.is + '-action-menu', {
            bubbles: true,
            composed: true
        }));
    }

    _handleActionEdit(e) {
        this.dispatchEvent(new CustomEvent(CtmTeamDetail.is + '-action-edit', {
            bubbles: true,
            composed: true,
            detail: {
                team: JSON.parse(JSON.stringify(this._data))
            }
        }));

    }

    _handleActionDelete(e) {
        this.$.firebase.destroy();
        this.dispatchEvent(new CustomEvent(CtmTeamDetail.is + '-action-delete', {
            bubbles: true,
            composed: true
        }));
    }
}
customElements.define('ctm-team-detail', CtmTeamDetail);
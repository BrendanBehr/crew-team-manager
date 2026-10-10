import {LitElement, html, css } from 'lit';

import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-pages';

import '@polymer/paper-icon-button';
import '@polymer/paper-spinner/paper-spinner';
import '@polymer/paper-toast';
import '@polymer/paper-styles/paper-styles';

import './ctm-compare-list.js';
import './ctm-compare-detail.js';

export class CtmCompare extends LitElement {
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
   #detail {
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
    <iron-pages id="pages" attr-for-selected="id" selected="${this.page}" selected-attribute="selected">
        <ctm-compare-list id="list" menu-hidden="${this.wideLayout}" page="loading" team-id="${this.teamId}" on-ctm-compare-list-results-action-detail="_handleActionDetail">
        </ctm-compare-list>

        <ctm-compare-detail id="detail" athletes="${this._athletes}" page="loading" team-id="${this.teamId}" on-ctm-compare-detail-action-back="_handleActionBack">
        </ctm-compare-detail>
    </iron-pages>

    <paper-toast id="toast" duration="4000">${this._toast}</paper-toast>
    `;
  }

  static get observers() {
      return [
          '_changePage(page)'
      ]
    }

    static properties = {
        page: {
            type: String,
            value: 'list'
        },

        _edit: {
            type: Object
        },

        wideLayout: {
            type: Boolean,
            value: false,
        },

        teamId: String,

        _athletes: {
            type: Object,
            value: {
                athlete1: '',
                athlete2: ''
            }
        }
    }

    _changePage(page) {

        this.importLazyGroup(page).then(function () {}.bind(this));
    }

    _handleActionDetail(e) {
        this._athletes.athlete1 = e.detail.firstAthlete;
        this._athletes.athlete2 = e.detail.secondAthlete;
        this.page = 'detail';
    }

    _handleActionBack(e) {
        this.page = 'list';
    }

    _handleActionCompareError(e) {
        this._toast = 'Please select two athletes to compare';
        this.$.toast.fitInto = this.$.pages;
        this.$.toast.open();
    }
}
customElements.define('ctm-compare', CtmCompare);

import {LitElement, html} from 'lit';
import { lazy } from 'lit-element-lazy';

import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-a11y-keys-behavior/iron-a11y-keys-behavior.js';
import '@polymer/iron-pages';
import '@polymer/paper-toast';

import '../ctm-login/ctm-login.js';
import '../ctm-stage/ctm-stage.js';

export class CtmApp extends LitElement {
  static properties = {
    _page: String,

    _toast: {
        type: String,
    },

    _userId: String,

    _data: Object,

    _teamId: String
  };

  constructor() {
    super();
    this._page = 'login';
  }

  render() {
    return html`
    <iron-pages id="pages" attr-for-selected="id" selected="${this._page}">
        <ctm-login id="login" @login-success=${this._updatePage}></ctm-login>
        <ctm-stage
            id="stage" 
            on-ctm-stage-action-logout="${this._handleActionLogout}" 
            team-id="${this._teamId}" 
            page="team"
            loading="lazy">
        </ctm-stage>
    </iron-pages>

    <paper-toast id="toast" duration="4000">${this._toast}</paper-toast>
    `;
  }

 static get observers() {
      return [
          '_dataChanged(_data.splices)'
      ]
  }

  _handleActionLogout() {
      this.$.auth.signOut()
          .then(() => {
              this._toast = 'User Logged Out';
              this.$.toast.fitInto = this.$.pages;
              this.$.toast.open();
          })
          .catch((err) => {
              console.log(err);
          });

  }

  _dataChanged(dataSplices) {

    if (dataSplices) {
        if (dataSplices.indexSplices[0].object[8]) {
            let data = dataSplices.indexSplices[0].object[8];
            this._teamId = data.$val;

        }
    }
}

  _updatePage(firebaseUser) {
    let page = 'login';

    if (firebaseUser) {
        this._userId = firebaseUser.uid;
        page = 'stage';
      }
    lazy(() => {
    });
  }
}
customElements.define('ctm-app', CtmApp);

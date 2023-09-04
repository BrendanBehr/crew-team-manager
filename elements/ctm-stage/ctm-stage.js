import {LitElement, html, css} from 'lit';

import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-a11y-keys-behavior/iron-a11y-keys-behavior.js';

import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';

import '../ctm-compare/ctm-compare.js';
import '../ctm-team/ctm-team.js';
import '../ctm-roster/ctm-roster.js';
import '../ctm-picture/ctm-picture.js';
import '../ctm-finance/ctm-finance.js';
import '../ctm-schedule/ctm-schedule.js';
import '../ctm-fleet/ctm-fleet.js';
import '../ctm-erg/ctm-erg.js';
import '../ctm-oar/ctm-oar.js';
import '../ctm-race/ctm-race.js';
import '../ctm-rigger/ctm-rigger.js';

export class CtmStage extends LitElement {
  static properties = {
    token: {
        type: Object
    },

    firebase: {
        type: Object
    }
  };

  static styles = `
  :host {
     @apply(--layout-horizontal);
 }


 #layout {
     @apply(--layout-flex);
 }

 #pages {

     @apply(--layout-fit);
     background-color: #2E7D32;
     @apply(--layout-horizontal);
 }

 .page {
     @apply(--layout-flex);
 }

 button {
     font-size: 18px;
 }

 #drawer {
     --paper-drawer-shadow: {
         height: 24px;
         box-shadow: inset 0 24px 4px -4px rgba(0, 0, 0, 0.4);
     }
     ;
 }
  `;

  constructor() {
    super();
  }
  get _username() {
    return this.renderRoot?.querySelector('#username').value ?? '';
  }
  get _password() {
    return this.renderRoot?.querySelector('#password').value ?? '';
  }

  render() {
    return html`<app-drawer-layout id="layout">
    <iron-pages id="pages" attr-for-selected="id" selected="[[page]]">
        <ctm-roster id="roster" class="page" page="list" on-ctm-stage-action-logout="_handleActionLogout"
            on-ctm-roster-list-action-menu="_toggleDrawer" wide-layout$="[[_wideLayout]]" team-id="[[teamId]]"></ctm-roster>
        <ctm-fleet id="fleet" class="page" page="list" on-ctm-stage-action-logout="_handleActionLogout"
            on-ctm-fleet-list-action-menu="_toggleDrawer" wide-layout$="[[_wideLayout]]" team-id="[[teamId]]"></ctm-fleet>
        <ctm-schedule id="schedule" class="page" page="list" on-ctm-stage-action-logout="_handleActionLogout"
            on-ctm-schedule-list-action-menu="_toggleDrawer" wide-layout$="[[_wideLayout]]" team-id="[[teamId]]"></ctm-schedule>
        <ctm-erg id="erg" class="page" page="list" on-ctm-stage-action-logout="_handleActionLogout" on-ctm-erg-list-action-menu="_toggleDrawer"
            wide-layout$="[[_wideLayout]]" team-id="[[teamId]]"></ctm-erg>
        <ctm-finance id="finance" class="page" page="list" on-ctm-stage-action-logout="_handleActionLogout"
            on-ctm-finance-list-action-menu="_toggleDrawer" wide-layout$="[[_wideLayout]]" team-id="[[teamId]]"></ctm-finance>
        <ctm-oar id="oar" class="page" page="list" on-ctm-stage-action-logout="_handleActionLogout" on-ctm-oar-list-action-menu="_toggleDrawer"
            wide-layout$="[[_wideLayout]]" team-id="[[teamId]]"></ctm-oar>
        <ctm-race id="race" class="page" page="list" on-ctm-stage-action-logout="_handleActionLogout"
            on-ctm-race-list-action-menu="_toggleDrawer" wide-layout$="[[_wideLayout]]" team-id="[[teamId]]"></ctm-race>
        <ctm-rigger id="rigger" class="page" page="list" on-ctm-stage-action-logout="_handleActionLogout"
            on-ctm-rigger-list-action-menu="_toggleDrawer" wide-layout$="[[_wideLayout]]" team-id="[[teamId]]"></ctm-rigger>
        <ctm-picture id="picture" class="page" page="list" on-ctm-stage-action-logout="_handleActionLogout"
            on-ctm-picture-list-action-menu="_toggleDrawer" wide-layout$="[[_wideLayout]]" team-id="[[teamId]]"></ctm-picture>
        <ctm-team id="team" class="page" page="detail" on-ctm-stage-action-logout="_handleActionLogout"
            on-ctm-team-detail-action-menu="_toggleDrawer" wide-layout$="[[_wideLayout]]" team-id="[[teamId]]"></ctm-team>
        <ctm-compare id="compare" class="page" page="list" on-ctm-stage-action-logout="_handleActionLogout"
            on-ctm-compare-list-action-menu="_toggleDrawer" wide-layout$="[[_wideLayout]]" team-id="[[teamId]]"></ctm-compare>
    </iron-pages>

    <app-drawer id="drawer" slot="drawer" opened$="[[_wideLayout]]" persistent$="[[_wideLayout]]">
        <paper-listbox>
            <paper-icon-item page="compare" on-tap="_handleMenuClick">
                <iron-icon page="compare" icon="supervisor-account"></iron-icon>
                Compare
            </paper-icon-item>
            <paper-icon-item page="erg" on-tap="_handleMenuClick">
                <iron-icon page="erg" icon="places:fitness-center"></iron-icon>
                Erg
            </paper-icon-item>
            <paper-icon-item page="finance" on-tap="_handleMenuClick">
                <iron-icon page="finance" icon="editor:attach-money"></iron-icon>
                Finance
            </paper-icon-item>
            <paper-icon-item page="fleet" on-tap="_handleMenuClick">
                <iron-icon page="fleet" icon="maps:directions-boat"></iron-icon>
                Fleet
            </paper-icon-item>
            <paper-icon-item page="oar" on-tap="_handleMenuClick">
                <iron-icon page="oar" icon="av:shuffle" on-tap="_handleMenuClick"></iron-icon>
                Oar
            </paper-icon-item>
            <paper-icon-item page="picture" on-tap="_handleMenuClick">
                <iron-icon page="picture" icon="image:camera-roll"></iron-icon>
                Picture
            </paper-icon-item>
            <paper-icon-item page="race" on-tap="_handleMenuClick">
                <iron-icon page="race" icon="gavel"></iron-icon>
                Race
            </paper-icon-item>
            <paper-icon-item page="rigger" on-tap="_handleMenuClick">
                <iron-icon page="rigger" icon="build"></iron-icon>
                Rigger
            </paper-icon-item>
            <paper-icon-item page="roster" on-tap="_handleMenuClick">
                <iron-icon page="roster" icon="rowing"></iron-icon>
                Roster
            </paper-icon-item>
            <paper-icon-item page="schedule" on-tap="_handleMenuClick">
                <iron-icon page="schedule" icon="assignment"></iron-icon>
                Schedule
            </paper-icon-item>
            <paper-icon-item page="team" on-tap="_handleMenuClick">
                <iron-icon page="team" icon="home"></iron-icon>
                Team
            </paper-icon-item>
        </paper-listbox>
    </app-drawer>
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
            _wideLayout: {
                type: Boolean,
                value: false,
            },

            teamId: String

        }
    }

    _changePage(page) {

        this.importLazyGroup(page).then(function () {}.bind(this));
    }

    _handleActionLogout() {
        this.page = 'team';
    }

    connectedCallback() {
        super.connectedCallback();
    }

    _toggleDrawer() {
        if (!this._wideLayout) {
            this.$.drawer.toggle();
        }
    }

    _handleMenuClick(e) {
        let page = e.target.getAttribute('page');
        this.page = page;
        this._toggleDrawer();
    }
}
customElements.define('ctm-stage', CtmStage);

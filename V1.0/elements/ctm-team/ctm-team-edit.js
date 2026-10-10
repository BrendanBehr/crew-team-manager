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

export class CtmTeamDetailEdit extends LitElement {
    static styles = css`
    :host {
       background-color: lightslategray;
       @apply(--layout-horizontal);
       @apply(--paper-font-common-base);
   }

   #layout {
       @apply(--layout-flex);
   }

   #toolbar {
       background-color: #43a047;
       color: #fff;
   }

   #editor {
       background-color: white;
       @apply(--layout-flex);
   }

   paper-input {
       padding: 0px 16px
   }

   paper-dropdown-menu {
       padding: 0px 16px
   }

   #toggle-button {
       --paper-toggle-button-checked-bar-color: var(--paper-green-500);
       --paper-toggle-button-checked-button-color: var(--paper-green-500);
       --paper-toggle-button-checked-ink-color: var(--paper-green-500);
       --paper-toggle-button-unchecked-bar-color: var(--paper-teal-500);
       --paper-toggle-button-unchecked-button-color: var(--paper-teal-500);
       --paper-toggle-button-unchecked-ink-color: var(--paper-teal-500);
   }
    `;

  constructor() {
    super();
  }

  render() {
    return html`
    <app-header-layout id="layout">

        <app-header reveals>
            <app-toolbar id="toolbar">
                <paper-icon-button id="back" icon="arrow-back" @click="${this._handleActionBack}"></paper-icon-button>
                <div main-title id="title">Edit</div>
                <paper-icon-button id="save" icon="check" @click="${this._handleActionSave}"></paper-icon-button>
            </app-toolbar>
        </app-header>

        <div id="editor">
            <form is="iron-form" id="form" method="post" action="/form/handler">
                <paper-input id="team-name" label="team name" value="${this.edit.teamName}"></paper-input>
                <paper-input id="street-address" label="street address" value="${this.edit.streetAddress}"></paper-input>
                <paper-input id="city" label="city" value="${this.edit.city}"></paper-input>
                <paper-input id="state" label="state" value="${this.edit.state}"></paper-input>
                <paper-input id="location-image" label="location image" value="${this.edit.locationImage}"></paper-input>
                <paper-input id="color" label="color" value="${this.edit.color}"></paper-input>
            </form>
        </div>
    `;
  }
  
  static properties = {
        edit: {
            type: Object
        },

        team: {
            type: String
        },

        _drive: {
            type: Boolean,
            value: false
        }
    }

    static get observers() {
        return [
            '_updatePage(team)',
            '_changePage(page)'
        ];
    }

    _handleActionBack(e) {
        this.dispatchEvent(new CustomEvent(CtmTeamEdit.is + '-action-back', {
            bubbles: true,
            composed: true
        }));
    }

    _handleActionSave(e) {
        this.$.firebase.data = JSON.parse(JSON.stringify(this.edit));
        this.$.firebase.saveValue('teams', this.team)
            .then(() => {
                this.dispatchEvent(new CustomEvent(CtmTeamEdit.is + '-action-saved', {
                    bubbles: true,
                    composed: true
                }));
            });


    }
}
customElements.define('ctm-team-detail-Edit', CtmTeamDetailEdit);
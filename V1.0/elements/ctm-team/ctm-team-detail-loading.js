import {LitElement, html, css } from 'lit';
import '@polymer/paper-spinner/paper-spinner';

export class CtmTeamDetailLoading extends LitElement {
    static styles = css`
    :host {
           background-color: white;
           @apply(--layout-horizontal);
           @apply(--layout-center-justified);
       }

       #layout {
           @apply(--layout-vertical);
           @apply(--layout-center-justified);
       }

       #spinner {
           --paper-spinner-color: var(--paper-green-700);
       }
   }
    `;

  constructor() {
    super();
  }

  render() {
    return html`
    <div id="layout">
            <paper-spinner-lite active id="spinner"></paper-spinner-lite>
        </div>
    `;
  }
  static properties = {
        data: {
            type: Object,
        }
    }
}
customElements.define('ctm-team-detail-loading', CtmTeamDetailLoading);
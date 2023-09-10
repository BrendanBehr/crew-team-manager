import {LitElement, html, css } from 'lit';

export class CtmTeamDetailResults extends LitElement {
    static styles = css`
    :host {
       background-color: white;
       @apply(--layout-horizontal);
   }

   #content {
       background-color: lightslategray;
       @apply(--layout-vertical);
       @apply(--layout-flex);
   }

   #card {
       background-color: white;
       @apply(--layiout-horizontal);
       @apply(--layout-flex);
   }

   #team-avatar {
       @apply(--layout-horizontal);
       @apply(--layout-center-justified);
       margin: 8px;
   }

   #team-name {
       font-size: 24px;
       text-align: Center;
       font-style: bold;
       padding-bottom: 18px;
       border-bottom: solid 1px grey;
   }

   #subhead {
       font-weight: bold;
   }

   #team-location {
       border-bottom: solid 1px grey;
       padding: 16px;
   }

   #team-image {
       border-bottom: solid 1px grey;
       padding: 16px;
   }

   #team-detail {
       border-bottom: solid 1px grey;
       padding: 16px;
   }

   #image {
       @apply(--layout-flex);
   }
    `;

  constructor() {
    super();
  }

  render() {
    return html`
    <div id="content">
        <paper-card id="team">
            <ctm-avatar id="team-avatar" value="${this.data.teamName}" large></ctm-avatar>
            <div id="team-name">
                ${this.data.teamName}
            </div>
            <div id="team-location">
                <div id="subhead">
                    Location:
                </div>
                <div id="location">
                    ${this.data.streetAddress}, ${this.data.city}, ${this.data.state}
                </div>
            </div>
            <div id="team-detail">
                <div id="subhead">
                    Color:
                </div>
                <div id="color">
                    Team Color: ${this.data.color}
                </div>
            </div>
            <div id="team-image">
                <div id="subhead">
                    Logo:
                </div>
                <div id="image">
                    <iron-image src="${this.data.logo}"></iron-image>
                </div>
            </div>
        </paper-card>
    </div>
    `;
  }
  static properties = {
        data: {
            type: Object,
        }
    }
}
customElements.define('ctm-team-detail-results', CtmTeamDetailResults);
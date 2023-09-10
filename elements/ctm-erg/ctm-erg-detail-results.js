import {LitElement, html, css } from 'lit';

import '@lit-labs/virtualizer';
import '@lit-labs/virtualizer';

import '@polymer/paper-card/paper-card';

import '../ctm-avatar/ctm-avatar';

export class CtmErgDetailResults extends LitElement {
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

        #erg-avatar {
            @apply(--layout-horizontal);
            @apply(--layout-center-justified);
            margin: 8px;
        }

        #erg-number {
            font-size: 24px;
            text-align: Center;
            font-style: bold;
            padding-bottom: 18px;
            border-bottom: solid 1px grey;
        }

        #subhead {
            font-weight: bold;
        }

        #erg-location {
            border-bottom: solid 1px grey;
            padding: 16px;
        }

        #erg-details {
            border-bottom: solid 1px grey;
            padding: 16px;
        }
    `;
                
    constructor() {
        super();
    }

    render() {
        return html`

        <div id="content">

            <paper-card id="erg">
                <ctm-avatar id="erg-avatar" class="erg-avatar" value="${this.data.number} % 10" large></ctm-avatar>
                <div id="erg-number">
                    ${this.data.number}
                </div>
                <div id="erg-location">
                    <div id="subhead">
                        Location:
                    </div>
                    <div id="location">
                        ${this.data.location}
                    </div>
                </div>
                <div id="erg-details">
                    <div id="team">
                        Team: ${this.team.teamName}
                    </div>
                    <div id="subhead">
                        Details:
                    </div>
                    <div id="model">
                        Model: ${this.data.model}
                    </div>
                    <div id="screen-type">
                        Screen Type: ${this.data.screenType}
                    </div>
                    <div id="condition">
                        Condition: ${this.data.condition}
                    </div>
                </div>

            </paper-card>
        </div>`;
    }

    static properties() {
        return {
            data: {
                type: Object,
            },

            team: {
                type: Object
            }
        }
    }
}

customElements.define('ctm-erg-detail-results', CtmErgDetailResults);
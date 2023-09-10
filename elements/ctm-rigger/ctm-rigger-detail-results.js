import {LitElement, html, css } from 'lit';

import '@lit-labs/virtualizer';
import '@lit-labs/virtualizer';

import '@polymer/paper-card/paper-card';

import '../ctm-avatar/ctm-avatar';

export class CtmRiggerDetailResults extends LitElement {
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

        #rigger-avatar {
            @apply(--layout-horizontal);
            @apply(--layout-center-justified);
            margin: 8px;
        }

        #rigger-name {
            font-size: 24px;
            text-align: Center;
            font-style: bold;
            padding-bottom: 18px;
            border-bottom: solid 1px grey;
        }

        #subhead {
            font-weight: bold;
        }

        #rigger-details {
            border-bottom: solid 1px grey;
            padding: 16px;
        }
    `;
        
    constructor() {
        super();

        this.boat = {
            name : ''
        };

        this.data = {
            side : '',
            style : '',
            type : '',
            seat : ''
        },

        this.team = {
            teramName : ''
        };

    }

    render() {
        return html`
        <div id="content">

            <paper-card id="rigger">
                <ctm-avatar id="rigger-avatar" value="${this.data.side}" large></ctm-avatar>
                <div id="rigger-name">
                    ${this.boat.name}
                </div>
                <div id="rigger-Details">
                    <div id="subhead">
                        Details:
                    </div>
                    <div id="team">
                        Team: ${this.team.teamName}
                    </div>
                    <div id="side">
                        Side: ${this.data.side}
                    </div>
                    <div id="style">
                        Style: ${this.data.style}
                    </div>
                    <div id="type">
                        Type: ${this.data.type}
                    </div>
                    <div id="seat">
                        Seat: ${this.data.seat}
                    </div>
                </div>

            </paper-card>
        </div>`;
    }

    static properties() {
        return {
            data: {
                type: Object
            },

            boat: {
                type: Object
            },

            boatName: {
                type: String
            },

            team: {
                type: Object
            }
        }
    }
}

customElements.define('ctm-rigger-detail-results', CtmRiggerDetailResults);
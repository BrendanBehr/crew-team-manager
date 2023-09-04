import {LitElement, html} from 'lit';

import '@polymer/iron-list/iron-list';
import '@polymer/iron-list/iron-list';

import '@polymer/paper-card/paper-card';

import '../ctm-avatar/ctm-avatar';

export class CtmRaceDetailResults extends LitElement {
    static styles = `
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

        #race-avatar {
            @apply(--layout-horizontal);
            @apply(--layout-center-justified);
            margin: 8px;
        }

        #race-name {
            font-size: 24px;
            text-align: Center;
            font-style: bold;
            padding-bottom: 18px;
            border-bottom: solid 1px grey;
        }

        #subhead {
            font-weight: bold;
        }

        #race-details {
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

                <paper-card id="race">
                    <ctm-avatar id="race-avatar" value="[[data.eventName]]" large></ctm-avatar>
                    <div id="race-name">
                        [[data.eventName]]
                    </div>
                    <div id="race-details">
                        <div id="subhead">
                            Details:
                        </div>
                        <div id="race-time">
                            Race Time: [[data.raceTime]]
                        </div>
                        <div id="launch-time">
                            Suggested Launch Time: [[data.suggestedLaunchTime]]
                        </div>
                        <div id="bow-number">
                            Bow Number: [[data.bowNumber]]
                        </div>
                    </div>

                </paper-card>
            </div>`;
    }

    static get properties() {
        return {
            data: {
                type: Object,
            }
        }
    }
}

customElements.define('ctm-race-detail-results', CtmRaceDetailResults);
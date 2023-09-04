import {LitElement, html} from 'lit';

import '@polymer/iron-list/iron-list';
import '@polymer/iron-list/iron-list';

import '@polymer/paper-card/paper-card';

import '../ctm-avatar/ctm-avatar';

export class CtmErgDetailResults extends LitElement {
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
                <ctm-avatar id="erg-avatar" class="erg-avatar" value="[[data.number]] % 10" large></ctm-avatar>
                <div id="erg-number">
                    [[data.number]]
                </div>
                <div id="erg-location">
                    <div id="subhead">
                        Location:
                    </div>
                    <div id="location">
                        [[data.location]]
                    </div>
                </div>
                <div id="erg-details">
                    <div id="team">
                        Team: [[team.teamName]]
                    </div>
                    <div id="subhead">
                        Details:
                    </div>
                    <div id="model">
                        Model: [[data.model]]
                    </div>
                    <div id="screen-type">
                        Screen Type: [[data.screenType]]
                    </div>
                    <div id="condition">
                        Condition: [[data.condition]]
                    </div>
                </div>

            </paper-card>
        </div>`;
    }

    static get properties() {
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
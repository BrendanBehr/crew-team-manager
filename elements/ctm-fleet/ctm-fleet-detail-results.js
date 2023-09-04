import {LitElement, html} from 'lit';

import '@polymer/iron-list/iron-list';

import '@polymer/paper-card/paper-card';

import '../ctm-avatar/ctm-avatar';

export class CtmFleetDetailResults extends LitElement {
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

        #boat-avatar {
            @apply(--layout-horizontal);
            @apply(--layout-center-justified);
            margin: 8px;
        }

        #boat-name {
            font-size: 24px;
            text-align: Center;
            font-style: bold;
            padding-bottom: 18px;
            border-bottom: solid 1px grey;
        }

        #subhead {
            font-weight: bold;
        }

        #boat-info {
            border-bottom: solid 1px grey;
            padding: 16px;
        }

        #boat-athletes {
            border-bottom: solid 1px grey;
            padding: 16px;
        }

        #boat-oars {
            border-bottom: solid 1px grey;
            padding: 16px;
        }

        #boat-riggers {
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

            <paper-card id="boat">
                <ctm-avatar id="boat-avatar" value="[[data.name]]" large></ctm-avatar>
                <div id="boat-name">
                    [[data.name]]
                </div>
                <div id="boat-info">
                    <div id="subhead">
                        Basic inforomation:
                    </div>
                    <div id="size">
                        Size: [[data.size]]
                    </div>
                    <div id="rigging">
                        Rigging: [[data.rigging]]
                    </div>
                    <div id="type">
                        Type: [[data.type]]
                    </div>
                    <div id="manufacturer">
                        Manufacturer: [[data.manufacturer]]
                    </div>
                    <div id="team">
                        Team: [[team.teamName]]
                    </div>
                </div>
                <div id="boat-athletes">
                    <div id="subhead">
                        Athletes:
                    </div>

                    <iron-list id="athlete-list" items="[[athlete]]" as="item">
                        <template>
                            <div class="athlete-info">
                                <div class="athlete-info-name">
                                    [[item.firstName]] [[item.lastName]]
                                </div>
                            </div>
                        </template>
                    </iron-list>
                </div>
                <div id="boat-oars">
                    <div id="subhead">
                        Oars:
                    </div>

                    <iron-list id="oar-list" items="[[oar]]" as="item">
                        <template>
                            <div class="oar" on-tap="_handleItemClick">
                                <div class="oar-info">
                                    <div class="oar-info-name">
                                        [[item.name]]
                                    </div>
                                </div>
                            </div>
                        </template>
                    </iron-list>
                </div>
                <div id="boat-riggers">
                    <div id="subhead">
                        Riggers:
                    </div>

                    <iron-list id="rigger-list" items="[[rigger]]" as="item">
                        <template>
                            <div class="rigger" on-tap="_handleItemClick">
                                <div class="rigger-info">
                                    <div class="rigger-info-name">
                                        [[item.seat]] [[item.side]]
                                    </div>
                                </div>
                            </div>
                        </template>
                    </iron-list>
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
            },

            athlete: {
                type: Object
            },

            oar: {
                type: Object
            },

            rigger: {
                type: Object
            }
        }
    }
}

customElements.define('ctm-fleet-detail-results', CtmFleetDetailResults);
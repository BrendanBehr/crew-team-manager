import {LitElement, html} from 'lit';

import '@polymer/iron-list/iron-list';

import '@polymer/paper-card/paper-card';

import  '../ctm-avatar/ctm-avatar';

export class CtmRosterDetailResults extends LitElement {
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

        #athlete-avatar {
            @apply(--layout-horizontal);
            @apply(--layout-center-justified);
            margin: 8px;
        }

        #athlete-name {
            font-size: 24px;
            text-align: Center;
            font-style: bold;
            padding-bottom: 18px;
            border-bottom: solid 1px grey;
        }

        #subhead {
            font-weight: bold;
        }

        #athlete-year {
            font-size: 16px;
        }

        #athlete-contact {
            border-bottom: solid 1px grey;
            padding: 16px;
        }

        #athlete-basic {
            border-bottom: solid 1px grey;
            padding: 16px;
        }

        #athlete-row {
            border-bottom: solid 1px grey;
            padding: 16px;
        }

        #erg {
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

            <paper-card id="athlete">
                <ctm-avatar id="athlete-avatar" value="[[data.firstName]]" large></ctm-avatar>
                <div id="athlete-name">
                    [[data.firstName]] [[data.lastName]]
                    <div id="athlete-year">([[data.year]]) </div>
                </div>
                <div id="athlete-contact">
                    <div id="subhead">
                        Contact information:
                    </div>
                    <div id="location">
                        [[data.streetAddress]]. [[data.city]]. [[data.state]]
                    </div>
                    <div id="phone">
                        Phone number: [[data.phone]]
                    </div>
                </div>
                <div id="athlete-basic">
                    <div id="subhead">
                        Basic inforomation:
                    </div>
                    <div id="team">
                        Team: [[team.teamName]]
                    </div>
                    <div id="height">
                        Height: [[data.height]]
                    </div>
                    <div id="weight">
                        Weight: [[data.weight]]
                    </div>
                    <div id="gender">
                        Gender: [[data.gender]]
                    </div>

                    <div id="driver">
                        Can drive? [[data.driver]]
                    </div>
                </div>
                <div id="athlete-row">
                    <div id="subhead">
                        Stats:
                    </div>
                    <div id="2k">
                        2k time: [[data.ergScore]]
                    </div>
                    <div id="side">
                        Rowing Side: [[data.side]]
                    </div>
                    <div id="funds">
                        Fundraising: [[data.fundRaising]]
                    </div>
                </div>

                <div id="erg">
                    <div id="subhead">
                        Ergs taken out:
                    </div>

                    <iron-list id="list" items="[[erg]]" as="item">
                        <template>
                            <div class="erg" on-tap="_handleItemClick">
                                <div class="erg-info">
                                    <div class="erg-info-name">
                                        [[item.number]] [[item.model]]
                                    </div>
                                </div>
                            </div>
                        </template>
                    </iron-list>
                </div>
            </paper-card>
        </div>`;
    }

    static get observers() {
        return [
            '_dataChanged(data)'
        ]
    }

    static get properties() {
        return {
            data: {
                type: Object,
            },

            team: {
                type: Object
            },

            erg: {
                type: Object
            }
        }
    }

    _dataChanged(data) {
        if (data == null) {
            //TODO make a deleted toast pop up and ask if 
            //the user wants to go back to the list page
        }

        if (data != null) {
            //TODO make an updated toast pop up and ask if 
            //the user wants to go refresh to the page
        }
    }
}

customElements.define('ctm-roster-detail-results', CtmRosterDetailResults);
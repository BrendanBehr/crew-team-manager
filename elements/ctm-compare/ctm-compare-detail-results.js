import {LitElement, html} from 'lit';

import '@polymer/iron-list/iron-list';

import '@polymer/paper-card/paper-card';

import '../ctm-avatar/ctm-avatar';

export class CtmTeamDetailResults extends LitElement {
    static styles = `
        <style>
            :host {
            background-color: white;
            @apply(--layout-horizontal);
        }

        #content-one,
        #content-two {
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
    `;
    
    constructor() {
        super();
    }
    
    render() {
        return html`
        <div id="content-one">
            <paper-card id="athlete">
                <ctm-avatar id="athlete-avatar" value="[[dataOne.firstName]]" large></ctm-avatar>
                <div id="athlete-name">
                    [[dataOne.firstName]] [[dataOne.lastName]]
                    <div id="athlete-year">([[dataOne.year]]) </div>
                </div>
                <div id="athlete-contact">
                    <div id="subhead">
                        Contact information:
                    </div>
                    <div id="location">
                        [[dataOne.streetAddress]], [[dataOne.city]], [[dataOne.state]]
                    </div>
                    <div id="phone">
                        Phone number: [[dataOne.phone]]
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
                        Height: [[dataOne.height]]
                    </div>
                    <div id="weight">
                        Weight: [[dataOne.weight]]
                    </div>
                    <div id="gender">
                        Gender: [[dataOne.gender]]
                    </div>

                    <div id="driver">
                        Can drive? [[dataOne.driver]]
                    </div>
                </div>
                <div id="athlete-row">
                    <div id="subhead">
                        Stats:
                    </div>
                    <div id="2k">
                        2k time: [[dataOne.ergScore]]
                    </div>
                    <div id="side">
                        Rowing Side: [[dataOne.side]]
                    </div>
                    <div id="funds">
                        Fundraising: [[dataOne.fundRaising]]
                    </div>
                </div>

            </paper-card>
        </div>

        <div id="content-two">

            <paper-card id="athlete">
                <ctm-avatar id="athlete-avatar" value="[[dataTwo.firstName]]" large></ctm-avatar>
                <div id="athlete-name">
                    [[dataTwo.firstName]] [[dataTwo.lastName]]
                    <div id="athlete-year">([[dataTwo.year]]) </div>
                </div>
                <div id="athlete-contact">
                    <div id="subhead">
                        Contact information:
                    </div>
                    <div id="location">
                        [[dataTwo.streetAddress]], [[dataTwo.city]], [[dataTwo.state]]
                    </div>
                    <div id="phone">
                        Phone number: [[dataTwo.phone]]
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
                        Height: [[dataTwo.height]]
                    </div>
                    <div id="weight">
                        Weight: [[dataTwo.weight]]
                    </div>
                    <div id="gender">
                        Gender: [[dataTwo.gender]]
                    </div>

                    <div id="driver">
                        Can drive? [[dataTwo.driver]]
                    </div>
                </div>
                <div id="athlete-row">
                    <div id="subhead">
                        Stats:
                    </div>
                    <div id="2k">
                        2k time: [[dataTwo.ergScore]]
                    </div>
                    <div id="side">
                        Rowing Side: [[dataTwo.side]]
                    </div>
                    <div id="funds">
                        Fundraising: [[dataTwo.fundRaising]]
                    </div>
                </div>

            </paper-card>
        </div>
        `;
    }

    static get properties() {
        return {
            dataOne: {
                type: Object,
            },

            dataTwo: {
                type: Object,
            },

            team: {
                type: Object
            }
        }
    }
}

customElements.define('ctm-compare-detail-results', CtmTeamDetailResults);
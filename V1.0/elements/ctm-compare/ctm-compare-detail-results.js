import {LitElement, html, css } from 'lit';

import '@lit-labs/virtualizer';

import '@polymer/paper-card/paper-card';

import '../ctm-avatar/ctm-avatar';

export class CtmTeamDetailResults extends LitElement {
    static styles = css`
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

        this.dataOne = {
            firstName : 'Sample',
            lastName : 'Name',
            year : 'Fresh',
            streetAddress : '123 Name Rd',
            city : 'City',
            state : 'State',
            phone : '1234567890',
            height : '5\'10',
            weight : '160',
            gender : 'M',
            ergScore : '6:30',
            side : 'Scull',
            fundRaising : '$0'
        };

        this.dataTwo = {
            firstName : 'Sample',
            lastName : 'Name',
            year : 'Fresh',
            streetAddress : '123 Name Rd',
            city : 'City',
            state : 'State',
            phone : '1234567890',
            height : '5\'10',
            weight : '160',
            gender : 'M',
            ergScore : '6:30',
            side : 'Scull',
            fundRaising : '$0'
        };

        this.team = {
            teamName : ''
        };
    }
    
    render() {
        return html`
        <div id="content-one">
            <paper-card id="athlete">
                <ctm-avatar id="athlete-avatar" value="${this.dataOne.firstName}" large></ctm-avatar>
                <div id="athlete-name">
                    ${this.dataOne.firstName} ${this.dataOne.lastName}
                    <div id="athlete-year">(${this.dataOne.year}) </div>
                </div>
                <div id="athlete-contact">
                    <div id="subhead">
                        Contact information:
                    </div>
                    <div id="location">
                        ${this.dataOne.streetAddress}, ${this.dataOne.city}, ${this.dataOne.state}
                    </div>
                    <div id="phone">
                        Phone number: ${this.dataOne.phone}
                    </div>
                </div>
                <div id="athlete-basic">
                    <div id="subhead">
                        Basic inforomation:
                    </div>
                    <div id="team">
                        Team: ${this.team.teamName}
                    </div>
                    <div id="height">
                        Height: ${this.dataOne.height}
                    </div>
                    <div id="weight">
                        Weight: ${this.dataOne.weight}
                    </div>
                    <div id="gender">
                        Gender: ${this.dataOne.gender}
                    </div>

                    <div id="driver">
                        Can drive? ${this.dataOne.driver}
                    </div>
                </div>
                <div id="athlete-row">
                    <div id="subhead">
                        Stats:
                    </div>
                    <div id="2k">
                        2k time: ${this.dataOne.ergScore}
                    </div>
                    <div id="side">
                        Rowing Side: ${this.dataOne.side}
                    </div>
                    <div id="funds">
                        Fundraising: ${this.dataOne.fundRaising}
                    </div>
                </div>

            </paper-card>
        </div>

        <div id="content-two">

            <paper-card id="athlete">
                <ctm-avatar id="athlete-avatar" value="${this.dataTwo.firstName}" large></ctm-avatar>
                <div id="athlete-name">
                    ${this.dataTwo.firstName} ${this.dataTwo.lastName}
                    <div id="athlete-year">(${this.dataTwo.year}) </div>
                </div>
                <div id="athlete-contact">
                    <div id="subhead">
                        Contact information:
                    </div>
                    <div id="location">
                        ${this.dataTwo.streetAddress}, ${this.dataTwo.city}, ${this.dataTwo.state}
                    </div>
                    <div id="phone">
                        Phone number: ${this.dataTwo.phone}
                    </div>
                </div>
                <div id="athlete-basic">
                    <div id="subhead">
                        Basic inforomation:
                    </div>
                    <div id="team">
                        Team: ${this.team.teamName}
                    </div>
                    <div id="height">
                        Height: ${this.dataTwo.height}
                    </div>
                    <div id="weight">
                        Weight: ${this.dataTwo.weight}
                    </div>
                    <div id="gender">
                        Gender: ${this.dataTwo.gender}
                    </div>

                    <div id="driver">
                        Can drive? ${this.dataTwo.driver}
                    </div>
                </div>
                <div id="athlete-row">
                    <div id="subhead">
                        Stats:
                    </div>
                    <div id="2k">
                        2k time: ${this.dataTwo.ergScore}
                    </div>
                    <div id="side">
                        Rowing Side: ${this.dataTwo.side}
                    </div>
                    <div id="funds">
                        Fundraising: ${this.dataTwo.fundRaising}
                    </div>
                </div>

            </paper-card>
        </div>
        `;
    }

    static properties() {
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
import {LitElement, html, css } from 'lit';

import '@lit-labs/virtualizer';
import { grid } from '@lit-labs/virtualizer/layouts/grid.js';

import '@polymer/paper-card/paper-card';

import  '../ctm-avatar/ctm-avatar';

export class CtmRosterDetailResults extends LitElement {
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

        this.data = {
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

        this.item = {
            number: 0,
            location: '',
            model: '',
            screenType: '',
            condition: '',
            updated: 0,
            created: 0
        };
    }

    render() {
        return html`
        <div id="content">

            <paper-card id="athlete">
                <ctm-avatar id="athlete-avatar" value="${this.data.firstName}" large></ctm-avatar>
                <div id="athlete-name">
                    ${this.data.firstName} ${this.data.lastName}
                    <div id="athlete-year">(${this.data.year}) </div>
                </div>
                <div id="athlete-contact">
                    <div id="subhead">
                        Contact information:
                    </div>
                    <div id="location">
                        ${this.data.streetAddress}. ${this.data.city}. ${this.data.state}
                    </div>
                    <div id="phone">
                        Phone number: ${this.data.phone}
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
                        Height: ${this.data.height}
                    </div>
                    <div id="weight">
                        Weight: ${this.data.weight}
                    </div>
                    <div id="gender">
                        Gender: ${this.data.gender}
                    </div>

                    <div id="driver">
                        Can drive? ${this.data.driver}
                    </div>
                </div>
                <div id="athlete-row">
                    <div id="subhead">
                        Stats:
                    </div>
                    <div id="2k">
                        2k time: ${this.data.ergScore}
                    </div>
                    <div id="side">
                        Rowing Side: ${this.data.side}
                    </div>
                    <div id="funds">
                        Fundraising: ${this.data.fundRaising}
                    </div>
                </div>

                <div id="erg">
                    <div id="subhead">
                        Ergs taken out:
                    </div>

                    <lit-virtualizer
                        .items : ${this.erg}
                        .renderItem : ${(item) => {
                            return html`
                                <div class="erg" @click="${this._handleItemClick}">
                                    <div class="erg-info">
                                        <div class="erg-info-name">
                                            ${this.item.number} ${this.item.model}
                                        </div>
                                    </div>
                                </div>`
                            }
                        }
                        .layout : ${grid()}
                        id="erg"
                    ></lit-virtualizer>
                </div>
            </paper-card>
        </div>`;
    }

    static get observers() {
        return [
            '_dataChanged(data)'
        ]
    }

    static properties() {
        return {
            data: {
                type: Object,
            },

            team: {
                type: Object
            },

            erg: {
                type: Object
            },

            item : {
                type : Object
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
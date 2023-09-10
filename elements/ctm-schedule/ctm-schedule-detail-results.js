import {LitElement, html, css } from 'lit';

import '@lit-labs/virtualizer';
import { grid } from '@lit-labs/virtualizer/layouts/grid.js';
import '@polymer/iron-image/iron-image';

import '@polymer/paper-card/paper-card';

import '../ctm-avatar/ctm-avatar';

export class CtmScheduleDetailResults extends LitElement {
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

        #regatta-avatar {
            @apply(--layout-horizontal);
            @apply(--layout-center-justified);
            margin: 8px;
        }

        #regatta-name {
            font-size: 24px;
            text-align: Center;
            font-style: bold;
            padding-bottom: 18px;
            border-bottom: solid 1px grey;
        }

        #subhead {
            font-weight: bold;
        }

        #regatta-basic {
            border-bottom: solid 1px grey;
            padding: 16px;
        }

        #regatta-image {
            border-bottom: solid 1px grey;
            padding: 16px;
        }

        #regatta-races {
            border-bottom: solid 1px grey;
            padding: 16px;
        }

        #regatta-cost {
            border-bottom: solid 1px grey;
            padding: 16px;
        }
    `;
        
    constructor() {
        super();
        
        this.data = {
            name: '',
            streetAddress: '',
            city: '',
            state: '',
            head: '',
            locationImage: '',
            cost: 0,
            created: 0,
            updated: 0
        };
    }

    render() {
        return html`
        <div id="content">

            <paper-card id="regatta">
                <ctm-avatar id="regatta-avatar" value="${this._name}" large></ctm-avatar>
                <div id="regatta-name">
                    ${this.data.name}
                </div>
                <div id="regatta-basic">
                    <div id="subhead">
                        Location:
                    </div>
                    <div id="location">
                        ${this.data.streetAddress}, ${this.data.city}, ${this.data.state}
                    </div>
                    <div id="head">
                        Is head race: ${this.data.head}
                    </div>
                </div>

                <div id="regatta-image">
                    <div id="image">
                        <iron-image src="${this.data.locationImage}"></iron-image>
                    </div>
                </div>
                <div id="regatta-cost">
                    <div id="subhead">
                        Financial:
                    </div>
                    <div id="funds">
                        Cost: $${this.data.cost}
                    </div>
                </div>

                <div id="regatta-races">
                    <div id="subhead">
                        ScheduleRaces:
                    </div>

                    <lit-virtualizer
                        .items : ${this.data}
                        .renderItem : ${(item) => {
                            return html`
                                <div class="race" @click="${this._handleItemClick}">
                                    <div class="race-info">
                                        <div class="race-info-name">
                                            ${this.item.eventName} ${this.item.raceTime}
                                        </div>
                                    </div>
                                </div>`
                            }
                        }
                        .layout : ${grid()}
                    ></lit-virtualizer>
                </div>

            </paper-card>
        </div>`;
    }

    static get observers() {
        return [
            '_getData(data)'
        ]
    }

    static properties() {
        return {
            data: {
                type: Object,
            },

            _name: String,

            race: {
                type: Object
            }
        }
    }

    _getData(data) {
        if (data.head) {
            let name = '';
            for (let x = 12; x < data.name.length; x++) {
                name = name + data.name[x];
            }
            this._name = name;
        } else {
            this._name = data.name;
        }
    }
}

customElements.define('ctm-schedule-detail-results', CtmScheduleDetailResults);
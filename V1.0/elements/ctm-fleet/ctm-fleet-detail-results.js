import {LitElement, html, css } from 'lit';

import '@lit-labs/virtualizer';
import { grid } from '@lit-labs/virtualizer/layouts/grid.js';

import '@polymer/paper-card/paper-card';

import '../ctm-avatar/ctm-avatar';

export class CtmFleetDetailResults extends LitElement {
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

        this.data = {
            name: '',
            size: 0,
            rigging: '',
            type: '',
            manufacturer: '',
            updated: 0,
            created: 0
        };

        this.team = {
            teamName : ''
        };
    }

    render() {
        return html`
        <div id="content">

            <paper-card id="boat">
                <ctm-avatar id="boat-avatar" value="${this.data.name}" large></ctm-avatar>
                <div id="boat-name">
                    ${this.data.name}
                </div>
                <div id="boat-info">
                    <div id="subhead">
                        Basic inforomation:
                    </div>
                    <div id="size">
                        Size: ${this.data.size}
                    </div>
                    <div id="rigging">
                        Rigging: ${this.data.rigging}
                    </div>
                    <div id="type">
                        Type: ${this.data.type}
                    </div>
                    <div id="manufacturer">
                        Manufacturer: ${this.data.manufacturer}
                    </div>
                    <div id="team">
                        Team: ${this.team.teamName}
                    </div>
                </div>
                <div id="boat-athletes">
                    <div id="subhead">
                        Athletes:
                    </div>

                    <lit-virtualizer
                        .items : ${this.athletes}
                        .renderItem : ${(item) => {
                            return html`
                                <div class="athlete-info">
                                    <div class="athlete-info-name">
                                        ${this.item.firstName} ${this.item.lastName}
                                    </div>
                                </div>`
                            }
                        }
                        .layout : ${grid()}
                        id="athlete-list
                    ></lit-virtualizer>
                </div>
                <div id="boat-oars">
                    <div id="subhead">
                        Oars:
                    </div>

                    <lit-virtualizer
                        .items : ${this.oars}
                        .renderItem : ${(item) => {
                            return html`
                                <div class="rigger" @click="${() => this._handleItemClick(item)}">
                                    <div class="oar-info">
                                        <div class="oar-info-name">
                                            ${this.item.name}
                                        </div>
                                    </div>
                                </div>`
                            }
                        }
                        .layout : ${grid()}
                        id="oar-list
                    ></lit-virtualizer>
                </div>
                <div id="boat-riggers">
                    <div id="subhead">
                        Riggers:
                    </div>

                    <lit-virtualizer
                        .items : ${this.riggers}
                        .renderItem : ${(item) => {
                            return html`
                            <div class="rigger" @click="${() => this._handleItemClick(item)}">
                                <div class="rigger-info">
                                    <div class="rigger-info-name">
                                        ${item.seat} ${item.side}
                                    </div>
                                </div>
                            </div>`
                            }
                        }
                        .layout : ${grid()}
                        id="rigger-list
                    ></lit-virtualizer>
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
            },

            athletes: {
                type: Object
            },

            oars: {
                type: Object
            },

            riggers: {
                type: Object
            }
        }
    }
}

customElements.define('ctm-fleet-detail-results', CtmFleetDetailResults);
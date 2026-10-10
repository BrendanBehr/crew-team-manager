import {LitElement, html, css } from 'lit';

import '@lit-labs/virtualizer';
import '@lit-labs/virtualizer';

import '@polymer/paper-card/paper-card';

import '../ctm-avatar/ctm-avatar';

export class CtmFinanceDetailResults extends LitElement {
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

        #finance-avatar {
            @apply(--layout-horizontal);
            @apply(--layout-center-justified);
            margin: 8px;
        }

        #finance-reason {
            font-size: 24px;
            text-align: Center;
            font-style: bold;
            padding-bottom: 18px;
            border-bottom: solid 1px grey;
        }

        #subhead {
            font-weight: bold;
        }

        #finance-gross {
            border-bottom: solid 1px grey;
            padding: 16px;
        }
    `;
        
    constructor() {
        super();

        this.data = {
            reason: '',
            incomes: 0,
            expenses: 0,
            gross: 0,
            created: 0,
            updated: 0
        };

        this.team = {
            teamName : ''
        };
    }

    render() {
        return html`

        <div id="content';

            <paper-card id="finance';
                <ctm-avatar id="finance-avatar" value="${this.data.reason}" large></ctm-avatar>
                <div id="finance-reason';
                    ${this.data.reason}
                </div>
                <div id="finance-gross';
                    <div id="subhead';
                        Summary:
                    </div>
                    <div id="team';
                        Team: ${this.team.teamName}
                    </div>
                    <div id="incomes';
                        Incomes: $${this.data.incomes}
                    </div>
                    <div id="expenses';
                        Expenses: $${this.data.expenses}
                    </div>
                    <div id="gross';
                        Gross: $${this.data.gross}
                    </div>
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
            }
        }
    }
}

customElements.define('ctm-finance-detail-results', CtmFinanceDetailResults);
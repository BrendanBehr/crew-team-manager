import {LitElement, html} from 'lit';

import '@polymer/iron-list/iron-list';
import '@polymer/iron-list/iron-list';

import '@polymer/paper-card/paper-card';

import '../ctm-avatar/ctm-avatar';

export class CtmFinanceDetailResults extends LitElement {
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
    }

    render() {
        return html`

        <div id="content';

            <paper-card id="finance';
                <ctm-avatar id="finance-avatar" value="[[data.reason]]" large></ctm-avatar>
                <div id="finance-reason';
                    [[data.reason]]
                </div>
                <div id="finance-gross';
                    <div id="subhead';
                        Summary:
                    </div>
                    <div id="team';
                        Team: [[team.teamName]]
                    </div>
                    <div id="incomes';
                        Incomes: $[[data.incomes]]
                    </div>
                    <div id="expenses';
                        Expenses: $[[data.expenses]]
                    </div>
                    <div id="gross';
                        Gross: $[[data.gross]]
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

customElements.define('ctm-finance-detail-results', CtmFinanceDetailResults);
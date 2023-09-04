import {LitElement, html} from 'lit';

export class CtmFinanceListMessage extends LitElement {
    static styles = `
        :host {
            background-color: white;
            @apply(--layout-horizontal);
            @apply(--layout-flex);
        }

        #layout {
            background-color: lightslategray;
            @apply(--layout-vertical);
            @apply(--layout-flex);
        }

        #message {
            @apply(--layout-horizontal);
            @apply(--layout-center-justified);
            font-size: 36px;
        }
        `;
            
    constructor() {
        super();
    }

    render() {
        return html`
        <div id="layout">
            <div id="message">No Finances Found</div>
        </div>`;
    }
}

customElements.define('ctm-finance-list-message', CtmFinanceListMessage);
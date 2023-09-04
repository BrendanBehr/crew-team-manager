import {LitElement, html} from 'lit';

export class CtmFleetRosterListMessage extends LitElement {
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
            <div id="message">No Athletes Found</div>
        </div>`;
    }
}

customElements.define('ctm-fleet-roster-list-message', CTMFleetRosterListMessage);
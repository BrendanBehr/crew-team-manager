import {LitElement, html, css } from 'lit';

export class CtmFleetDetailMessage extends LitElement {
    static styles = css`
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
                <div id="message">Boat Details not Found</div>
            </div>`;
    }

    static get is() {
        return 
    }

}

customElements.define('ctm-fleet-detail-message', CtmFleetDetailMessage);
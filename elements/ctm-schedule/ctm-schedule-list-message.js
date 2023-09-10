import {LitElement, html, css } from 'lit';

export class CtmScheduleListMessage extends LitElement {
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
                <div id="message">No Regattas Found</div>
            </div>`;
    }
}

customElements.define('ctm-schedule-list-message', CtmScheduleListMessage);
import {LitElement, html} from 'lit';

export class CtmScheduleDetailMessage extends LitElement {
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
                <div id="message">Regatta Details not Found</div>
            </div>`;
    }
}

customElements.define('ctm-schedule-detail-message', CtmScheduleDetailMessage);
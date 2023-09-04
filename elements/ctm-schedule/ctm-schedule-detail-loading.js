import {LitElement, html} from 'lit';

import '@polymer/paper-spinner/paper-spinner-lite';

export class CtmScheduleDetailLoading extends LitElement {
    static styles = `
        :host {
            background-color: white;
            @apply(--layout-horizontal);
            @apply(--layout-center-justified);
        }

        #layout {
            @apply(--layout-vertical);
            @apply(--layout-center-justified);
        }

        #spinner {
            --paper-spinner-color: var(--paper-green-700);
        }
    `;
        
    constructor() {
        super();
    }

    render() {
        return html`
            <div id="layout">
                <paper-spinner-lite active id="spinner"></paper-spinner-lite>
            </div>`;
    }

    static get properties() {
        return {
            data: {
                type: Object,
            }
        }
    }
}

customElements.define('ctm-schedule-detail-loading', CtmScheduleDetailLoading);
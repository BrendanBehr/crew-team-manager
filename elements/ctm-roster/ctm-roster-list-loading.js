import {LitElement, html, css } from 'lit';

import '@polymer/paper-spinner/paper-spinner-lite';

export class CtmRosterListLoading extends LitElement {
    static styles = css`
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
            /*--paper-spinner-stroke-width: 6px;*/
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

    static properties() {
        return {
            data: {
                type: Object,
            }
        }
    }
}

customElements.define('ctm-roster-list-loading', CtmRosterListLoading);
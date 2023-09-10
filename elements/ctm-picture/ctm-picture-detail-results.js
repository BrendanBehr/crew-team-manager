import {LitElement, html, css } from 'lit';

import '@lit-labs/virtualizer';

import '@polymer/paper-card/paper-card';

import '../ctm-avatar/ctm-avatar';

export class CtmPictureDetailResults extends LitElement {
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

        #picture-image {
            border-bottom: solid 1px grey;
            padding: 16px;
        }
    `;
        
    constructor() {
        super();

        this.data = { 
            url :''
        };
    }

    render() {
        return html`
            <div id="content">

                <paper-card id="picture">
                    <div id="picture-image">
                        <div id="image">
                            <iron-image src="${this.data.url}"></iron-image>
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
                type: Object,
            }
        }
    }
}

customElements.define('ctm-picture-detail-results', CtmPictureDetailResults);
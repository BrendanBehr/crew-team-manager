import {LitElement, html, css } from 'lit';

import '@lit-labs/virtualizer';
import '@lit-labs/virtualizer';

import '@polymer/paper-card/paper-card';

import '../ctm-avatar/ctm-avatar';

export class CtmOarDetailResults extends LitElement {
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

        #oar-avatar {
            @apply(--layout-horizontal);
            @apply(--layout-center-justified);
            margin: 8px;
        }

        #oar-name {
            font-size: 24px;
            text-align: Center;
            font-style: bold;
            padding-bottom: 18px;
            border-bottom: solid 1px grey;
        }

        #subhead {
            font-weight: bold;
        }

        #oar-location {
            border-bottom: solid 1px grey;
            padding: 16px;
        }

        #oar-image {
            border-bottom: solid 1px grey;
            padding: 16px;
        }

        #oar-cost {
            border-bottom: solid 1px grey;
            padding: 16px;
        }
    `;
        
    constructor() {
        super();

        this.data = {
            name: '',
            color: '',
            shape: '',
            handleGrip: '',
            length: '',
            team: '',
            updated: 0,
            created: 0
        };

        this.team = {
            teamName : ''
        };
    }

    render() {
        return html`

        <div id="content">

            <paper-card id="oar">
                <ctm-avatar id="oar-avatar" value="${this.data.name}" large></ctm-avatar>
                <div id="oar-name">
                    ${this.data.name}
                </div>
                <div id="oar-location">
                    <div id="subhead">
                        Details:
                    </div>
                    <div id="team">
                        Team: ${this.team.teamName}
                    </div>
                    <div id="color">
                        Color: ${this.data.color}
                    </div>
                    <div id="shape">
                        Shape: ${this.data.shape}
                    </div>
                    <div id="handle-grip">
                        Handle Grip: ${this.data.handleGrip}
                    </div>
                    <div id="length">
                        Length: ${this.data.length}cm
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

customElements.define('ctm-oar-detail-results', CtmOarDetailResults);
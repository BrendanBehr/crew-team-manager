import {LitElement, html, css } from 'lit';

import '@lit-labs/virtualizer';
import { grid } from '@lit-labs/virtualizer/layouts/grid.js';

import '@polymer/paper-styles/typography';

import '../ctm-avatar/ctm-avatar';

export class CtmFleetRosterListResults extends LitElement {
    static styles = css`
        :host {
            background-color: white;
            @apply(--layout-horizontal);
        }

        #list {
            background-color: lightslategray;
            @apply(--layout-flex);
        }

        .athlete {
            background-color: white;
            @apply(--layout-horizontal);
            border-bottom: solid 1px grey;
        }

        .athlete-selected {
            background-color: #ddd;
            @apply(--layout-horizontal);
            border-bottom: solid 1px grey;
        }

        .athlete-avatar {
            margin: 8px;
        }

        .athlete-info {
            font-size: 18px;
            @apply(--layout-flex);
            padding: 8px;
        }

        .athlete-info-name {
            @apply(--paper-font-title);
        }

        .athlete-info-location {
            @apply(--paper-font-caption);
        }

        .athlete-avatar[reveal],
        .check-avatar {
            display: none;
        }

        .athlete-avatar,
        .check-avatar[reveal] {
            display: inline-block;
        }

        .check-avatar[reveal] {
            @apply(--layout-horizontal);
            @apply(--layout-center-justified);
            margin: 8px;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            background-color: #A3A3A3;
        }
    `;
        
    constructor() {
        super();
    }

    render() {
        return html`
        <lit-virtualizer
            .items : ${this.data}
            .renderItem : ${(item) => {
                return html`
                    <div class="${this._computedClass(this.selected)}" @click="${this._handleItemClick}">
                        <ctm-avatar class="athlete-avatar" reveal="${this._isCheck(this.selected)}" value="${this.item.firstName}"></ctm-avatar>
                        <paper-icon-button class="check-avatar" reveal="${this._isCheck(this.selected)}" icon="check"></paper-icon-button>
                        <div class="athlete-info">
                            <div class="athlete-info-name">
                                ${this.item.firstName} ${this.item.lastName}
                            </div>
                            <div class="athlete-info-location">
                                ${this.item.streetAddress} ${this.item.city} ${this.item.state}
                            </div>
                        </div>
                    </div>`
                }
            }
            .layout : ${grid()}
        ></lit-virtualizer>`;
    }

    static get observers() {
        return [
            '_selectedChange(this.selected)'
        ]
    }

    static properties() {
        return {
            data: {
                type: Object,
            },

            selectedItems: {
                type: Object,
                value: {}
            },

            selected: Boolean

        }
    }

    _computedClass(isSelected) {
        let classes = 'athlete';
        if (isSelected) {
            classes += '-selected';
        }
        return classes;
    }

    _isCheck(isSelected) {
        let value = false;
        if (isSelected) {
            value = true;
        }

        return value;
    }

    _selectedChange(selected) {
        if (!selected) {
            while (this.selectedItems.length > 0) {
                this.$.list.deselectItem(this.selectedItems[0]);
            }
        }
    }

    _handleItemClick(e) {
        this.dispatchEvent(new CustomEvent('ctm-fleet-roster-list-results-action-select-athletes', {
                bubbles: true,
                composed: true,
                detail: {
                    athlete: e.model.item.$key,
                }
            }));
    }
}

customElements.define('ctm-fleet-roster-list-results', CtmFleetRosterListResults);
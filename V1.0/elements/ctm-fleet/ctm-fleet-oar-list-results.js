import {LitElement, html, css } from 'lit';

import '@lit-labs/virtualizer';
import { grid } from '@lit-labs/virtualizer/layouts/grid.js';

import '@polymer/paper-styles/typography';

import '../ctm-avatar/ctm-avatar';

export class CtmFleetOarListResults extends LitElement {
    static styles = css`
        :host {
            background-color: white;
            @apply(--layout-horizontal);
        }

        #list {
            background-color: lightslategray;
            @apply(--layout-flex);
        }

        .oar {
            background-color: white;
            @apply(--layout-horizontal);
            border-bottom: solid 1px grey;
        }

        .oar-selected {
            background-color: #ddd;
            @apply(--layout-horizontal);
            border-bottom: solid 1px grey;
        }

        .oar-avatar {
            margin: 8px;
        }

        .oar-info {
            font-size: 18px;
            @apply(--layout-flex);
            padding: 8px;
        }

        .oar-info-name {
            @apply(--paper-font-title);
        }

        .oar-info-helper {
            @apply(--paper-font-caption);
        }

        .oar-avatar[reveal],
        .check-avatar {
            display: none;
        }

        .oar-avatar,
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
                            <ctm-avatar class="oar-avatar" reveal="${this._isCheck(this.selected)}" value="${this.item.name}"></ctm-avatar>
                            <paper-icon-button class="check-avatar" reveal="${this._isCheck(this.selected)}" icon="check"></paper-icon-button>
                            <div class="oar-info">
                                <div class="oar-info-name">
                                    ${this.item.name}
                                </div>
                                <div class="oar-info-helper">
                                    ${this.item.color} ${this.item.shape}
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

            _name: {
                type: String
            },

            selectedItems: {
                type: Object,
                value: {}
            },

            selected: Boolean
        }
    }

    _computedClass(isSelected) {
        let classes = 'oar';
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
        this.dispatchEvent(new CustomEvent('ctm-fleet-oar-list-results-action-select-oar', {
            bubbles: true,
            composed: true,
            detail: {
                oar: e.model.item.$key
            }
        }));
    }
}

customElements.define('ctm-fleet-oar-list-results', CtmFleetOarListResults);
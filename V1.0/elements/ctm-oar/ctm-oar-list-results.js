import {LitElement, html, css } from 'lit';

import '@lit-labs/virtualizer';
import { grid } from '@lit-labs/virtualizer/layouts/grid.js';

import '@polymer/paper-styles/typography';

import '../ctm-avatar/ctm-avatar';

export class CtmOarListResults extends LitElement {
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
                        <div class="${this._computedClass(this.selected)}">
        
                            <ctm-avatar class="oar-avatar" reveal="${this._isCheck(this.selected)}" value="${this.item.name}" @click="${this._handleActionDeleteMultiple}"></ctm-avatar>
                            <paper-icon-button class="check-avatar" reveal="${this._isCheck(this.selected)}" icon="check"></paper-icon-button>
                            <div class="oar-info" @click="${this._handleItemClick}">
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

            deleteItems: {
                type: Object,
                value: {}
            },

            selected: Boolean

        }
    }

    _selectedChange(selected) {
        if (!selected) {
            while (this.deleteItems.length > 0) {
                this.$.list.deselectItem(this.deleteItems[0])
            }
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

    _handleActionDeleteMultiple(e) {
        this.reveal = true;
        this.dispatchEvent(new CustomEvent('ctm-oar-list-results-action-delete-multiple', {
                bubbles: true,
                composed: true,
                detail: {
                    oar: e.model.item
                }
            }));
    }

    _handleItemClick(e) {
        this.dispatchEvent(new CustomEvent('ctm-oar-list-results-action-detail', {
            bubbles: true,
            composed: true,
            detail: {
                oar: e.model.item.$key
            }
        }));
    }
}

customElements.define('ctm-oar-list-results', CtmOarListResults);
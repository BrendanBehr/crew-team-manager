import {LitElement, html, css } from 'lit';

import '@lit-labs/virtualizer';
import { grid } from '@lit-labs/virtualizer/layouts/grid.js';
import '@polymer/paper-styles/typography';

import '../ctm-avatar/ctm-avatar';

export class CtmErgListResults extends LitElement {
    static styles = css`
        :host {
            background-color: white;
            @apply(--layout-horizontal);
        }

        #list {
            background-color: lightslategray;
            @apply(--layout-flex);
        }

        .erg {
            background-color: white;
            @apply(--layout-horizontal);
            border-bottom: solid 1px grey;
        }

        .erg-selected {
            background-color: #ddd;
            @apply(--layout-horizontal);
            border-bottom: solid 1px grey;
        }

        .erg-avatar {
            margin: 8px;
        }

        .erg-info {
            font-size: 18px;
            @apply(--layout-flex);
            padding: 8px;
        }

        .erg-info-name {
            @apply(--paper-font-title);
        }

        .erg-info-location {
            @apply(--paper-font-caption);
        }

        .erg-avatar[reveal],
        .check-avatar {
            display: none;
        }

        .erg-avatar,
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
                        <ctm-avatar class="erg-avatar" reveal="${this._isCheck(this.selected)}" value="${this.item.number} % 10" @click="${this._handleActionDeleteMultiple}"></ctm-avatar>
                        <paper-icon-button class="check-avatar" reveal="${this._isCheck(this.selected)}" icon="check"></paper-icon-button>
                        <div class="erg-info" @click="${this._handleItemClick}">
                            <div class="erg-info-number">
                                Number: ${this.item.number}
                            </div>
                            <div class="erg-info-model">
                                Model: ${this.item.model}
                            </div>
                        </div>
                    </div>`
                }
            }
            .layout : ${grid()}
            id="list"
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
        let classes = 'erg';
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
        this.dispatchEvent(new CustomEvent('ctm-erg-list-results-action-delete-multiple', {
                bubbles: true,
                composed: true,
                detail: {
                    erg: e.model.item
                }
            }));
    }

    _handleItemClick(e) {
        this.dispatchEvent(new CustomEvent('ctm-erg-list-results-action-detail', {
            bubbles: true,
            composed: true,
            detail: {
                erg: e.model.item.$key
            }
        }));
    }
}

customElements.define('ctm-erg-list-results', CtmErgListResults);
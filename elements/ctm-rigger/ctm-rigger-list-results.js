import {LitElement, html, css } from 'lit';

import '@lit-labs/virtualizer';
import { grid } from '@lit-labs/virtualizer/layouts/grid.js';

import '@polymer/paper-styles/typography';

import '../ctm-avatar/ctm-avatar';

export class CtmRiggerListResults extends LitElement {
    static styles = css`
        :host {
            background-color: white;
            @apply(--layout-horizontal);
        }

        #list {
            background-color: lightslategray;
            @apply(--layout-flex);
        }

        .rigger {
            background-color: white;
            @apply(--layout-horizontal);
            border-bottom: solid 1px grey;
        }

        .rigger-selected {
            background-color: #ddd;
            @apply(--layout-horizontal);
            border-bottom: solid 1px grey;
        }

        .rigger-avatar {
            margin: 8px;
        }

        .rigger-info {
            font-size: 18px;
            @apply(--layout-flex);
            padding: 8px;
        }

        .rigger-info-name {
            @apply(--paper-font-title);
        }

        .rigger-info-helpers {
            @apply(--paper-font-caption);
        }

        .rigger-avatar[reveal],
        .check-avatar {
            display: none;
        }

        .rigger-avatar,
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

        this.item = {
            side : '',
            style : '',
            type : '',
            seat : ''
        };
    }

    render() {
        return html`
            <lit-virtualizer
                .items : ${this.data}
                .renderItem : ${(item) => {
                        return html`
                            <div class="${this._computedClass(this.selected)}">

                                <ctm-avatar class="rigger-avatar" reveal="${this._isCheck(this.selected)}" value="${this.item.style}" @click="${this._handleActionDeleteMultiple}"></ctm-avatar>
                                <paper-icon-button class="check-avatar" reveal="${this._isCheck(this.selected)}" icon="check"></paper-icon-button>
                                <div class="rigger-info" @click="${this._handleItemClick}">
                                    <div class="rigger-info-name">
                                        ${this.item.style}
                                    </div>
                                    <div class="rigger-info-helpers">
                                        ${this.item.side} ${this.item.seat}
                                    </div>
                                </div>
                            </div>`
                    }
                }
                .layout : ${grid()}
            </lit-virtualizer>`;
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

            item: {
                type: Object,
            },

            deleteItems: {
                type: Object,
                value: {}
            },

            selected: Boolean

        }
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
            while (this.deleteItems.length > 0) {
                this.$.list.deselectItem(this.deleteItems[0])
            }
        }
    }

    _computedClass(isSelected) {
        let classes = 'rigger';
        if (isSelected) {
            classes += '-selected';
        }
        return classes;
    }

    _handleActionDeleteMultiple(e) {
        this.dispatchEvent(new CustomEvent('ctm-rigger-list-results-action-delete-multiple', {
                bubbles: true,
                composed: true,
                detail: {
                    rigger: e.model.item
                }
            }));
    }

    _handleItemClick(e) {
        this.dispatchEvent(new CustomEvent('ctm-rigger-list-results-action-detail', {
            bubbles: true,
            composed: true,
            detail: {
                rigger: e.model.item.$key
            }
        }));
    }
}

customElements.define('ctm-rigger-list-results', CtmRiggerListResults);
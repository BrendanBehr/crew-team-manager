import {LitElement, html, css } from 'lit';

import '@lit-labs/virtualizer';
import { grid } from '@lit-labs/virtualizer/layouts/grid.js';

import '@polymer/paper-styles/typography';

import '../ctm-avatar/ctm-avatar';

export class CtmRosterErgListResults extends LitElement {
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

        this.item = {
            number: 0,
            location: '',
            model: '',
            screenType: '',
            condition: '',
            updated: 0,
            created: 0
        };
    }

    render() {
        return html`
        <lit-virtualizer
            .items : ${this.data}
            .renderItem : ${(item) => {
                return html`
                    <div class="${this._computedClass(this.selected)}" @click="${this._handleItemClick}">
                        <ctm-avatar class="erg-avatar" reveal="${this._isCheck(this.selected)}" value="${this.item.number} % 10"></ctm-avatar>
                        <paper-icon-button class="check-avatar" reveal="${this._isCheck(this.selected)}" icon="check"></paper-icon-button>
                        <div class="erg-info">
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

            item : {
                type : Object
            },

            _name: {
                type: String
            },

            selectedItem: {
                type: Object,
                value: {}
            },

            selected: Boolean
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

    _selectedChange(selected) {
        if (!selected) {
            this.$.list.deselectItem(this.selectedItem);
        }
    }

    _handleItemClick(e) {
        this.dispatchEvent(new CustomEvent('ctm-roster-erg-list-results-action-select-ergs', {
                bubbles: true,
                composed: true,
                detail: {
                    erg: e.model.item,
                }
            }));

    }
}

customElements.define('ctm-roster-erg-list-results', CtmRosterErgListResults);
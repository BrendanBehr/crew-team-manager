import {LitElement, html, css } from 'lit';

import '@lit-labs/virtualizer';
import { grid } from '@lit-labs/virtualizer/layouts/grid.js';

import '@polymer/paper-styles/typography';

import '../ctm-avatar/ctm-avatar';

export class CtmScheduleListResults extends LitElement {
    static styles = css`
        :host {
            background-color: white;
            @apply(--layout-horizontal);
        }

        #list {
            background-color: lightslategray;
            @apply(--layout-flex);
        }

        .regatta {
            background-color: white;
            @apply(--layout-horizontal);
            border-bottom: solid 1px grey;
        }

        .regatta-selected {
            background-color: #ddd;
            @apply(--layout-horizontal);
            border-bottom: solid 1px grey;
        }

        .regatta-avatar {
            margin: 8px;
        }

        .regatta-info {
            font-size: 18px;
            @apply(--layout-flex);
            padding: 8px;
        }

        .regatta-info-name {
            @apply(--paper-font-title);
        }

        .regatta-info-location {
            @apply(--paper-font-caption);
        }

        .regatta-avatar[reveal],
        .check-avatar {
            display: none;
        }

        .regatta-avatar,
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

                        <ctm-avatar class="regatta-avatar" reveal="${this._isCheck(this.selected)}" value="${this.item.avatar}" @click="${this._handleActionDeleteMultiple}"></ctm-avatar>
                        <paper-icon-button class="check-avatar" reveal="${this._isCheck(this.selected)}" icon="check"></paper-icon-button>
                        <div class="regatta-info" @click="${this._handleItemClick}">
                            <div class="regatta-info-name">
                                ${this.item.name}
                            </div>
                            <div class="regatta-info-location">
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

            deleteItems: {
                type: Object,
                value: {}
            },

            selected: Boolean
        }
    }

    _computedClass(isSelected) {
        let classes = 'regatta';
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
            while (this.deleteItems.length > 0) {
                this.$.list.deselectItem(this.deleteItems[0])
            }
        }
    }

    _handleActionDeleteMultiple(e) {
        this.dispatchEvent(new CustomEvent('ctm-schedule-list-results-action-delete-multiple', {
                bubbles: true,
                composed: true,
                detail: {
                    regatta: e.model.item
                }
            }));
    }


    _handleItemClick(e) {
        this.dispatchEvent(new CustomEvent('ctm-schedule-list-results-action-detail', {
            bubbles: true,
            composed: true,
            detail: {
                regatta: e.model.item.$key
            }
        }));
    }
}

customElements.define('ctm-schedule-list-results', CtmScheduleListResults);
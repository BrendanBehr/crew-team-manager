import {LitElement, html, css } from 'lit';

import '@lit-labs/virtualizer';
import { grid } from '@lit-labs/virtualizer/layouts/grid.js';

import '@polymer/paper-styles/typography';

import '../ctm-avatar/ctm-avatar';

export class CtmFleetListResults extends LitElement {
    static styles = css`
        :host {
            background-color: white;
            @apply(--layout-horizontal);
        }

        #list {
            background-color: lightslategray;
            /*@apply(--layout-vertical);*/
            @apply(--layout-flex);
            /*top: 0px;
            bottom: 0px;
            left: 0px;
            right: 0px;*/
        }

        .boat {
            background-color: white;
            @apply(--layout-horizontal);
            border-bottom: solid 1px grey;
        }

        .boat-selected {
            background-color: #ddd;
            @apply(--layout-horizontal);
            border-bottom: solid 1px grey;
        }

        .boat-avatar {
            margin: 8px;
        }

        .boat-info {
            font-size: 18px;
            @apply(--layout-flex);
            padding: 8px;
        }

        .boat-info-name {
            @apply(--paper-font-title);
        }

        .boat-info-location {
            @apply(--paper-font-caption);
        }

        .boat-avatar[reveal],
        .check-avatar {
            display: none;
        }

        .boat-avatar,
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
            name: '',
            size: 0,
            rigging: '',
            type: '',
            manufacturer: '',
            updated: 0,
            created: 0
        }
    }

    render() {
        return html`
        <lit-virtualizer
            .items : ${this.data}
            .renderItem : ${(item) => {
                return html`
                    <div class="${this._computedClass(this.selected)}">
                        <ctm-avatar class="boat-avatar" reveal="${this._isCheck(this.selected)}" value="${this.item.name}" @click="${this._handleActionDeleteMultiple}"></ctm-avatar>
                        <paper-icon-button class="check-avatar" reveal="${this._isCheck(this.selected)}" icon="check"></paper-icon-button>
                        <div class="boat-info" @click="${this._handleItemClick}">
                            <div class="boat-info-name">
                                ${this.item.name}
                            </div>

                            <div class="boat-info-details">
                                ${this.item.size} ${this.item.type} ${this.item.rigging}
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

            deleteItems: {
                type: Object
            },

            item : {
                type : Object
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
        let classes = 'boat';
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
        this.dispatchEvent(new CustomEvent('ctm-fleet-list-results-action-delete-multiple', {
                bubbles: true,
                composed: true,
                detail: {
                    fleet: e.model.item
                }
            }));
    }

    _handleItemClick(e) {
        this.dispatchEvent(new CustomEvent('ctm-fleet-list-results-action-detail', {
            bubbles: true,
            composed: true,
            detail: {
                boat: e.model.item.$key
            }
        }));
    }
}

customElements.define('ctm-fleet-list-results', CtmFleetListResults);
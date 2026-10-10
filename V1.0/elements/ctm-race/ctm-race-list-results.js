import {LitElement, html, css } from 'lit';

import '@lit-labs/virtualizer';
import { grid } from '@lit-labs/virtualizer/layouts/grid.js';

import '@polymer/paper-styles/typography';

import '../ctm-avatar/ctm-avatar';

export class CtmRaceListResults extends LitElement {
    static styles = css`
        :host {
            background-color: white;
            @apply(--layout-horizontal);
        }

        #list {
            background-color: lightslategray;
            @apply(--layout-flex);
        }

        .race {
            background-color: white;
            @apply(--layout-horizontal);
            border-bottom: solid 1px grey;
        }

        .race-selected {
            background-color: #ddd;
            @apply(--layout-horizontal);
            border-bottom: solid 1px grey;
        }

        .race-avatar {
            margin: 8px;
        }

        .race-info {
            font-size: 18px;
            @apply(--layout-flex);
            padding: 8px;
        }

        .race-info-name {
            @apply(--paper-font-title);
        }

        .race-info-time {
            @apply(--paper-font-caption);
        }

        .race-avatar[reveal],
        .check-avatar {
            display: none;
        }

        .race-avatar,
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
            eventName : '',
            raceTime : '',
            suggestedLaunchTime : '',
            bowNumber : ''
        }
    }

    render() {
        return html`
        <lit-virtualizer
            .items : ${this.data}
            .renderItem : ${(item) => {
                return html`
                <div class="${this._computedClass(this.selected)}">

                    <ctm-avatar class="race-avatar" reveal="${this._isCheck(this.selected)}" value="${this.item.eventName}" @click="${this._handleActionDeleteMultiple}"></ctm-avatar>
                    <paper-icon-button class="check-avatar" reveal="${this._isCheck(this.selected)}" icon="check"></paper-icon-button>
                    <div class="race-info" @click="${this._handleItemClick}">
                        <div class="race-info-eventName">
                            ${this.item.eventName}
                        </div>
                        <div class="race-info-time">
                            Race Time: ${this.item.raceTime}
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

            item: {
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

    _computedClass(isSelected) {
        let classes = 'race';
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
        this.dispatchEvent(new CustomEvent('ctm-race-list-results-action-delete-multiple', {
                bubbles: true,
                composed: true,
                detail: {
                    race: e.model.item
                }
            }));
    }

    _handleItemClick(e) {
        this.dispatchEvent(new CustomEvent('ctm-race-list-results-action-detail', {
            bubbles: true,
            composed: true,
            detail: {
                race: e.model.item.$key
            }
        }));
    }
}

customElements.define('ctm-race-list-results', CtmRaceListResults);
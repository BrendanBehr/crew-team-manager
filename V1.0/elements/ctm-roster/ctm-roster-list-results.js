import {LitElement, html, css } from 'lit';
import '@polymer/polymer/lib/mixins/gesture-event-listeners';

import '@lit-labs/virtualizer';
import { grid } from '@lit-labs/virtualizer/layouts/grid.js';

import '@polymer/paper-styles/typography';

import '../ctm-avatar/ctm-avatar';

export class CtmRosterListResults extends LitElement {
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

        this.item = {
            firstName : 'Sample',
            lastName : 'Name',
            year : 'Fresh',
            streetAddress : '123 Name Rd',
            city : 'City',
            state : 'State',
            phone : '1234567890',
            height : '5\'10',
            weight : '160',
            gender : 'M',
            ergScore : '6:30',
            side : 'Scull',
            fundRaising : '$0'
        };
    }

    render() {
        return html`
        <lit-virtualizer
            .items : ${this.data}
            .renderItem : ${(item) => {
                return html`
                    <div class="${this._computedClass(this.selected)}">
                        <ctm-avatar class="athlete-avatar" reveal="${this._isCheck(this.selected)}" value="${this.item.firstName}" @click="${this._handleActionDeleteMultiple}"></ctm-avatar>
                        <paper-icon-button class="check-avatar" reveal="${this._isCheck(this.selected)}" icon="check"></paper-icon-button>
                        <div class="athlete-info" @click="${this._handleItemClick}">
                            <div class="athlete-info-name">
                                ${this.item.firstName} ${this.item.lastName}
                            </div>
                            <div class="athlete-info-location">
                                ${this.item.streetAddress} ${this.item.city} ${this.item.state}
                            </div>
                        </div>
                    </div>
                </template>`
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

            deleteItems: {
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
            while (this.deleteItems.length > 0) {
                this.$.list.deselectItem(this.deleteItems[0])
            }
        }
    }

    _handleActionDeleteMultiple(e) {
        this.dispatchEvent(new CustomEvent('ctm-roster-list-results-action-delete-multiple', {
                bubbles: true,
                composed: true,
                detail: {
                    athlete: e.model.item
                }
            }));
    }

    _handleItemClick(e) {
        this.dispatchEvent(new CustomEvent('ctm-roster-list-results-action-detail', {
            bubbles: true,
            composed: true,
            detail: {
                athlete: e.model.item.$key
            }
        }));

    }
}

customElements.define('ctm-roster-list-results', CtmRosterListResults);
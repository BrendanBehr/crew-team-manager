import {LitElement, html} from 'lit';

import '@polymer/iron-list/iron-list';

import '@polymer/paper-styles/typography';

import '../ctm-avatar/ctm-avatar';

export class CtmFinanceListResults extends LitElement {
    static styles = `
        :host {
            background-color: white;
            @apply(--layout-horizontal);
        }

        #list {
            background-color: lightslategray;
            @apply(--layout-flex);
        }

        .finance {
            background-color: white;
            @apply(--layout-horizontal);
            border-bottom: solid 1px grey;
        }

        .finance-selected {
            background-color: #ddd;
            @apply(--layout-horizontal);
            border-bottom: solid 1px grey;
        }

        .finance-avatar {
            margin: 8px;
        }

        .finance-info {
            font-size: 18px;
            @apply(--layout-flex);
            padding: 8px;
        }

        .finance-info-name {
            @apply(--paper-font-title);
        }

        .finance-info-location {
            @apply(--paper-font-caption);
        }

        .finance-avatar[reveal],
        .check-avatar {
            display: none;
        }

        .finance-avatar,
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

        <iron-list id="list" items="[[data]]" as="item" selected-items="{{deleteItems}}" selection-enabled multi-selection>
            <template>
                <div class$="[[_computedClass(selected)]]">

                    <ctm-avatar class="finance-avatar" reveal$="[[_isCheck(selected)]]" value="[[item.reason]]" on-tap="_handleActionDeleteMultiple"></ctm-avatar>
                    <paper-icon-button class="check-avatar" reveal$="[[_isCheck(selected)]]" icon="check"></paper-icon-button>
                    <div class="finance-info" on-tap="_handleItemClick">
                        <div class="finance-info-name">
                            Reason: [[item.reason]]
                        </div>
                        <div class="finance-info-gross">
                            Gross: [[item.gross]]
                        </div>
                    </div>
                </div>
            </template>
        </iron-list>`;
    }

    static get observers() {
        return [
            '_selectedChange(selected)'
        ]
    }

    static get properties() {
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
        let classes = 'finance';
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
        this.dispatchEvent(new CustomEvent('ctm-finance-list-results-action-delete-multiple', {
                bubbles: true,
                composed: true,
                detail: {
                    finance: e.model.item
                }
            }));
    }

    _handleItemClick(e) {
        this.$.list.deselectItem(e.model.item);
        this.dispatchEvent(new CustomEvent('ctm-finance-list-results-action-detail', {
            bubbles: true,
            composed: true,
            detail: {
                finance: e.model.item.$key
            }
        }));
    }
}

customElements.define('ctm-finance-list-results', CtmFinanceListResults);
import {LitElement, html} from 'lit';

import '@polymer/iron-list/iron-list';

import '@polymer/paper-styles/typography';

import '../ctm-avatar/ctm-avatar';

export class CtmFleetRiggerListResults extends LitElement {
    static styles = `
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
    }

    render() {
        return html`
        <iron-list id="list" items="[[data]]" as="item" selected-items="{{selectedItems}}" selection-enabled multi-selection>
            <template>
                <div class$="[[_computedClass(selected)]]" on-tap="_handleItemClick">

                    <ctm-avatar class="rigger-avatar" reveal$="[[_isCheck(selected)]]" value="[[item.style]]"></ctm-avatar>
                    <paper-icon-button class="check-avatar" reveal$="[[_isCheck(selected)]]" icon="check"></paper-icon-button>
                    <div class="rigger-info">
                        <div class="rigger-info-name">
                            [[item.style]]
                        </div>
                        <div class="rigger-info-helpers">
                            [[item.side]] [[item.seat]]
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

            selectedItems: {
                type: Object,
                value: {}
            },

            selected: Boolean

        }
    }

    _computedClass(isSelected) {
        let classes = 'rigger';
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
        this.dispatchEvent(new CustomEvent('ctm-fleet-rigger-list-results-action-select-riggers', {
                bubbles: true,
                composed: true,
                detail: {
                    rigger: e.model.item.$key
                }
            }));
    }
}

customElements.define('ctm-fleet-rigger-list-results', CtmFleetRiggerListResults);
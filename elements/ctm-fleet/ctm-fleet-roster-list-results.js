import {LitElement, html} from 'lit';

import '@polymer/iron-list/iron-list';

import '@polymer/paper-styles/typography';

import '../ctm-avatar/ctm-avatar';

export class CtmFleetRosterListResults extends LitElement {
    static styles = `
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
    }

    render() {
        return html`

        <iron-list id="list" items="[[data]]" as="item" selected-items="{{selectedItems}}" selection-enabled multi-selection>
            <template>
                <div class$="[[_computedClass(selected)]]" on-tap="_handleItemClick">

                    <ctm-avatar class="athlete-avatar" reveal$="[[_isCheck(selected)]]" value="[[item.firstName]]"></ctm-avatar>
                    <paper-icon-button class="check-avatar" reveal$="[[_isCheck(selected)]]" icon="check"></paper-icon-button>
                    <div class="athlete-info">
                        <div class="athlete-info-name">
                            [[item.firstName]] [[item.lastName]]
                        </div>
                        <div class="athlete-info-location">
                            [[item.streetAddress]] [[item.city]] [[item.state]]
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
            while (this.selectedItems.length > 0) {
                this.$.list.deselectItem(this.selectedItems[0]);
            }
        }
    }

    _handleItemClick(e) {
        this.dispatchEvent(new CustomEvent('ctm-fleet-roster-list-results-action-select-athletes', {
                bubbles: true,
                composed: true,
                detail: {
                    athlete: e.model.item.$key,
                }
            }));
    }
}

customElements.define('ctm-fleet-roster-list-results', CtmFleetRosterListResults);
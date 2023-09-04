import {LitElement, html} from 'lit';

import '@polymer/iron-list/iron-list';

import '@polymer/paper-styles/typography';

import '../ctm-avatar/ctm-avatar';

export class CtmScheduleRaceListResults extends LitElement {
    static styles = `
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
    }

    render() {
        return html`
        <iron-list id="list" items="[[data]]" as="item" selected-items="{{selectedItems}}" selection-enabled multi-selection>
            <template>
                <div class$="[[_computedClass(selected)]]" on-tap="_handleItemClick">

                    <ctm-avatar class="race-avatar" reveal$="[[_isCheck(selected)]]" value="[[item.eventName]]"></ctm-avatar>
                    <paper-icon-button class="check-avatar" reveal$="[[_isCheck(selected)]]" icon="check"></paper-icon-button>
                    <div class="race-info">
                        <div class="race-info-eventName">
                            [[item.eventName]]
                        </div>
                        <div class="race-info-time">
                            [[item.raceTime]]
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

            selectedItems: {
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
            while (this.selectedItems.length > 0) {
                this.$.list.deselectItem(this.selectedItems[0]);
            }
        }
    }

    _handleItemClick(e) {
        this.dispatchEvent(new CustomEvent('ctm-schedule-race-list-results-action-select-races', {
                bubbles: true,
                composed: true,
                detail: {
                    race: e.model.item.$key
                }
            }));
    }
}
customElements.define('ctm-schedule-race-list-results', CtmScheduleRaceListResults);
import {LitElement, html} from 'lit';

import '@polymer/iron-list/iron-list';

import '@polymer/paper-styles/typography';

import '../ctm-avatar/ctm-avatar';

export class CtmScheduleListResults extends LitElement {
    static styles = `
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
        <iron-list id="list" items="[[data]]" as="item" selected-items="{{deleteItems}}" selection-enabled multi-selection>
            <template>
                <div class$="[[_computedClass(selected)]]">

                    <ctm-avatar class="regatta-avatar" reveal$="[[_isCheck(selected)]]" value="[[item.avatar]]" on-tap="_handleActionDeleteMultiple"></ctm-avatar>
                    <paper-icon-button class="check-avatar" reveal$="[[_isCheck(selected)]]" icon="check"></paper-icon-button>
                    <div class="regatta-info" on-tap="_handleItemClick">
                        <div class="regatta-info-name">
                            [[item.name]]
                        </div>
                        <div class="regatta-info-location">
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

customElements.define('ctm-schedule-list-results', CTMScheduleListResults);
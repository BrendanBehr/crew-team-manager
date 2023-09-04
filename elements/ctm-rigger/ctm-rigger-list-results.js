import {LitElement, html} from 'lit';

import '@polymer/iron-list/iron-list';

import '@polymer/paper-styles/typography';

import '../ctm-avatar/ctm-avatar';

export class CtmRiggerListResults extends LitElement {
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
        <iron-list id="list" items="[[data]]" as="item" selected-items="{{deleteItems}}" selection-enabled multi-selection>
            <template>
                <div class$="[[_computedClass(selected)]]">

                    <ctm-avatar class="rigger-avatar" reveal$="[[_isCheck(selected)]]" value="[[item.style]]" on-tap="_handleActionDeleteMultiple"></ctm-avatar>
                    <paper-icon-button class="check-avatar" reveal$="[[_isCheck(selected)]]" icon="check"></paper-icon-button>
                    <div class="rigger-info" on-tap="_handleItemClick">
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

            deleteItems: {
                type: Object,
                value: {}
            },

            selected: Boolean

        }
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

    _computedClass(isSelected) {
        let classes = 'rigger';
        if (isSelected) {
            classes += '-selected';
        }
        return classes;
    }

    _handleActionDeleteMultiple(e) {
        this.dispatchEvent(new CustomEvent('ctm-rigger-list-results-action-delete-multiple', {
                bubbles: true,
                composed: true,
                detail: {
                    rigger: e.model.item
                }
            }));
    }

    _handleItemClick(e) {
        this.dispatchEvent(new CustomEvent('ctm-rigger-list-results-action-detail', {
            bubbles: true,
            composed: true,
            detail: {
                rigger: e.model.item.$key
            }
        }));
    }
}

customElements.define('ctm-rigger-list-results', CtmRiggerListResults);
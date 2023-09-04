import {LitElement, html} from 'lit';

import '@polymer/iron-list/iron-list';

import '@polymer/paper-styles/typography';

import 'import" href="../ctm-avatar/ctm-avatar';

export class CtmFleetOarListResults extends LitElement {
    static styles = `
        :host {
            background-color: white;
            @apply(--layout-horizontal);
        }

        #list {
            background-color: lightslategray;
            @apply(--layout-flex);
        }

        .oar {
            background-color: white;
            @apply(--layout-horizontal);
            border-bottom: solid 1px grey;
        }

        .oar-selected {
            background-color: #ddd;
            @apply(--layout-horizontal);
            border-bottom: solid 1px grey;
        }

        .oar-avatar {
            margin: 8px;
        }

        .oar-info {
            font-size: 18px;
            @apply(--layout-flex);
            padding: 8px;
        }

        .oar-info-name {
            @apply(--paper-font-title);
        }

        .oar-info-helper {
            @apply(--paper-font-caption);
        }

        .oar-avatar[reveal],
        .check-avatar {
            display: none;
        }

        .oar-avatar,
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
                <div class$="[[_computedClass(selected)]]" on-tap="_handleItemClick';

                    <ctm-avatar class="oar-avatar" reveal$="[[_isCheck(selected)]]" value="[[item.name]]';</ctm-avatar>
                    <paper-icon-button class="check-avatar" reveal$="[[_isCheck(selected)]]" icon="check';</paper-icon-button>
                    <div class="oar-info';
                        <div class="oar-info-name';
                            [[item.name]]
                        </div>
                        <div class="oar-info-helper';
                            [[item.color]] [[item.shape]]
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
        let classes = 'oar';
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
        this.dispatchEvent(new CustomEvent('ctm-fleet-oar-list-results-action-select-oar', {
            bubbles: true,
            composed: true,
            detail: {
                oar: e.model.item.$key
            }
        }));
    }
}

customElements.define('ctm-fleet-oar-list-results', CtmFleetOarListResults);
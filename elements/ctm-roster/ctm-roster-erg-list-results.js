import {LitElement, html} from 'lit';

import '@polymer/iron-list/iron-list';

import '@polymer/paper-styles/typography';

import '../ctm-avatar/ctm-avatar';

export class CtmRosterErgListResults extends LitElement {
    static styles = `
        :host {
            background-color: white;
            @apply(--layout-horizontal);
        }

        #list {
            background-color: lightslategray;
            @apply(--layout-flex);
        }

        .erg {
            background-color: white;
            @apply(--layout-horizontal);
            border-bottom: solid 1px grey;
        }

        .erg-selected {
            background-color: #ddd;
            @apply(--layout-horizontal);
            border-bottom: solid 1px grey;
        }

        .erg-avatar {
            margin: 8px;
        }

        .erg-info {
            font-size: 18px;
            @apply(--layout-flex);
            padding: 8px;
        }

        .erg-info-name {
            @apply(--paper-font-title);
        }

        .erg-info-location {
            @apply(--paper-font-caption);
        }

        .erg-avatar[reveal],
        .check-avatar {
            display: none;
        }

        .erg-avatar,
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
        <iron-list id="list" items="[[data]]" as="item" selected-item="{{selectedItem}}" selection-enabled>
            <template>
                <div class$="[[_computedClass(selected)]]" on-tap="_handleItemClick">

                    <ctm-avatar class="erg-avatar" reveal$="[[_isCheck(selected)]]" value="[[item.number]] % 10"></ctm-avatar>
                    <paper-icon-button class="check-avatar" reveal$="[[_isCheck(selected)]]" icon="check"></paper-icon-button>
                    <div class="erg-info">
                        <div class="erg-info-number">
                            Number: [[item.number]]
                        </div>
                        <div class="erg-info-model">
                            Model: [[item.model]]
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

            selectedItem: {
                type: Object,
                value: {}
            },

            selected: Boolean
        }
    }

    _computedClass(isSelected) {
        let classes = 'erg';
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
            this.$.list.deselectItem(this.selectedItem);
        }
    }

    _handleItemClick(e) {
        this.dispatchEvent(new CustomEvent('ctm-roster-erg-list-results-action-select-ergs', {
                bubbles: true,
                composed: true,
                detail: {
                    erg: e.model.item,
                }
            }));

    }
}

customElements.define('ctm-roster-erg-list-results', CtmRosterErgListResults);
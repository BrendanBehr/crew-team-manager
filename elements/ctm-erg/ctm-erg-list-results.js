import {LitElement, html} from 'lit';

import '@polymer/iron-list/iron-list';
import '@polymer/paper-styles/typography';

import '../ctm-avatar/ctm-avatar';

export class CtmErgListResults extends LitElement {
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

        <iron-list id="list" items="[[data]]" as="item" selected-items="{{deleteItems}}" selection-enabled multi-selection>
            <template>
                <div class$="[[_computedClass(selected)]]">

                    <ctm-avatar class="erg-avatar" reveal$="[[_isCheck(selected)]]" value="[[item.number]] % 10" on-tap="_handleActionDeleteMultiple"></ctm-avatar>
                    <paper-icon-button class="check-avatar" reveal$="[[_isCheck(selected)]]" icon="check"></paper-icon-button>
                    <div class="erg-info" on-tap="_handleItemClick">
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

    _handleActionDeleteMultiple(e) {
        this.reveal = true;
        this.dispatchEvent(new CustomEvent('ctm-erg-list-results-action-delete-multiple', {
                bubbles: true,
                composed: true,
                detail: {
                    erg: e.model.item
                }
            }));
    }

    _handleItemClick(e) {
        this.dispatchEvent(new CustomEvent('ctm-erg-list-results-action-detail', {
            bubbles: true,
            composed: true,
            detail: {
                erg: e.model.item.$key
            }
        }));
    }
}

customElements.define('ctm-erg-list-results', CtmErgListResults);
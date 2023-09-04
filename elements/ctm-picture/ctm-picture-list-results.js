import {LitElement, html} from 'lit';

import '@polymer/iron-list/iron-list';
import '@polymer/iron-image/iron-image';

import '@polymer/paper-styles/typography';

import '../ctm-avatar/ctm-avatar';

export class CtmPictureListResults extends LitElement {
    static styles = `
        :host {
            background-color: white;
            @apply(--layout-horizontal);
        }

        #list {
            background-color: lightslategray;
            @apply(--layout-flex);
        }

        .picture {
            background-color: white;
            @apply(--layout-horizontal);
            border-bottom: solid 1px grey;
            border-right: solid 1px grey;
        }

        .picture-selected {
            background-color: #ddd;
            @apply(--layout-horizontal);
            border-bottom: solid 1px grey;
            border-right: solid 1px grey;
        }

        .picture-avatar {
            margin: 8px;
        }

        .picture-info {
            font-size: 18px;
            @apply(--layout-flex);
            padding: 8px;
        }

        .picture-info-caption {
            @apply(--paper-font-title);
        }

        .picture-info-location {
            @apply(--paper-font-caption);
        }

        .picture-avatar[reveal],
        .check-avatar {
            display: none;
        }

        .picture-avatar,
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
        <iron-list id="list" items="[[data]]" as="item" grid selected-items="{{deleteItems}}" selection-enabled multi-selection>
            <template>
                <div class$="[[_computedClass(selected)]]">

                    <ctm-avatar class="picture-avatar" reveal$="[[_isCheck(selected)]]" value="[[item.caption]]" on-tap="_handleActionDeleteMultiple"></ctm-avatar>
                    <paper-icon-button class="check-avatar" reveal$="[[_isCheck(selected)]]" icon="check"></paper-icon-button>
                    <div class="picture-info" on-tap="_handleItemClick">
                        <div class="picture-info-caption">
                            [[item.caption]]
                        </div>
                        <div class="picture-info-location">
                            <iron-image src="[[item.url]]" style="width:200px; height:200px;" sizing="contain"></iron-image>
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
        let classes = 'picture';
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
        this.dispatchEvent(new CustomEvent('ctm-picture-list-results-action-delete-multiple', {
                bubbles: true,
                composed: true,
                detail: {
                    picture: e.model.item
                }
            }));
    }

    _handleItemClick(e) {
        this.dispatchEvent(new CustomEvent('ctm-picture-list-results-action-detail', {
            bubbles: true,
            composed: true,
            detail: {
                picture: e.model.item.$key
            }
        }));
    }
}

customElements.define('ctm-picture-list-results', CtmPictureListResults);
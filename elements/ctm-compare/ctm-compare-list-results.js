import {LitElement, html, css } from 'lit';

import '@polymer/iron-icons/iron-icons';
import '@lit-labs/virtualizer';

import '@polymer/paper-styles/typography';

import '../ctm-avatar/ctm-avatar.js';

export class CtmCompareListResults extends LitElement {
    static styles = css`
    :host {
        background-color: white;
        @apply(--layout-horizontal);
    }

    #athletes-list-one {
        @apply(--layout-flex);
        border-right: solid 1px grey;
        overflow: auto;
    }

    #athletes-list-two {
        @apply(--layout-flex);
        border-left: solid 1px grey;
        overflow: auto;
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

    .selector {
        @applt(--layout-center);
        height: 32px;
        width: 32px;
    }

    .selector-selected {
        height: 32px;
        width: 32px;
        color: #311b92;
    }`;

    constructor() {
        super();
    }

    render() {
        return html`
        <div id="athletes-list-one">
            <lit-virtualizer id="list" items="${this.data}" as="item" scroll-target="athletes-list-one" selected-item="${this.selectedItemOne}" selection-enabled>
                <template>
                    <div class="${this._computedSelected(this.selected)}" @click="${this._handleItemClick1}">

                        <ctm-avatar class="athlete-avatar" value="${this.item.firstName}"></ctm-avatar>
                        <div class="athlete-info">
                            <div class="athlete-info-name">
                                ${this.item.firstName} ${this.item.lastName}
                            </div>
                            <div class="athlete-info-location">
                                ${this.item.streetAddress} ${this.item.city} ${this.item.state}
                            </div>
                        </div>
                        <iron-icon class="${this._computedClass(this.selected)}" icon="rowing"></iron-icon>
                    </div>
                </template>
            </lit-virtualizer>
        </div>

        <div id="athletes-list-two">
            <lit-virtualizer id="list" items="${this.data}" as="item" scroll-target="athletes-list-two" selected-item="${this.selectedItemTwo}" selection-enabled>
                <template>
                    <div class="${this._computedSelected(this.selected)}" @click="${this._handleItemClick2}">

                        <ctm-avatar class="athlete-avatar" value="${this.item.firstName}"></ctm-avatar>
                        <div class="athlete-info">
                            <div class="athlete-info-name">
                                ${this.item.firstName} ${this.item.lastName}
                            </div>
                            <div class="athlete-info-location">
                                ${this.item.streetAddress} ${this.item.city} ${this.item.state}
                            </div>
                        </div>
                        <iron-icon class="${this._computedClass(this.selected)}" icon="rowing"></iron-icon>
                    </div>
                </template>
            </lit-virtualizer>
        </div>
        `;
    }

    static properties() {
        return {
            data: {
                type: Object,
            },

            selectedItemOne: {
                type: Object
            },

            selectedItemTwo: {
                type: Object
            },

        }
    }

    _computedSelected(isSelected) {
        let classes = 'athlete';
        if (isSelected) {
            classes += '-selected';
        }
        return classes;
    }

    _computedClass(isSelected) {
        let classes = 'selector';
        if (isSelected) {
            classes += '-selected';
        }
        return classes;
    }

    _handleItemClick1(e) {
        this.dispatchEvent(new CustomEvent('ctm-compare-list-result-first-athlete', {
            bubbles: true,
            composed: true,
            detail: {
                athlete: e.model.item,
                show: 'true'
            }
        }));

    }

    _handleItemClick2(e) {
        this.dispatchEvent(new CustomEvent('ctm-compare-list-result-second-athlete', {
            bubbles: true,
            composed: true,
            detail: {
                athlete: e.model.item,
                show: 'true'
            }
        }));

    }
}

customElements.define('ctm-compare-list-result', CtmCompareListResults);
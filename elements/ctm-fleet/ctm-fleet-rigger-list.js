import {LitElement, html} from 'lit';

import '@polymer/iron-icons/iron-icons';
import '@polymer/iron-pages/iron-pages';

import '@polymer/app-layout/app-header-layout/app-header-layout';
import '@polymer/app-layout/app-drawer/app-drawer';
import '@polymer/app-layout/app-header/app-header';
import '@polymer/app-layout/app-toolbar/app-toolbar';

import '@polymer/paper-icon-button/paper-icon-button';
import '@polymer/paper-styles/color';
import '@polymer/paper-styles/typography';
import '@polymer/paper-fab/paper-fab';



import './ctm-fleet-rigger-list-loading';
import './ctm-fleet-rigger-list-results';
import './ctm-fleet-rigger-list-message';

export class CtmFleetRiggerList extends LitElement {
    static styles = `
        :host {
            background-color: lightslategray;
            @apply(--layout-horizontal);
            @apply(--paper-font-common-base);
        }

            :host([menu-hidden]) #menu {
            display: none;
        }

        #layout {
            /*@apply(--layout-flex);*/
            @apply(--layout-vertical);
        }

        #toolbar {
            background-color: #164410;
            color: #fff;
        }

        #pages {
            @apply(--layout-flex);
            position: relative;
        }

        #loading {
            @apply(--layout-fit);
        }

        #results {
            @apply(--layout-fit);
        }

        #message {
            @apply(--layout-fit);
        }

        #fab {
            position: absolute;
            background-color: #164410;
            right: 16px;
            bottom: 16px;
        }
    `;
            
    constructor() {
        super();
    }

    render() {
        return html`
        <app-header-layout id="layout" has-scrolling-region fullbleed>

            <app-header slot="header" reveals>
                <app-toolbar id="toolbar';
                    <paper-icon-button id="back" icon="arrow-back" on-tap="_handleActionBack';</paper-icon-button>
                    <div main-title id="title';Select Riggers To Add</div>
                    <paper-icon-button id="add" icon="check" on-tap="_handleActionAdd';</paper-icon-button>
                </app-toolbar>
            </app-header>
            <iron-pages id="pages" attr-for-selected="id" selected="[[page]]';
                <ctm-fleet-rigger-list-loading id="loading';</ctm-fleet-rigger-list-loading>
                <ctm-fleet-rigger-list-results id="results" data="[[_data]]" selected="[[selected]]" on-ctm-fleet-rigger-list-results-action-select-riggers="_selectRiggers';</ctm-fleet-rigger-list-results>
                <ctm-fleet-rigger-list-message id="message';</ctm-fleet-rigger-list-message>
            </iron-pages>

        </app-header-layout>`;
    }

    static get observers() {
        return [
            '_updatePage(_data.splices)',
            '_changePage(page)'
        ]
    }


    static get properties() {
        return {
            page: {
                type: String
            },

            _data: {
                type: Object
            },

            teamId: String,

            selectedRiggers: {
                type: Array,
                value: []
            },

            selected: {
                type: Boolean,
                value: false
            }

        }
    }

    _selectRiggers(e) {

        for (let x = 0; x < this.selectedRiggers.length; x++) {
            if (this.selectedRiggers[x] == e.detail.rigger) {
                this.selectedRiggers.splice(x, x);
                return;
            }
        }
        this.selected = true;
        this.selectedRiggers.push(e.detail.rigger)
    }

    _handleActionAdd() {
        let path;
        this.selected = false;
        this.$.firebase.saveValue('boatRiggers', this.boat)
            .then(() => {
                for (let x = 0; x < this.selectedRiggers.length; x++) {
                    path = 'boatRiggers/' + this.boat + '/' + this.selectedRiggers[x]
                    this.$.firebase.setStoredValue(path, true);
                }
                this.dispatchEvent(new CustomEvent('ctm-fleet-rigger-list-action-add-riggers', {
                        bubbles: true,
                        composed: true
                    }));


            })
            .catch(() => {

                this.dispatchEvent(new CustomEvent('ctm-fleet-rigger-list-action-fanout-fail', {
                        bubbles: true,
                        composed: true
                    }));
            });
    }

    _handleActionBack() {
        this.selected = false;
        this.dispatchEvent(new CustomEvent('ctm-fleet-rigger-list-action-back', {
            bubbles: true,
            composed: true,
        }));
    }

    _changePage(page) {

        this.importLazyGroup(page).then(function () {}.bind(this));
    }

    _updatePage(dataSplices) {

        if (dataSplices === undefined) {
            return;
        }

        let page = 'message';

        if (dataSplices) {
            if (dataSplices.indexSplices[0].object.length) {
                page = 'results';
            }
        }

        this.page = page;

    }

}

customElements.define('ctm-fleet-rigger-list', CtmFleetRiggerList);
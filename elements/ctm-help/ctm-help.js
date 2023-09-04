import {LitElement, html} from 'lit';

export class CtmHelp extends LitElement {
    static styles = `
    :host {
       display: block;
       background-color: #BDBDBD;
   }
    `;

  constructor() {
    super();
  }

  render() {
    return html`
    <div>
        <h1>Stage 8: Help</h1>
    </div>
    `;
  }
}
customElements.define('ctm-help', CtmHelp);
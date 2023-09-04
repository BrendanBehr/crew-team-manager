import {LitElement, html} from 'lit';

export class CtmFeedback extends LitElement {
    static styles = `
    :host {
        display: block;
        background-color: #757575;
    }
    `;

  constructor() {
    super();
  }

  render() {
    return html`
    <div>
        <h1>Stage 10: feedback</h1>
    </div>
    `;
  }
}
customElements.define('ctm-feedback', CtmFeedback);

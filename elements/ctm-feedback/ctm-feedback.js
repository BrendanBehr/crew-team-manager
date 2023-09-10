import {LitElement, html, css } from 'lit';

export class CtmFeedback extends LitElement {
    static styles = css`
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

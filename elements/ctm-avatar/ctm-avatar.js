import {LitElement, html} from 'lit';

export class CtmAvatar extends LitElement {

    static get observers() {
        return [
            '_setString(value)'
        ]
    }

    static get properties() {
        return {
            value: {
                type: String
            },

            character: {
                type: String
            }
        }
    }

    static styles = `
    
    :host {
        @apply(--layout-horizontal);
        @apply(--paper-font-common-base);
    }

     :host([large]) #avatar {
        height: 64px;
        width: 64px;
    }

     :host([large]) #character {
        @apply(--paper-font-display1);
    }

    #avatar {
        @apply(--layout-horizontal);
        @apply(--layout-center-justified);
        width: 32px;
        height: 32px;
        border-radius: 50%;
    }

    #character {
        @apply(--layout-self-center);
        @apply(--paper-font-title);
        color: white;
        opacity: 0.7;
    }

    #avatar {
        background-color: #9B9B9B;
    }

    #avatar[character="A"],
    #avatar[character="1"] {
        background-color: #E16057;
    }

    #avatar[character="B"] {
        background-color: #F16293;
    }

    #avatar[character="C"] {
        background-color: #BC68C8;
    }

    #avatar[character="D"],
    #avatar[character="2"] {
        background-color: #9774CC;
    }

    #avatar[character="E"] {
        background-color: #7A85CA;
    }

    #avatar[character="F"] {
        background-color: #6096F6;
    }

    #avatar[character="G"],
    #avatar[character="3"] {
        background-color: #4FC3F6;
    }

    #avatar[character="H"] {
        background-color: #4AD0E0;
    }

    #avatar[character="I"] {
        background-color: #4BB6AC;
    }

    #avatar[character="J"],
    #avatar[character="4"] {
        background-color: #54BB8A;
    }

    #avatar[character="K"] {
        background-color: #9BCC65;
    }

    #avatar[character="L"] {
        background-color: #D3E158;
    }

    #avatar[character="M"],
    #avatar[character="5"] {
        background-color: #FCD939;
    }

    #avatar[character="N"] {
        background-color: #F6BF2C;
    }

    #avatar[character="O"] {
        background-color: #FFA82C;
    }

    #avatar[character="P"],
    #avatar[character="6"] {
        background-color: #FF8A66;
    }

    #avatar[character="Q"],
    #avatar[character="W"] {
        background-color: #C2C2C2;
    }

    #avatar[character="R"] {
        background-color: #90A3AE;
    }

    #avatar[character="S"],
    #avatar[character="7"] {
        background-color: #A18980;
    }

    #avatar[character="T"] {
        background-color: #A3A3A3;
    }

    #avatar[character="U"] {
        background-color: #AFB6E0;
    }

    #avatar[character="V"],
    #avatar[character="8"] {
        background-color: #B49DDB;
    }

    #avatar[character="X"] {
        background-color: #7FDEEA;
    }

    #avatar[character="Y"],
    {
        background-color: #BCAAA4;
    }

    #avatar[character="Z"],
    #avatar[character="9"] {
        background-color: #ACD581;
    }
    `;

  constructor() {
    super();
  }

  render() {
    return html`
    <div id="avatar" character$="'${this.character}">
        <div id="character">
            '${this.character}
        </div>
    </div>
    `;
  }

  _setString(value) {
      if (value && typeof value === 'string') {
          this.character = value[0].toUpperCase();
      } else {
          this.character = value;
      }
  }

  _setSize(size) {
      this.icon = size
  }
}
customElements.define('ctm-avatar', CtmAvatar);

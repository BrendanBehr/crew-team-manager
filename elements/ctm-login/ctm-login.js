import {LitElement, html, css} from 'lit';

import '@polymer/iron-flex-layout/iron-flex-layout.js';
import '@polymer/iron-a11y-keys-behavior/iron-a11y-keys-behavior.js';

import '@polymer/paper-card/paper-card.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';

import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithEmailAndPassword } from 'firebase/auth';

import appJson from '../../ctm-firebase-app.json' assert { type: 'json' };
const firebaseApp = initializeApp (appJson);

const auth = getAuth(firebaseApp);
const testMode = true;

export class CtmLogin extends LitElement {
  static properties = {
    token: {
        type: Object
    },

    firebase: {
        type: Object
    }
  };

  constructor() {
    super();
  }
  get _username() {
    return this.renderRoot?.querySelector('#username').value ?? '';
  }
  get _password() {
    return this.renderRoot?.querySelector('#password').value ?? '';
  }

  static styles = css`
  :host {
         @apply(--layout-horizontal);
         @apply(--layout-center-justified);
         background-color: #164410;
     }


     #container {
         @apply(--layout-horizontal);
         @apply(--layout-center);
         min-width: 280px;
     }

     #card {
         @apply(--layout-vertical);
         @apply(--layout-center);
         @apply(--layout-flex);
         min-height: 112px;
         background-color: #e8f5e9;
         padding: 24px;
     }

     #title {
         @apply(--paper-font-title);
     }

     paper-button.custom:hover {
         background-color: var(--paper-indigo-100);
     }

     #login {
         background-color: var(--paper-indigo-500);
         color: white;
         --paper-button-raised-keyboard-focus: {
             color: white;
         }
         ;
     }`;

  render() {
    return html`
    <div id="container">
      <paper-card id="card">
      <div id="title">Crew Team Manager</div>
      <paper-input id="username" label="username"></paper-input>
      <paper-input id="password" label="password" type="password"></paper-input>
      <paper-button id="login" @click="${this.toggleSignIn}">Login</paper-button>
      </paper-card>
    </div>
    `;
  }
  
  toggleSignIn(e) {
    if (auth.currentUser) {
      auth.signOut();
    } else {
      if (this._username.length < 4) {
        alert('Please enter an email address.');
        return;
      }
      if (this._password.length < 4) {
        alert('Please enter a password.');
        return;
      }
      if (testMode) {
        signInAnonymously(auth)
          .then(() => {
          })
          .catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode === 'auth/wrong-password') {
              alert('Wrong password.');
            } else {
              alert(errorMessage);
            }
            console.log(error);
          });
      } else {
        // Sign in with email and pass.
        signInWithEmailAndPassword(auth, this._username, this._password).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          if (errorCode === 'auth/wrong-password') {
            alert('Wrong password.');
          } else {
            alert(errorMessage);
          }
          console.log(error);
        });
      }


      const options = {
        detail: auth,
        bubbles: true,
        composed: true,
      };

      this.dispatchEvent(new CustomEvent('login-success', options));
    }
  }
}
customElements.define('ctm-login', CtmLogin);

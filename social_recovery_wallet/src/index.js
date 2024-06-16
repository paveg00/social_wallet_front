import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from "react-oidc-context";

const oidcConfig = {
  authority: "https://accounts.google.com",
  client_id: "892021943047-4uss7i965lcnhv9dvhjgd5btm3140b9o.apps.googleusercontent.com",
  redirect_uri: "http://localhost:3000/accept_recovery",
  filterProtocolClaims: ["nbf"],
};

const defaultRequest = {
  wallet: '0xd93ff84Ee9dcAA98236736eAF32180ABb894C832',
  ownerAddr: '0xFc32402667182d11B29fab5c5e323e80483e7800',
  newOwner: '0x25A71a07cecf1753ee65b00E0a3AAEf7e0F51c0F',
  prevOwner: '0x0000000000000000000000000000000000000001',
  recoveryModule: { address: '0x5615dEB798BB3E4dFa0139dFa1b3D433Cc23b72f' },
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider {...oidcConfig}>
    <App />
    </AuthProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

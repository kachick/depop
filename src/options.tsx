import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './options/App.tsx';
import { assertIsDefined } from './typeguards.ts';

const root = document.getElementById('root');
assertIsDefined<HTMLElement | null>(root);

createRoot(root).render(
  // FIX ME: <StrictMode><App /></StrictMode> can NOT be used with following type error
  // error: TS2786 [ERROR]: 'StrictMode' cannot be used as a JSX component.
  <App />,
);

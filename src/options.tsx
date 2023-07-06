import React from 'https://esm.sh/react@18.2.0';
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client';
import App from './options/App.tsx';
import { assertIsDefined } from './typeguards.ts';

const root = document.getElementById('root');
assertIsDefined<HTMLElement | null>(root);

createRoot(root).render(
  // FIX ME: <StrictMode><App /></StrictMode> can NOT be used with following type error
  // error: TS2786 [ERROR]: 'StrictMode' cannot be used as a JSX component.
  <App />,
);

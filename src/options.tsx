import { StrictMode } from 'https://esm.sh/v135/react@18.3.1';
import { createRoot } from 'https://esm.sh/v135/react-dom@18.3.1/client';
import App from './options/App.tsx';
import { assertIsDefined } from './typeguards.ts';

const root = document.getElementById('root');
assertIsDefined<HTMLElement | null>(root);

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

import { createRoot } from 'https://esm.sh/react-dom@19.0.0/client?target=es2022';
import * as React from 'https://esm.sh/react@19.0.0?target=es2022';
import { assertIsDefined } from './typeguards.ts';
import ToggleSettings from './shared/ToggleSettings.tsx';

function PopupApp() {
  return <ToggleSettings loadingText="Loading..." />;
}

const root = document.getElementById('root');
assertIsDefined<HTMLElement | null>(root);

createRoot(root).render(
  <React.StrictMode>
    <PopupApp />
  </React.StrictMode>,
);
import { createRoot } from 'https://esm.sh/react-dom@19.0.14/client?target=es2022';
import * as React from 'https://esm.sh/react@19.0.14?target=es2022';
import SliderToggle from './shared/SliderToggle.tsx';
import { assertIsDefined } from './typeguards.ts';

function PopupApp() {
  return <SliderToggle loadingText='Loading...' showFooter={true} />;
}

const root = document.getElementById('root');
assertIsDefined<HTMLElement | null>(root);

createRoot(root).render(
  <React.StrictMode>
    <PopupApp />
  </React.StrictMode>,
);

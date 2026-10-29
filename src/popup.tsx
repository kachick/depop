import { render } from 'preact';
import App from './options/App.tsx';
import { assertIsDefined } from './typeguards.ts';

const root = document.getElementById('root');
assertIsDefined<HTMLElement | null>(root);

render(
  <div className='popup-container'>
    <App />
  </div>,
  root,
);

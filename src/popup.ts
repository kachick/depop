import h from 'solid-js/h';
import { render } from 'solid-js/web';
import App from './options/App.ts';
import { assertIsDefined } from './typeguards.ts';

const root = document.getElementById('root');
assertIsDefined<HTMLElement | null>(root);

render(
  h('div', { class: 'p-2' }, [h(App)]),
  root,
);

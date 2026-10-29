import van from 'vanjs-core';
import App from './options/App.ts';
import { assertIsDefined } from './typeguards.ts';

const root = document.getElementById('root');
assertIsDefined<HTMLElement | null>(root);

van.add(root, App());

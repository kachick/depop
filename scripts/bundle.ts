// Always require --allow-net https://github.com/denoland/deno_emit/issues/81
import { bundle } from 'emit';
import { parse } from 'std/flags';

const flags = parse(Deno.args);
const entrypoint = flags.entrypoint;
if (typeof entrypoint !== 'string') {
  throw new Error('Need to specify entrypoint');
}

const result = await bundle(new URL(entrypoint, import.meta.url));

const { code } = result;
console.log(code);

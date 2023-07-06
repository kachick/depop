// Always require --allow-net https://github.com/denoland/deno_emit/issues/81
import { bundle } from 'emit';
import { parse } from 'std/flags';

const flags = parse(Deno.args);
const entrypoint = flags.entrypoint;
if (typeof entrypoint !== 'string') {
  throw new Error('Need to specify entrypoint');
}

const result = await bundle(entrypoint);

const { code } = result;
Deno.stdout.writeSync(new TextEncoder().encode(code));

// Always require --allow-net https://github.com/denoland/deno_emit/issues/81
import { bundle } from 'https://deno.land/x/emit@0.24.0/mod.ts';
import { parse } from 'https://deno.land/std@0.193.0/flags/mod.ts';

const flags = parse(Deno.args);
const entrypoint = flags.entrypoint;
if (typeof entrypoint !== 'string') {
  throw new Error('Need to specify entrypoint');
}

const result = await bundle(entrypoint);

const { code } = result;
Deno.stdout.writeSync(new TextEncoder().encode(code));

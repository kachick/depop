import { bundle } from 'https://deno.land/x/emit@0.24.0/mod.ts';
import { parse } from 'https://deno.land/std@0.192.0/flags/mod.ts';

const flags = parse(Deno.args);
const entrypoint = flags.entrypoint;
if (typeof entrypoint !== 'string') {
  throw new Error('Need to specify entrypoint');
}

const result = await bundle(new URL(entrypoint, import.meta.url));

const { code } = result;
console.log(code);

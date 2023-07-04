import {
  readAllSync,
  writeAllSync,
} from 'https://deno.land/std@0.140.0/streams/conversion.ts';

const input = readAllSync(Deno.stdin);

const isEmpty = input.length === 0;

writeAllSync(Deno.stdout, input);

if (!isEmpty) {
  Deno.exit(1);
}

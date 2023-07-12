import { readAllSync } from 'https://deno.land/std@0.193.0/streams/read_all.ts';
import { writeAllSync } from 'https://deno.land/std@0.193.0/streams/write_all.ts';

const input = readAllSync(Deno.stdin);

const isEmpty = input.length === 0;

writeAllSync(Deno.stdout, input);

if (!isEmpty) {
  Deno.exit(1);
}

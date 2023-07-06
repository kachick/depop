import { readAllSync } from 'std/streams/read_all.ts';
import { writeAllSync } from 'std/streams/write_all.ts';

const input = readAllSync(Deno.stdin);

const isEmpty = input.length === 0;

writeAllSync(Deno.stdout, input);

if (!isEmpty) {
  Deno.exit(1);
}

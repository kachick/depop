// @deno-types="https://cdn.skypack.dev/-/fflate@v0.8.0-9lwslwAa54POmYjLobRf/dist=es2019,mode=raw/lib/index.d.ts"
import * as fflate from 'https://cdn.skypack.dev/fflate@0.8.0?min';
import { toHashString } from 'https://deno.land/std@0.193.0/crypto/to_hash_string.ts';

const version = JSON.parse(await Deno.readTextFile('manifest.json')).version;
if (typeof version !== 'string') {
  throw new Error('Version is not found in manifest.json');
}

const includesPaths = [
  'manifest.json',
  'README.md',
  'LICENSE',
  'assets/icon-sadness-star.png',
  ...Array.from(Deno.readDirSync('static')).flatMap((
    dirEntity,
  ) => dirEntity.isFile ? [`static/${dirEntity.name}`] : []),
  ...Array.from(Deno.readDirSync('dist')).flatMap((dirEntity) =>
    dirEntity.isFile ? [`dist/${dirEntity.name}`] : []
  ),
];

const productBasename = `depop-${version}.zip`;
const productPath = `out/${productBasename}`;
const zipStructure = new Map<string, { content: Uint8Array; sha256: string }>();

for (const path of includesPaths) {
  const content = Deno.readFileSync(path);
  const digest = await crypto.subtle.digest('SHA-256', content);
  zipStructure.set(path, { content, sha256: toHashString(digest) });
}

Deno.writeFileSync(
  productPath,
  fflate.zipSync(
    Array.from(zipStructure.entries()).reduce(
      (acc, [path, { content }]) => ({ ...acc, [path]: content }),
      {},
    ),
  ),
);

console.log(
  JSON.stringify(
    {
      productPath,
      productBasename,
      structure: Array.from(zipStructure.entries()).reduce(
        (acc, [path, { sha256 }]) => ({ ...acc, [path]: sha256 }),
        {},
      ),
    },
    undefined,
    4,
  ),
);

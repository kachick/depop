// @deno-types="https://cdn.skypack.dev/-/fflate@v0.8.0-9lwslwAa54POmYjLobRf/dist=es2019,mode=raw/lib/index.d.ts"
import * as fflate from 'https://cdn.skypack.dev/fflate@0.8.0?min';

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

const productPath = `out/depop-${version}.zip`;

Deno.writeFileSync(
  productPath,
  fflate.zipSync(includesPaths.reduce(
    (acc, path) => ({ ...acc, [path]: Deno.readFileSync(path) }),
    {},
  )),
);

console.log(JSON.stringify({ productPath, includesPaths }, undefined, 4));

import { toHashString } from 'https://deno.land/std@0.193.0/crypto/to_hash_string.ts';
import {
  basename,
  extname,
  join,
} from 'https://deno.land/std@0.193.0/path/posix.ts';
// Always require --allow-net https://github.com/denoland/deno_emit/issues/81
import { bundle } from 'https://deno.land/x/emit@0.24.0/mod.ts';
// @deno-types="https://cdn.skypack.dev/-/fflate@v0.8.0-9lwslwAa54POmYjLobRf/dist=es2019,mode=raw/lib/index.d.ts"
import * as fflate from 'https://cdn.skypack.dev/fflate@0.8.0?min';
import prettyBytes from 'https://esm.sh/pretty-bytes@6.1.0';

const manifestPath = 'src/manifest.json';

const version = JSON.parse(await Deno.readTextFile(manifestPath)).version;
if (typeof version !== 'string') {
  throw new Error('Version is not found in manifest.json');
}

const cleanUp = () => {
  try {
    Deno.removeSync('./dist', { recursive: true });
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      throw error;
    }
  }

  Deno.mkdirSync('dist/assets', { recursive: true });
};

cleanUp();

for (const entryTsPath of ['src/github-patcher.ts', 'src/options.tsx']) {
  const bundled = await bundle(entryTsPath);
  const outputPath = `dist/${basename(entryTsPath, extname(entryTsPath))}.js`;
  Deno.writeTextFileSync(outputPath, bundled.code);
}

const gatherDist = Promise.all([
  Deno.copyFile('README.md', 'dist/README.md'),
  Deno.copyFile('LICENSE', 'dist/LICENSE'),
  Deno.copyFile(manifestPath, 'dist/manifest.json'),
  Deno.copyFile('src/github-patcher.css', 'dist/github-patcher.css'),
  Deno.copyFile('src/options.html', 'dist/options.html'),
  Deno.copyFile('src/options.css', 'dist/options.css'),
  Deno.copyFile('vendor/primer.css', 'dist/primer.css'),
  Deno.copyFile(
    'assets/icon-sadness-star.png',
    'dist/icon-sadness-star.png',
  ),
]);

await gatherDist;

const getOrderedPathList = (dirPath: string): string[] =>
  Array.from(Deno.readDirSync(dirPath)).flatMap((dirEntity) =>
    dirEntity.isFile ? [dirEntity.name] : []
  ).toSorted();

const zipStructure = new Map<
  string,
  { content: Uint8Array; sha256: string; isCompressed: boolean }
>();

const sha256 = async (content: Uint8Array) => {
  const digest = await crypto.subtle.digest('SHA-256', content);
  return toHashString(digest);
};

for (const path of getOrderedPathList('dist')) {
  const content = Deno.readFileSync(join('dist', path));
  zipStructure.set(path, {
    content,
    sha256: await sha256(content),
    isCompressed: extname(path) === '.png',
  });
}

const zipped = fflate.zipSync(
  Array.from(zipStructure.entries()).reduce(
    (acc, [path, { content, isCompressed }]) => ({
      ...acc,
      [path]: isCompressed ? [content, { level: 0 }] : content,
    }),
    {},
  ),
);

const structure = Array.from(zipStructure.entries()).reduce(
  (acc, [path, { sha256 }]) => ({ ...acc, [path]: sha256 }),
  {},
);
const structureSha256 = await sha256(
  new TextEncoder().encode(JSON.stringify(structure)),
);
const productBasename = `depop-${version}-${structureSha256.slice(0, 7)}.zip`;
const productPath = `dist/${productBasename}`;
Deno.writeFileSync(productPath, zipped);

console.log(
  JSON.stringify(
    {
      productPath,
      productBasename,
      structureSha256,
      structure,
      productSize: prettyBytes(zipped.length),
      productSha256: await sha256(zipped),
    },
    undefined,
    4,
  ),
);

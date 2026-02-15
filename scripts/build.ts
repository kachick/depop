import { assertEquals } from '@std/assert';
import { encodeHex } from '@std/encoding';
import { basename, extname, join } from '@std/path';
import manifestJson from '../src/manifest.json' with {
  type: 'json',
};
import manifestSchema from '../src/manifestSchemaAdjusted.json' with {
  type: 'json',
};
// Always require --allow-net https://github.com/denoland/deno_emit/issues/81
import { bundle } from '@deno/emit';
import { Ajv } from 'ajv';
import * as fflate from 'fflate';
import prettyBytes from 'pretty-bytes';

const cleanUpSync = () => {
  try {
    Deno.removeSync('./dist', { recursive: true });
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      throw error;
    }
  }

  Deno.mkdirSync('dist/assets', { recursive: true });
};

cleanUpSync();

const transpile = async () => {
  for (const entryTsPath of ['src/github-patcher.ts', 'src/popup.tsx']) {
    const bundled = await bundle(entryTsPath);
    const outputPath = `dist/${basename(entryTsPath, extname(entryTsPath))}.js`;
    Deno.writeTextFileSync(outputPath, bundled.code);
  }
};

const gatherDist = Promise.all([
  transpile(),
  Deno.copyFile('README.md', 'dist/README.md'),
  Deno.copyFile('LICENSE', 'dist/LICENSE'),
  Deno.copyFile('src/manifest.json', 'dist/manifest.json'),
  Deno.copyFile('src/github-patcher.css', 'dist/github-patcher.css'),
  Deno.copyFile('src/popup.html', 'dist/popup.html'),
  Deno.copyFile('src/popup.css', 'dist/popup.css'),
  Deno.copyFile('vendor/primer.css', 'dist/primer.css'),
  Deno.copyFile(
    'assets/icons/3.edit_by_me/from-icon-sadness-star-2024-03-25-128x128-t.png',
    'dist/icon-sadness-star.png',
  ),
]);

await gatherDist;

const getOrderedPathList = (dirPath: string): string[] =>
  Array.from(Deno.readDirSync(dirPath)).flatMap((dirEntity) => dirEntity.isFile ? [dirEntity.name] : []).toSorted();

const zipStructure = new Map<
  string,
  { content: Uint8Array; sha256: string; isCompressed: boolean }
>();

const sha256 = async (content: Uint8Array<ArrayBuffer>) => {
  const digest = await crypto.subtle.digest('SHA-256', content);
  return encodeHex(digest);
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
) as Uint8Array<ArrayBuffer>; // This `as` is a workaround for: https://github.com/101arrowz/fflate/issues/242

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
const toString = (bytes: Uint8Array) => textDecoder.decode(bytes);

const structure = Array.from(zipStructure.entries()).reduce(
  (acc, [path, { sha256 }]) => ({ ...acc, [path]: sha256 }),
  {},
);
const structureSha256 = await sha256(
  textEncoder.encode(JSON.stringify(structure)),
);
const productBasename = `depop-${manifestJson.version}-${structureSha256.slice(0, 7)}.zip`;
const productPath = `dist/${productBasename}`;
Deno.writeFileSync(productPath, zipped);

const validateProduct = async (zipped: Uint8Array<ArrayBuffer>) => {
  const unzipped = fflate.unzipSync(zipped);

  assertEquals(JSON.parse(toString(unzipped['manifest.json'])), manifestJson);

  const ajv = new Ajv({ allErrors: true });
  const schemaOk = await ajv.validate(manifestSchema, manifestJson);

  const definedPaths = [
    ...manifestJson.content_scripts.flatMap(({ css, js }) => [...css, ...js]),
    ...Object.values(manifestJson.icons),
  ];
  const includedPaths = new Set(Object.keys(unzipped));
  // Except assets like css from options.html
  const missingPaths = definedPaths.filter((path) => !includedPaths.has(path));

  const ok = schemaOk && missingPaths.length === 0;

  return [ok, { schemaErrors: ajv.errors, missingPaths }];
};

const [ok, errors] = await validateProduct(zipped);

if (ok) {
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
} else {
  console.error(errors);
  Deno.exit(1);
}

import { Ajv } from 'ajv';
import { build } from 'esbuild';
import * as fflate from 'fflate';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFileSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { copyFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import prettyBytes from 'pretty-bytes';
import manifestChromeJson from '../src/manifest-chrome.json' with {
  type: 'json',
};
import manifestFirefoxJson from '../src/manifest-firefox.json' with {
  type: 'json',
};
import manifestJson from '../src/manifest.json' with {
  type: 'json',
};
import manifestSchema from '../src/manifestSchemaAdjusted.json' with {
  type: 'json',
};

const cleanUpSync = () => {
  rmSync('./dist', { recursive: true, force: true });
  mkdirSync('dist/assets', { recursive: true });
};

cleanUpSync();

const transpile = async () => {
  await build({
    entryPoints: [
      'src/github-patcher.ts',
      'src/options.tsx',
      'src/popup.tsx',
      'src/background.ts',
    ],
    outdir: 'dist',
    bundle: true,
    format: 'iife',
    target: 'es2022',
  });
};

const gatherCommonAssets = Promise.all([
  transpile(),
  copyFile('README.md', 'dist/README.md'),
  copyFile('LICENSE', 'dist/LICENSE'),
  copyFile('src/github-patcher.css', 'dist/github-patcher.css'),
  copyFile('src/options.html', 'dist/options.html'),
  copyFile('src/options.css', 'dist/options.css'),
  copyFile('src/popup.html', 'dist/popup.html'),
  copyFile('src/popup.css', 'dist/popup.css'),
  copyFile('vendor/primer.css', 'dist/primer.css'),
  copyFile(
    'assets/icons/3.edit_by_me/from-icon-sadness-star-2024-03-25-128x128-t.png',
    'dist/icon-sadness-star.png',
  ).then(() => {
    const outputDisabledIcon = 'dist/icon-sadness-star-disabled.png';
    copyFileSync('dist/icon-sadness-star.png', outputDisabledIcon);
    execFileSync('mogrify', ['-colorspace', 'gray', outputDisabledIcon]);
  }),
]);

await gatherCommonAssets;

const getOrderedPathList = (dirPath: string): string[] =>
  readdirSync(dirPath, { withFileTypes: true })
    .flatMap((dirEntity) => (dirEntity.isFile() ? [dirEntity.name] : []))
    .toSorted();

const sha256 = (content: Uint8Array | string) => {
  return createHash('sha256').update(content).digest('hex');
};

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
const toString = (bytes: Uint8Array) => textDecoder.decode(bytes);

const validateProduct = async (
  zipped: Uint8Array<ArrayBuffer>,
  target: 'chrome' | 'firefox',
) => {
  const unzipped = fflate.unzipSync(zipped);

  const productManifest = JSON.parse(toString(unzipped['manifest.json']));
  const expectedManifest = {
    ...manifestJson,
    ...(target === 'chrome' ? manifestChromeJson : manifestFirefoxJson),
  } as Record<string, unknown>;

  assert.deepStrictEqual(productManifest, expectedManifest);

  const ajv = new Ajv({ allErrors: true });
  const schemaOk = await ajv.validate(manifestSchema, expectedManifest);

  const definedPaths = [
    ...(expectedManifest.content_scripts as { css: string[]; js: string[] }[])
      .flatMap(({ css, js }) => [...css, ...js]),
    expectedManifest.options_page as string,
    ...Object.values(expectedManifest.icons as Record<string, string>),
  ];
  const includedPaths = new Set(Object.keys(unzipped));
  // Except assets like css from options.html
  const missingPaths = definedPaths.filter((path) => !includedPaths.has(path));

  const ok = schemaOk && missingPaths.length === 0;

  return [ok, { schemaErrors: ajv.errors, missingPaths }];
};

const reports: Record<string, unknown> = {};

for (const target of ['chrome', 'firefox'] as const) {
  // 1. Prepare manifest for the target
  const targetManifest = {
    ...manifestJson,
    ...(target === 'chrome' ? manifestChromeJson : manifestFirefoxJson),
  };

  writeFileSync(
    'dist/manifest.json',
    JSON.stringify(targetManifest, null, 2),
    'utf-8',
  );

  // 2. Gather files for zip
  const zipStructure = new Map<
    string,
    { content: Uint8Array; sha256: string; isCompressed: boolean }
  >();

  for (const path of getOrderedPathList('dist')) {
    if (extname(path) === '.zip') continue;

    const content = readFileSync(join('dist', path));
    zipStructure.set(path, {
      content,
      sha256: sha256(content),
      isCompressed: extname(path) === '.png',
    });
  }

  // 3. Create zip
  const zipped = fflate.zipSync(
    Array.from(zipStructure.entries()).reduce(
      (acc, [path, { content, isCompressed }]) => ({
        ...acc,
        [path]: isCompressed ? [content, { level: 0 }] : content,
      }),
      {},
    ),
  ) as Uint8Array<ArrayBuffer>;

  const structure = Array.from(zipStructure.entries()).reduce(
    (acc, [path, { sha256 }]) => ({ ...acc, [path]: sha256 }),
    {},
  );
  const structureSha256 = sha256(
    textEncoder.encode(JSON.stringify(structure)),
  );
  const productBasename = `depop-${manifestJson.version}-${structureSha256.slice(0, 7)}-${target}.zip`;
  const productPath = `dist/${productBasename}`;
  writeFileSync(productPath, zipped);

  // 4. Validate
  const [ok, errors] = await validateProduct(zipped, target);

  if (ok) {
    reports[target] = {
      target,
      productPath,
      productBasename,
      structureSha256,
      structure,
      productSize: prettyBytes(zipped.length),
      productSha256: sha256(zipped),
    };
  } else {
    console.error(`Validation failed for ${target}:`, errors);
    process.exit(1);
  }
}

// Ensure the dist directory is Chrome-ready for local development
writeFileSync(
  'dist/manifest.json',
  JSON.stringify({ ...manifestJson, ...manifestChromeJson }, null, 2),
  'utf-8',
);

console.log(JSON.stringify(reports, undefined, 4));

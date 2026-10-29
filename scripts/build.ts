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
  mkdirSync('dist/chrome', { recursive: true });
  mkdirSync('dist/firefox', { recursive: true });
  mkdirSync('dist/packages', { recursive: true });
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
    outdir: 'dist/chrome',
    bundle: true,
    format: 'iife',
    target: 'es2022',
  });

  const generatedScripts = [
    'github-patcher.js',
    'options.js',
    'popup.js',
    'background.js',
  ];
  for (const script of generatedScripts) {
    copyFileSync(join('dist/chrome', script), join('dist/firefox', script));
  }
};

const commonStaticFiles = [
  ['README.md', 'README.md'],
  ['LICENSE', 'LICENSE'],
  ['src/github-patcher.css', 'github-patcher.css'],
  ['src/options.html', 'options.html'],
  ['src/options.css', 'options.css'],
  ['src/popup.html', 'popup.html'],
  ['src/popup.css', 'popup.css'],
] as const;

const copyStaticFiles = async () => {
  await Promise.all(
    commonStaticFiles.flatMap(([src, dest]) => [
      copyFile(src, join('dist/chrome', dest)),
      copyFile(src, join('dist/firefox', dest)),
    ]),
  );
};

const setupIcons = async () => {
  const toolbarIconSrc = 'assets/icons/3.edit_by_me/from-icon-sadness-star-2024-03-25-toolbar-128x128-t.png';
  const storeIconSrc = 'assets/icons/3.edit_by_me/from-icon-sadness-star-2024-03-25-store-128x128-t.png';

  const chromeToolbarIcon = 'dist/chrome/icon-sadness-star.png';
  const chromeDisabledIcon = 'dist/chrome/icon-sadness-star-disabled.png';
  const chromeStoreIcon = 'dist/chrome/icon-sadness-star-store.png';

  await Promise.all([
    copyFile(toolbarIconSrc, chromeToolbarIcon),
    copyFile(storeIconSrc, chromeStoreIcon),
  ]);

  copyFileSync(chromeToolbarIcon, chromeDisabledIcon);
  execFileSync('mogrify', ['-colorspace', 'gray', chromeDisabledIcon]);

  copyFileSync(chromeToolbarIcon, 'dist/firefox/icon-sadness-star.png');
  copyFileSync(
    chromeDisabledIcon,
    'dist/firefox/icon-sadness-star-disabled.png',
  );
  copyFileSync(chromeStoreIcon, 'dist/firefox/icon-sadness-star-store.png');
};

await Promise.all([transpile(), copyStaticFiles(), setupIcons()]);

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

const getTargetManifest = (target: 'chrome' | 'firefox') => {
  const browserManifest = target === 'chrome' ? manifestChromeJson : manifestFirefoxJson;
  return {
    ...manifestJson,
    ...browserManifest,
    action: {
      ...manifestJson.action,
      ...('action' in browserManifest ? browserManifest.action : {}),
    },
  };
};

const validateProduct = async (
  zipped: Uint8Array<ArrayBuffer>,
  target: 'chrome' | 'firefox',
) => {
  const unzipped = fflate.unzipSync(zipped);

  const productManifest = JSON.parse(toString(unzipped['manifest.json']));
  const expectedManifest = getTargetManifest(target);

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
  const targetManifest = getTargetManifest(target);

  writeFileSync(
    join('dist', target, 'manifest.json'),
    JSON.stringify(targetManifest, null, 2),
    'utf-8',
  );

  // 2. Gather files for zip
  const zipStructure = new Map<
    string,
    { content: Uint8Array; sha256: string; isCompressed: boolean }
  >();

  const targetDir = join('dist', target);
  for (const path of getOrderedPathList(targetDir)) {
    const content = readFileSync(join(targetDir, path));
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
  const productPath = join('dist/packages', productBasename);
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

copyFileSync('dist-README.md', 'dist/README.md');

console.log(JSON.stringify(reports, undefined, 4));

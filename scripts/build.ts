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
  for (
    const entryTsPath of [
      'src/github-patcher.ts',
      'src/options.tsx',
      'src/popup.tsx',
      'src/background.ts',
    ]
  ) {
    const bundled = await bundle(entryTsPath);
    const outputPath = `dist/${basename(entryTsPath, extname(entryTsPath))}.js`;
    Deno.writeTextFileSync(outputPath, bundled.code);
  }
};

const gatherCommonAssets = Promise.all([
  transpile(),
  Deno.copyFile('README.md', 'dist/README.md'),
  Deno.copyFile('LICENSE', 'dist/LICENSE'),
  Deno.copyFile('src/github-patcher.css', 'dist/github-patcher.css'),
  Deno.copyFile('src/options.html', 'dist/options.html'),
  Deno.copyFile('src/options.css', 'dist/options.css'),
  Deno.copyFile('src/popup.html', 'dist/popup.html'),
  Deno.copyFile('src/popup.css', 'dist/popup.css'),
  Deno.copyFile('vendor/primer.css', 'dist/primer.css'),
  Deno.copyFile(
    'assets/icons/3.edit_by_me/from-icon-sadness-star-2024-03-25-128x128-t.png',
    'dist/icon-sadness-star.png',
  ).then(async () => {
    const outputDisabledIcon = 'dist/icon-sadness-star-disabled.png';
    await Deno.copyFile('dist/icon-sadness-star.png', outputDisabledIcon);
    const command = new Deno.Command('mogrify', {
      args: ['-colorspace', 'gray', outputDisabledIcon],
    });
    const { success } = await command.output();
    if (!success) {
      throw new Error('Failed to generate disabled icon via mogrify');
    }
  }),
]);

await gatherCommonAssets;

const getOrderedPathList = (dirPath: string): string[] =>
  Array.from(Deno.readDirSync(dirPath)).flatMap((dirEntity) => dirEntity.isFile ? [dirEntity.name] : []).toSorted();

const sha256 = async (content: Uint8Array<ArrayBuffer>) => {
  const digest = await crypto.subtle.digest('SHA-256', content);
  return encodeHex(digest);
};

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();
const toString = (bytes: Uint8Array) => textDecoder.decode(bytes);

const validateProduct = async (zipped: Uint8Array<ArrayBuffer>, target: 'chrome' | 'firefox') => {
  const unzipped = fflate.unzipSync(zipped);

  const productManifest = JSON.parse(toString(unzipped['manifest.json']));
  assertEquals(
    productManifest,
    target === 'firefox'
      ? {
        ...manifestJson,
        background: {
          ...manifestJson.background,
          scripts: [manifestJson.background.service_worker],
        },
      }
      : manifestJson,
  );

  const ajv = new Ajv({ allErrors: true });
  const schemaOk = await ajv.validate(manifestSchema, manifestJson);

  const definedPaths = [
    ...manifestJson.content_scripts.flatMap(({ css, js }) => [...css, ...js]),
    manifestJson.options_page,
    ...Object.values(manifestJson.icons),
  ];
  const includedPaths = new Set(Object.keys(unzipped));
  // Except assets like css from options.html
  const missingPaths = definedPaths.filter((path) => !includedPaths.has(path));

  const ok = schemaOk && missingPaths.length === 0;

  return [ok, { schemaErrors: ajv.errors, missingPaths }];
};

for (const target of ['chrome', 'firefox'] as const) {
  // 1. Prepare manifest for the target
  const targetManifest = target === 'firefox'
    ? {
      ...manifestJson,
      background: {
        ...manifestJson.background,
        scripts: [manifestJson.background.service_worker],
      },
    }
    : manifestJson;

  Deno.writeTextFileSync('dist/manifest.json', JSON.stringify(targetManifest, null, 2));

  // 2. Gather files for zip
  const zipStructure = new Map<
    string,
    { content: Uint8Array; sha256: string; isCompressed: boolean }
  >();

  for (const path of getOrderedPathList('dist')) {
    if (extname(path) === '.zip') continue;

    const content = Deno.readFileSync(join('dist', path));
    zipStructure.set(path, {
      content,
      sha256: await sha256(content),
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
  const structureSha256 = await sha256(
    textEncoder.encode(JSON.stringify(structure)),
  );
  const productBasename = `depop-${manifestJson.version}-${structureSha256.slice(0, 7)}-${target}.zip`;
  const productPath = `dist/${productBasename}`;
  Deno.writeFileSync(productPath, zipped);

  // 4. Validate
  const [ok, errors] = await validateProduct(zipped, target);

  if (ok) {
    console.log(
      JSON.stringify(
        {
          target,
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
    console.error(`Validation failed for ${target}:`, errors);
    Deno.exit(1);
  }
}

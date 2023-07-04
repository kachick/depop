import { compress } from 'https://deno.land/x/zip@v1.2.5/mod.ts';

const version = JSON.parse(await Deno.readTextFile('manifest.json')).version;
if (typeof version !== 'string') {
  throw new Error('Version is not found in manifest.json');
}
const product = `out/depop-${version}.zip`;

const decoder = new TextDecoder();

const staticFiles = Array.from(Deno.readDirSync('static')).flatMap((
  dirEntity,
) => dirEntity.isFile ? [`static/${dirEntity.name}`] : []);

const distFiles = Array.from(Deno.readDirSync('dist')).flatMap((dirEntity) =>
  dirEntity.isFile ? [`dist/${dirEntity.name}`] : []
);

console.log(Deno.cwd());
const p2 = Deno.cwd() + '/out/archive.zip';

// Avoid to name `.crx`. See https://developer.chrome.com/docs/webstore/publish/ for further detail
const success = await compress([
  'README.md',
], p2);

if (success) {
  console.log(`Built to ${product}`);
} else {
  console.error('Failed to build');
  Deno.exit(1);
}

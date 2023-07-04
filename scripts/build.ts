const version = JSON.parse(await Deno.readTextFile('manifest.json')).version;
if (typeof version !== 'string') {
  throw new Error('Version is not found in manifest.json');
}
const product = `out/depop-${version}.zip`;

const decoder = new TextDecoder();

const staticFiles = Array.from(Deno.readDirSync('static')).flatMap((filename) =>
  filename.isFile ? [`static/${filename.name}`] : []
);

const distFiles = Array.from(Deno.readDirSync('dist')).flatMap((filename) =>
  filename.isFile ? [`dist/${filename.name}`] : []
);

// Avoid to name `.crx`. See https://developer.chrome.com/docs/webstore/publish/ for further detail
const command = new Deno.Command('zip', {
  args: [
    product,
    'manifest.json',
    'README.md',
    'LICENSE',
    'assets/icon-sadness-star.png',
    ...staticFiles,
    ...distFiles,
  ],
});
const result = command.outputSync();

if (result.success) {
  console.log(`Built to ${product}: \n${decoder.decode(result.stdout)}`);
} else {
  console.error(`Failed to build: \n${decoder.decode(result.stderr)}`);
  Deno.exit(result.code);
}

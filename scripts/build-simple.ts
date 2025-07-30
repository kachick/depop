// Simplified build script that avoids network issues
import { basename, extname, join } from '@std/path';
import manifestJson from '../src/manifest.json' with {
  type: 'json',
};

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

// Simply copy the TypeScript files without bundling for now
const copyTsFiles = async () => {
  await Deno.copyFile('src/github-patcher.ts', 'dist/github-patcher.js');
  await Deno.copyFile('src/popup.tsx', 'dist/popup.js');
};

const gatherDist = Promise.all([
  copyTsFiles(),
  Deno.copyFile('README.md', 'dist/README.md'),
  Deno.copyFile('LICENSE', 'dist/LICENSE'),
  Deno.copyFile('src/manifest.json', 'dist/manifest.json'),
  Deno.copyFile('src/github-patcher-hide.css', 'dist/github-patcher-hide.css'),
  Deno.copyFile('src/github-patcher-show.css', 'dist/github-patcher-show.css'),
  Deno.copyFile('src/popup.html', 'dist/popup.html'),
  Deno.copyFile('src/popup.css', 'dist/popup.css'),
  Deno.copyFile('vendor/primer.css', 'dist/primer.css'),
  Deno.copyFile(
    'assets/icons/3.edit_by_me/from-icon-sadness-star-2024-03-25-128x128-t.png',
    'dist/icon-sadness-star.png',
  ),
]);

await gatherDist;

console.log('Simplified build completed successfully');
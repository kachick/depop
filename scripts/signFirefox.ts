import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const apiKey = process.env.AMO_API_KEY || process.env.WEB_EXT_API_KEY;
const apiSecret = process.env.AMO_API_SECRET || process.env.WEB_EXT_API_SECRET;

if (!apiKey || !apiSecret) {
  console.error(
    'Error: AMO_API_KEY and AMO_API_SECRET (or WEB_EXT_API_KEY and WEB_EXT_API_SECRET) must be set.',
  );
  process.exit(1);
}

const sourceDir = resolve('dist/firefox');
if (!existsSync(sourceDir)) {
  console.error(`Error: Source directory "${sourceDir}" not found. Run build first.`);
  process.exit(1);
}

const artifactsDir = resolve('dist/signed-firefox');
mkdirSync(artifactsDir, { recursive: true });

console.log('Signing Firefox extension with AMO (unlisted channel)...');

// Pass credentials via environment variables so secrets are not exposed in CLI arguments or process lists.
const env = {
  ...process.env,
  WEB_EXT_API_KEY: apiKey,
  WEB_EXT_API_SECRET: apiSecret,
};

try {
  execFileSync(
    'web-ext',
    [
      'sign',
      '--source-dir',
      sourceDir,
      '--channel',
      'unlisted',
      '--artifacts-dir',
      artifactsDir,
    ],
    {
      stdio: 'inherit',
      env,
    },
  );

  const signedFiles = readdirSync(artifactsDir).filter((file) => file.endsWith('.xpi'));
  console.log('Signed Firefox package(s):', signedFiles);
} catch (error) {
  console.error('Failed to sign Firefox extension:', error);
  process.exit(1);
}

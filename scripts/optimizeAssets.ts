import { execFileSync } from 'node:child_process';

const iconsDir = 'assets/icons/3.edit_by_me';
const toolbarIcon = `${iconsDir}/from-icon-sadness-star-2024-03-25-toolbar-128x128-t.png`;
const disabledIcon = `${iconsDir}/from-icon-sadness-star-2024-03-25-disabled-128x128-t.png`;
const storeIcon = `${iconsDir}/from-icon-sadness-star-2024-03-25-store-128x128-t.png`;

const screenshotsDir = 'assets/screenshots';
const originsDir = `${screenshotsDir}/origins`;
const popularBefore = `${originsDir}/popular-repos-before.png`;
const popularAfter = `${originsDir}/popular-repos-after.png`;
const actionsBefore = `${originsDir}/repo-actions-before.png`;
const actionsAfter = `${originsDir}/repo-actions-after.png`;
const overviewImg = `${screenshotsDir}/overview.png`;
const overviewStoreImg = `${screenshotsDir}/overview-store.png`;
const popupImg = `${screenshotsDir}/popup.png`;
const popupStoreImg = `${screenshotsDir}/popup-store.png`;

const originImages = [
  toolbarIcon,
  popularBefore,
  popularAfter,
  actionsBefore,
  actionsAfter,
  popupImg,
];

const derivedImages = [
  disabledIcon,
  storeIcon,
  overviewImg,
  overviewStoreImg,
  popupStoreImg,
];

// 1. Strip metadata and losslessly optimize source images first so repeated runs stay idempotent
execFileSync('exiftool', [
  '-overwrite_original',
  '-all=',
  ...originImages,
  'assets/icons/1.origins_by_me/icon-sadness-star-2023-09-29.png',
  'assets/icons/1.origins_by_me/icon-sadness-star-2024-03-25.png',
  'assets/icons/2.rewrite_by_generative_ai/from-icon-sadness-star-2024-03-25.jpg',
]);

execFileSync('oxipng', ['--opt', 'max', '--strip', 'safe', ...originImages]);

// 2. Generate derived icons from the toolbar icon
execFileSync('magick', [toolbarIcon, '-colorspace', 'gray', disabledIcon]);
execFileSync('magick', [
  toolbarIcon,
  '-resize',
  '96x96',
  '-gravity',
  'center',
  '-background',
  'none',
  '-extent',
  '128x128',
  storeIcon,
]);

// 3. Compose overview screenshot from raw captures
const arrowArgs = [
  '-size',
  '64x64',
  'xc:none',
  '-fill',
  '#d8e6f3',
  '-stroke',
  '#1f2328',
  '-strokewidth',
  '2',
  '-draw',
  'polygon 22,6 42,6 42,32 54,32 32,58 10,32 22,32',
];

execFileSync('magick', [
  '(',
  ...arrowArgs,
  ')',
  '-write',
  'mpr:arrow',
  '+delete',
  '(',
  popularBefore,
  '-size',
  '1x24',
  'xc:none',
  'mpr:arrow',
  '-size',
  '1x24',
  'xc:none',
  popularAfter,
  '-background',
  'none',
  '-gravity',
  'center',
  '-append',
  ')',
  '-size',
  '48x1',
  'xc:none',
  '(',
  actionsBefore,
  '-size',
  '1x48',
  'xc:none',
  'mpr:arrow',
  '-size',
  '1x48',
  'xc:none',
  actionsAfter,
  '-background',
  'none',
  '-gravity',
  'center',
  '-append',
  ')',
  '-background',
  'white',
  '-gravity',
  'center',
  '+append',
  '-bordercolor',
  'white',
  '-border',
  '24',
  '-alpha',
  'off',
  overviewImg,
]);

// 4. Resize and pad screenshots to 1280x800 (24-bit RGB without alpha) for Chrome Web Store
execFileSync('magick', [
  overviewImg,
  '-resize',
  '1280x800',
  '-gravity',
  'center',
  '-background',
  'white',
  '-extent',
  '1280x800',
  '-alpha',
  'off',
  overviewStoreImg,
]);

execFileSync('magick', [
  popupImg,
  '-gravity',
  'center',
  '-background',
  'white',
  '-extent',
  '1280x800',
  '-alpha',
  'off',
  popupStoreImg,
]);

// 5. Quantize and optimize derived images
execFileSync('pngquant', [
  '--force',
  '--ext',
  '.png',
  '--strip',
  '--speed',
  '1',
  ...derivedImages,
]);

execFileSync('oxipng', ['--opt', 'max', '--strip', 'safe', ...derivedImages]);

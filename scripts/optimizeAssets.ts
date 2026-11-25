import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

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

const pngSignature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function readPngSize(filePath: string): { width: number; height: number } {
  const buf = readFileSync(filePath);
  if (buf.length < 24 || !buf.subarray(0, 8).equals(pngSignature)) {
    throw new Error(`Invalid PNG file: ${filePath}`);
  }
  return {
    width: buf.readUInt32BE(16),
    height: buf.readUInt32BE(20),
  };
}

function renderSvg(svg: string, outputPath: string): void {
  execFileSync('resvg', ['--resources-dir', '.', '-', outputPath], { input: svg });
}

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
renderSvg(
  `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">
  <defs>
    <filter id="gray">
      <feColorMatrix type="saturate" values="0"/>
    </filter>
  </defs>
  <image href="${toolbarIcon}" width="128" height="128" filter="url(#gray)"/>
</svg>`,
  disabledIcon,
);

renderSvg(
  `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">
  <image href="${toolbarIcon}" x="16" y="16" width="96" height="96"/>
</svg>`,
  storeIcon,
);

// 3. Compose overview screenshot from raw captures
const arrowSize = 64;
const border = 24;
const columnGap = 48;
const popularGap = 24;
const actionsGap = 48;

const popBeforeSize = readPngSize(popularBefore);
const popAfterSize = readPngSize(popularAfter);
const actBeforeSize = readPngSize(actionsBefore);
const actAfterSize = readPngSize(actionsAfter);

const leftColW = Math.max(popBeforeSize.width, arrowSize, popAfterSize.width);
const leftColH = popBeforeSize.height + popularGap + arrowSize + popularGap + popAfterSize.height;

const rightColW = Math.max(actBeforeSize.width, arrowSize, actAfterSize.width);
const rightColH = actBeforeSize.height + actionsGap + arrowSize + actionsGap + actAfterSize.height;

const contentH = Math.max(leftColH, rightColH);
const totalW = border + leftColW + columnGap + rightColW + border;
const totalH = border + contentH + border;

const leftX = border;
const leftTopY = border + Math.floor((contentH - leftColH) / 2);
const rightX = border + leftColW + columnGap;
const rightTopY = border + Math.floor((contentH - rightColH) / 2);

const centerX = (colX: number, colW: number, itemW: number) => colX + Math.floor((colW - itemW) / 2);

renderSvg(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${totalH}">
  <defs>
    <polygon id="arrow" points="22,6 42,6 42,32 54,32 32,58 10,32 22,32" fill="#d8e6f3" stroke="#1f2328" stroke-width="2"/>
  </defs>
  <rect width="${totalW}" height="${totalH}" fill="#ffffff"/>
  <image href="${popularBefore}" x="${
    centerX(leftX, leftColW, popBeforeSize.width)
  }" y="${leftTopY}" width="${popBeforeSize.width}" height="${popBeforeSize.height}"/>
  <use href="#arrow" x="${centerX(leftX, leftColW, arrowSize)}" y="${leftTopY + popBeforeSize.height + popularGap}"/>
  <image href="${popularAfter}" x="${centerX(leftX, leftColW, popAfterSize.width)}" y="${
    leftTopY + popBeforeSize.height + popularGap + arrowSize + popularGap
  }" width="${popAfterSize.width}" height="${popAfterSize.height}"/>
  <image href="${actionsBefore}" x="${
    centerX(rightX, rightColW, actBeforeSize.width)
  }" y="${rightTopY}" width="${actBeforeSize.width}" height="${actBeforeSize.height}"/>
  <use href="#arrow" x="${centerX(rightX, rightColW, arrowSize)}" y="${rightTopY + actBeforeSize.height + actionsGap}"/>
  <image href="${actionsAfter}" x="${centerX(rightX, rightColW, actAfterSize.width)}" y="${
    rightTopY + actBeforeSize.height + actionsGap + arrowSize + actionsGap
  }" width="${actAfterSize.width}" height="${actAfterSize.height}"/>
</svg>`,
  overviewImg,
);

// 4. Resize and pad screenshots to 1280x800 (24-bit RGB without alpha) for Chrome Web Store
const storeW = 1280;
const storeH = 800;

renderSvg(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${storeW}" height="${storeH}">
  <rect width="${storeW}" height="${storeH}" fill="#ffffff"/>
  <image href="${overviewImg}" width="${storeW}" height="${storeH}" preserveAspectRatio="xMidYMid meet"/>
</svg>`,
  overviewStoreImg,
);

const popupSize = readPngSize(popupImg);
renderSvg(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${storeW}" height="${storeH}">
  <rect width="${storeW}" height="${storeH}" fill="#ffffff"/>
  <image href="${popupImg}" x="${Math.floor((storeW - popupSize.width) / 2)}" y="${
    Math.floor((storeH - popupSize.height) / 2)
  }" width="${popupSize.width}" height="${popupSize.height}"/>
</svg>`,
  popupStoreImg,
);

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

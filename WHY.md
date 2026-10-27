# Design Choices and Trade-offs

## Global Toggle Strategy

Manifest V3 lacks an API to unload injected content scripts.
depop toggles features by adding or removing the `.depop-enabled` class on the `<html>` element:

- All CSS rules are scoped under `.depop-enabled`.
- `github-patcher.ts` listens for storage changes and toggles the class at `document_start`.
- The class persists across GitHub Turbo transitions and updates pages immediately without page reload.

## Build Output Structure

`pnpm run build` generates three directories under `dist/`:

- `chrome/`: Unpacked extension directory for Chrome.
- `firefox/`: Unpacked extension directory for Firefox.
- `packages/`: Distribution zip archives for releases.

### Trade-offs

- **Why not symlinks?**: Chrome blocks unpacked extensions from reading files linked outside the extension root directory.
- **Why not hardlinks?**: Hardlinks look like regular files in file managers, which fails to clarify what is shared versus different.
- **Why full copy?**: Most files are identical except `manifest.json`. The total size is small enough that disk space is not a problem. Fully copying files keeps each browser directory self-contained and easy to load.
- Run `pnpm run diff:browsers` to view the manifest differences between Chrome and Firefox.

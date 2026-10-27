# Build Outputs

## Directories

- `chrome/`: Unpacked extension directory for Chrome (`chrome://extensions/`).
- `firefox/`: Unpacked extension directory for Firefox (`about:debugging`).
- `packages/`: Distribution zip archives.

## Checking Differences

To inspect differences between the Chrome and Firefox builds, run:

```console
pnpm run diff:browsers
```

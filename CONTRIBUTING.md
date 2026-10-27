# How to develop

## Usage

```console
> pnpm run build
```

This command generates packages for both Chrome and Firefox in the `dist/` directory.

- `dist/chrome/`: Ready for Chrome's "Load unpacked extension".
- `dist/firefox/`: Ready for Firefox's "Load Temporary Add-on...".
- `dist/packages/depop-*-chrome.zip`: For Chrome releases.
- `dist/packages/depop-*-firefox.zip`: For Firefox releases.

### Loading in browser

- **Chrome**: Open `chrome://extensions/`, enable "Developer mode", and "Load unpacked" the `dist/chrome/` folder.
- **Firefox**: Open `about:debugging`, click "This Firefox", and "Load Temporary Add-on..." the `dist/firefox/manifest.json` file.

To check differences between Chrome and Firefox builds, run:

```console
> pnpm run diff:browsers
```

## Finding CSS selectors

In the Chrome Developer Tools, type the following in the console.

```javascript
document.querySelectorAll("div:has(> h2 a[href$='?tab=achievements'])");
```

Then expand the `NodeList(2)` and hover over them; Chrome will show you where the element is.

## Handling adjusted JSON schema

[src/manifestSchemaAdjusted.json](src/manifestSchemaAdjusted.json)

The filled enum is not perfect; it should contain URIs. You can update it by following these steps:

1. Download the base schema from <https://github.com/SchemaStore/schemastore/blob/fd34ef2aa89e5007ed67d6844f1519cfec75678c/src/schemas/json/chrome-manifest.json>
1. Download, extract, and format <https://developer.chrome.com/docs/extensions/mv3/permission_warnings/> as `tmp/scrape.html`
1. `rg '<tr id="([^"]+)">' -or '"$1",'  tmp/scrape.html` will show most definitions, though it may include non-enum values like URL patterns.

## Optimal execution timing

[This article](https://stackoverflow.com/questions/43233115/chrome-content-scripts-arent-working-domcontentloaded-listener-does-not-execut) may help you.

## Release

1. Bump version in [manifest file](manifest.json)
2. Add git tag and push.
3. Download [released assets](https://github.com/kachick/depop/releases) and upload the `depop-VERSION.zip` into the [Developer Dashboard](https://chrome.google.com/webstore/devconsole/2dc05d4b-8c8e-4356-a2be-080a15ab2903/bblbchjekobacogfioehogggccfagkmk/edit/package)
4. ☕

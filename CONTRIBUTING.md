# How to develop

## Setup

1. Install [Nix](https://nixos.org/) package manager
2. Run `nix develop` or `nix develop --command 'zsh'`
3. You can use development tools

```console
> nix develop
(prepared bash)

> deno task
Available tasks:
- build
- check
...
```

## Usage

```console
> deno task build
```

This command generates packages for both Chrome and Firefox in the `dist/` directory.

- `dist/depop-*-chrome.zip`: For Chrome.
- `dist/depop-*-firefox.zip`: For Firefox.
- `dist/`: Ready for Chrome's "Load unpacked extension". The `manifest.json` in this folder is always overwritten with Chrome-compatible settings.

### Loading in browser

- **Chrome**: Open `chrome://extensions/`, enable "Developer mode", and "Load unpacked" the `dist/` folder.
- **Firefox**: Open `about:debugging`, click "This Firefox", and "Load Temporary Add-on..." the `dist/manifest.json` file. Note that Firefox may require the zip file for some features, but temporary loading usually works with the manifest.

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

## Architecture Decisions

### Global Toggle Strategy (ADR 001)

We provide a global "ON/OFF" switch in the extension popup that updates GitHub pages immediately.

#### The Problem

Chrome extensions (Manifest V3) do not have a simple API to "unload" content scripts once they are injected.

#### The Decision

We use a **CSS-class-based toggle** approach:

1. Wrap all CSS rules in `github-patcher.css` under a `.depop-enabled` class on the `<html>` or `<body>` element.
2. The `github-patcher.ts` listens for storage changes and toggles this class on the `<html>` element as early as possible (`document_start`).

#### Why?

- **Instant update**: The browser's CSS engine updates the page immediately.
- **Minimal Lag**: Applying the class to the `<html>` element at `document_start` ensures that elements are hidden before they are even rendered.
- **SPA Compatibility**: The `<html>` element's class persists during GitHub's Turbo (SPA) transitions, maintaining the hidden state.
- **Performance**: High performance with minimal reflow.

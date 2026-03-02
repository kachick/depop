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
...
Built to dist/depop-0.0.0.15-hash.zip:
...
```

## How to struggle with CSS selector?

In the Chrome Developer Tools, type the following in the console.

```javascript
document.querySelectorAll("div:has(> h2 a[href$='?tab=achievements'])");
```

Then expand the `NodeList(2)`, and hover to them, chrome tells us where the element is.

## Carefully handle adjusted JSON schema

[src/manifestSchemaAdjusted.json](src/manifestSchemaAdjusted.json)

The filled enum is not perfect. It should contain URIs. But you can update as following steps

1. Download the base schema from <https://github.com/SchemaStore/schemastore/blob/fd34ef2aa89e5007ed67d6844f1519cfec75678c/src/schemas/json/chrome-manifest.json>
1. Download and extract and formats the <https://developer.chrome.com/docs/extensions/mv3/permission_warnings/> as `tmp/scrape.html`
1. `rg '<tr id="([^"]+)">' -or '"$1",'  tmp/scrape.html` will show the most definitions, but not correct, and it includes non enum like URL patterns

## Which timing is the best to execute?

[This article](https://stackoverflow.com/questions/43233115/chrome-content-scripts-arent-working-domcontentloaded-listener-does-not-execut) may help you.

## Release

1. Bump version in [manifest file](manifest.json)
2. Add git tag and push.
3. Download [released assets](https://github.com/kachick/depop/releases) and upload the `depop-VERSION.zip` into [Developer Dashboard](https://chrome.google.com/webstore/devconsole/2dc05d4b-8c8e-4356-a2be-080a15ab2903/bblbchjekobacogfioehogggccfagkmk/edit/package)
4. ☕

## Architecture Decisions

### Global Toggle Strategy (ADR 001)

We provide a global "ON/OFF" switch in the extension popup that updates GitHub pages immediately.

#### The Problem

Chrome extensions (Manifest V3) do not have a simple API to "unload" content scripts once they are injected.

#### The Decision

We use a **CSS-class-based toggle** approach:

1. Wrap all CSS rules in `github-patcher.css` under a `.depop-enabled` class on the `<body>` element.
2. The `github-patcher.ts` listens for storage changes and toggles this class.

#### Why?
- **Instant Reflect**: The browser's CSS engine updates the page immediately.
- **Performance**: High performance with minimal reflow.
- **Reliability**: This is a standard "best practice" for modern extensions like uBlock Origin.

### Mandatory CSP Hash for Empty Styles

In `manifest.json`, we explicitly allow `sha256-5sM6NtwiI9WtWZw9bryR+B9oiH9IDt7RhJYadq6eHLk=`.

This is required because Chrome internally injects empty `<style>` tags for features like Autofill or translation, which triggers a CSP violation if not allowed. This is a known Chromium behavior discussed here: `https://groups.google.com/a/chromium.org/g/chromium-extensions/c/G2_rtRyu2xQ`


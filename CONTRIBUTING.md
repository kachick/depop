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
Built to out/depop-0.0.0.13.zip:
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

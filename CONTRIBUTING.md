# How to develop

## Setup

1. Install [Nix](https://nixos.org/) package manager
2. Run `nix-shell` or `nix-shell --command 'zsh'`
3. You can use development tools

```console
> nix-shell
(prepared bash)

> deno task
Available tasks:
- build
- bundle
...
```

## Usage

```console
> deno task build
...
Built to out/depop-0.0.0.11.zip:
...
```

## Release

1. Bump version in [manifest file](manifest.json)
2. `deno task build`
3. Add git tag and push.
4. Upload the build file `depop-VERSION.zip` as a new package from
   [Developer Dashboard](https://chrome.google.com/webstore/devconsole/2dc05d4b-8c8e-4356-a2be-080a15ab2903/bblbchjekobacogfioehogggccfagkmk/edit/package)
5. ☕

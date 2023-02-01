# How to develop

## Setup

1. Install [Nix](https://nixos.org/) package manager
2. Run `nix-shell` or `nix-shell --command 'zsh'`
3. You can use development tools

```console
> nix-shell
(prepared bash)

> makers help
Tools
----------
build - Build archive that Google want
empty - Empty Task
help - Might help you - (This one)

> makers build
[cargo-make] INFO - Running Task: build
  adding: manifest.json (deflated 35%)
  adding: README.md (deflated 40%)
  adding: LICENSE (deflated 41%)
  adding: style.css (deflated 45%)
```

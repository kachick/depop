{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/87fbcab2cde3bf5d35a3f80cc3ec7179b9425e1e.tar.gz") { } }:

pkgs.mkShell {
  buildInputs = [
    pkgs.nil
    pkgs.nixpkgs-fmt
    pkgs.dprint
    pkgs.imagemagick
    pkgs.deno
    pkgs.actionlint
  ];
}

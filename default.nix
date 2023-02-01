{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/8eabb500ebf5dcb9a40024c1150ef348cefa8320.tar.gz") { } }:

pkgs.mkShell {
  buildInputs = [
    pkgs.nil
    pkgs.nixpkgs-fmt
    pkgs.dprint
    pkgs.zip
    pkgs.cargo-make
    pkgs.jq
    pkgs.imagemagick
  ];
}

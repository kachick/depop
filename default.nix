{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/e57b65abbbf7a2d5786acc86fdf56cde060ed026.tar.gz") { } }:

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

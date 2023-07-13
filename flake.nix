{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/87fbcab2cde3bf5d35a3f80cc3ec7179b9425e1e";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = with pkgs;
          mkShell {
            buildInputs = [
              nil
              nixpkgs-fmt
              dprint
              imagemagick
              deno
              actionlint
              ripgrep
              typos
            ];
          };
      });
}

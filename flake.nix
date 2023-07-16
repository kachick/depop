{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/7e281993bbc6f09832c2018b3838fc4da14b32d6";
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

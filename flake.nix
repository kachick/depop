{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs =
    {
      self,
      nixpkgs,
    }:
    let
      forAllSystems = nixpkgs.lib.genAttrs nixpkgs.lib.systems.flakeExposed;
    in
    {
      formatter = forAllSystems (system: nixpkgs.legacyPackages.${system}.nixfmt-tree);
      devShells = forAllSystems (
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
        in
        {
          default = pkgs.mkShellNoCC {
            env = {
              # Fix nixd pkgs versions in the inlay hints
              NIX_PATH = "nixpkgs=${pkgs.path}";
            };

            buildInputs = with pkgs; [
              bashInteractive
              nixd
              nixfmt
              nixfmt-tree

              deno
              biome
              dprint
              ripgrep
              typos
              zizmor

              # To maintain icons
              imagemagick
              exiftool

              # Comment-out only if you want `renovate-config-validator`.
              # It is a heavy nodejs package and does not detect wrong manager and datasource names.
              # We can only use it checking key name correctness.
              # renovate
            ];
          };
        }
      );
    };
}

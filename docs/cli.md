# Bonita Cli
| Action | command|
|---------------|----------|
| Help | `bon` |
| Help | `bon help` |
| Help | `bon --help` |
| Help | `bon -h` |
| Version | `bon version` |
| Version | `bon --version` |
| Version | `bon -v` |
| Run devServer | `bon dev` |
| Run devServer | `bon d` |
| Run devServer without watch | `bon serve` |
| Run devServer ignore sub-projects | `bon dev --ignore-sub` |
| Run devServer ignore structured paths | `bon dev --ignore-struct` |
| Run devServer specify variants | `bon dev --var 1 fr-fr en-gb` |
| *Subcommands for devServer applies to distCompiler* | . |
| Run distCompiler | `bon compile` |
| Run distCompiler | `bon c` |
| Specify config path | `bon --config dir/config.json` |
| Specify config path | `bon -c dir/config.json` |
| Update all deps | `bon update import/map/path/import-maps.json` |
| Update specific deps | `bon update import/map/path/import-maps.json specifier1 specifier2` |
| Audit deps | `bon audit import/map/path/import-maps.json` |
| Audit specific deps | `bon audit import/map/path/import-maps.json specifier1 specifier2` |
| Clear checksums cache | `bon clear hashes` |
| Clear dist | `bon clear dist` |
! List partials | `bon list partials /sub-dir` | 
! List processors | `bon list processors /sub-dir` | 

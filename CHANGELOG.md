# Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [2.1.0] - 2019-07-02
### Changed
* Added `rest/services` to routes targeting ArcGIS clients

### Added
* trailing slash route - `VectorTileServer/` needed for ArcGIS clients

## [2.0.0] - 2019-06-26
### Breaking Change
* plugin class name (and thus routes) changed to `VectorTileServer` to accomodate ArcGIS requirements

### Added
* ArcGIS metadata route
* ArcGIS root.json route

## [1.0.1] - 2019-06-21
### Fixed
* strip undefined properties from tile-config object

## [1.0.0] - 2019-06-21
### Changed
* path to package.json
* refactor into source directory
* update demo

### Added
* Unit tests

## [0.0.3] - 2019-06-14
### Added
* Linting and travis build.

[2.1.0]: https://github.com/koopjs/koop-output-vector-tiles/compare/v2.0.0...v2.1.0
[2.0.0]: https://github.com/koopjs/koop-output-vector-tiles/compare/v1.0.1...v2.0.0
[1.0.1]: https://github.com/koopjs/koop-output-vector-tiles/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/koopjs/koop-output-vector-tiles/compare/v0.0.3...v1.0.0
[0.0.3]: https://github.com/koopjs/koop-output-vector-tiles/releases/tag/v0.0.3

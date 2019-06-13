# koop-provider-vector-tiles

This output-services plugin converts GeoJSON to `pbf` vector tiles.

## Usage

Register this plugin with koop before your provider plugins to ensure that the `VectorTiles` routes are bound to the providers.

```
const tile = require('@koopjs/output-vector-tiles')
koop.register(tiles)

// Register providers
```

After startup, Koop will include `VectorTiles` routes for each registered provider.  For example, if you had registered the Github provider, the following routes would be available:

`/github/:id/VectorTiles/:z/:x/:y.pbf`
`/github/:id/VectorTiles/tiles.json`
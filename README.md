# koop-provider-vector-tiles

This output-services plugin converts GeoJSON to `pbf` vector tiles.

## Install

```bash
npm install --save @koopjs/output-vector-tiles
```

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

### Using a tile set cache
This output plugin has a built-in in-memory cache for storing generated tile sets for a set period of time.  This may improve performance.  It is disabled by default. You can use it by setting your Koop config like:

```json
{
  "koopOutputVectorTiles": {
    "cache": true,
    "cacheExpiration": 3600 // seconds to cache; defaults to 300
  }
}
```

### Other settings
This plugin leverages [geojsonvt]() to create tiles from GeoJSON.  If you want to adjust any of the geojsonvt settings, you can do so in the Config: 

```json
{
  "koopOutputVectorTiles": {
    "maxZoom": , // max zoom to preserve detail on; can't be higher than 24
    "tolerance": , // simplification tolerance (higher means simpler)
    "extent": , // tile extent (both width and height)
    "buffer": , // 64 is the original default, using a higher number like 512, 1024 or 2048 gets rid of some geojson artifacts but increases the tilesSetCache size // tile buffer on each side
    "debug": , // logging level (0 to disable, 1 or 2)
    "lineMetrics": , // whether to enable line metrics tracking for LineString/MultiLineString features
    "promoteId": , // name of a feature property to promote to feature.id. Cannot be used with `generateId`
    "generateId": , // whether to generate feature ids. Cannot be used with `promoteId`
    "indexMaxZoom": , // max zoom in the initial tile index
    "indexMaxPoints":  // max number of points per tile in the index
  }
}
```

## Demo
This repo ships with a demo application.  To try it out:

```
cd demo
npm install
npm start
```

Then open `demo/index.html` in the browser of your choice.  You should see vector tile rendered points around the city of Pasadena, CA.

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

After startup, Koop will include `VectorTileServer` routes for each registered provider.  For example, if you had registered the Github provider, the following routes would be available:

```bash
/github/:id/VectorTileServer/:z([0-9]+)/:x([0-9]+)/:y([0-9]+).pbf  GET
/github/rest/services/:id/VectorTileServer/tiles.json                            GET
/github/rest/services/:id/VectorTileServer                                       GET, POST
/github/rest/services/:id/VectorTileServer/                                       GET, POST
/github/rest/services/:id/VectorTileServer/resources/styles/root.json            GET
```

## Routes
| Route | Method | Description |
| --- | --- | --- |
|`/VectorTileServer/:z([0-9]+)/:x([0-9]+)/:y([0-9]+).pbf`| GET | Get a specific tile. |
|`/VectorTileServer/tiles.json`| GET | Standard vector tile metadata. |
|`/VectorTileServer`| GET, POST | ArcGIS vector tile metadata. |
|`/VectorTileServer/`| GET, POST | ArcGIS vector tile metadata. |
|`/VectorTileServer/resources/styles/root.json`| GET | ArcGIDS vector tile styling info. |


## Options and configuration

### Using a tile set cache
This output plugin has a built-in in-memory cache for storing generated tile sets for a set period of time.  This may improve performance.  It is disabled by default. You can use it by setting your Koop config like:

```javascript
{
  "koopOutputVectorTiles": {
    "cache": true,
    "cacheExpiration": 3600 // seconds to cache; defaults to 300
  }
}
```

### Tile generation settings
This plugin leverages [geojsonvt]() to create tiles from GeoJSON.  If you want to adjust any of the geojsonvt settings, you can do so in the Config: 

```javascript
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

### ArcGIS tile styling
ArcGIS applications make style requests to the vector tile server at `/VectorTileServer/resources/styles/root.json`. You can control the style served by this endpoint by either (1) setting default values in your config file, or (2) adding styling info to the GeoJSON metadata in your provider.

#### ArcGIS style via config

Add `paint` configuration for each `circle`, `line`,and `fill` types:

```javascript
{
  "koopOutputVectorTiles": {
    "circle": {
      "paint": {
        "circle-radius": 3
      }
    },
    "line": {
      "paint": {
        "line-width": 7
      }
    },
    "fill": {
      "paint": {
        "fill-opacity": 0.25
      }
    }
  }
}
```

See the [Mapbox style specification](https://docs.mapbox.com/mapbox-gl-js/style-spec/) for additional properties that can be set in `paint`.

#### ArcGIS style via your provider:
You can modify the GeoJSON metadata of your provider to handle styling:

```javascript
// inside your getData function

geojson.metadata = {}
geojson.metadata.vt = {}
geojson.metadata.vt = {
  type: 'circle',
  paint: {
    'circle-radius': 4
  }
}

```

## Demos
This repo ships with both MapBoxGL and ArcGIS demo applications that consume Koop vector tiles.  To try it out:

```bash
# Install plugin dependencies
npm install

# Move to demo directory
cd demo

# Install demo dependencies and start Express Koop server
npm install
npm start
```

Then open `mapbox-demo/index.html` or  `arcgis-js-api-demo.html` in the browser of your choice.  You should see vector tile rendered data around the city of Pasadena, CA.

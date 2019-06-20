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

## Demo
This repo ships with a demo application.  To try it out:

```
cd demo
npm install
npm start
```

Then open `demo/index.html` in the browser of your choice.  You should see vector tile rendered points around the city of Pasadena, CA.

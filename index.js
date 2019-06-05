const geojsonVT = require('geojson-vt')
const vtpbf = require('vt-pbf')
const Logger = require('koop-logger')
const Winnow = require('winnow')
const config = require('config')
const maxAge = config.vectorTiles.maxAge || 3600
const log = new Logger()

const tilesSetCache = {};

function VectorTiles () {}
VectorTiles.version = require('./package.json').version
VectorTiles.type = 'output'
VectorTiles.routes = [
  {
    path: 'VectorTiles/:z/:x/:y.pbf',
    methods: ['get'],
    handler: 'serve'
  },
  {
    path: 'VectorTiles/tiles.json',
    methods: ['get'],
    handler: 'metadata'
  }
]

// TODO add sample map with sample data - points, lines and polygons
VectorTiles.prototype.serve = function (req, res) {
  this.model.pull(req, (e, data) => {
    if (e) return res.status(e.code || 500).json({ error: e.message })
    const {z, y, x} = Object.keys(req.params).reduce((keys, key) => {
      keys[key] = parseInt(req.params[key])
      return keys
    }, {});
    log.debug('request received')
    // id for the tile layer, assumes the id is already sanitzed no spaces etc
    const id = req.params.id;
    const start = Date.now()
    if (!tilesSetCache[id]) {
      const indexStart = Date.now();
      log.debug(`${id} waiting for geojsonvt to index tiles`)
      tilesSetCache[id] = geojsonVT(data, {
        //these are the original defaults from geojson-vt
        maxZoom: config.vectorTiles.geojsonVT.maxZoom || 14,  // max zoom to preserve detail on; can't be higher than 24
        tolerance: config.vectorTiles.geojsonVT.tolerance || 3, // simplification tolerance (higher means simpler)
        extent: config.vectorTiles.geojsonVT.extent || 4096, // tile extent (both width and height)
        buffer: config.vectorTiles.geojsonVT.buffer || 64,   // 64 is the original default, using a higher number like 512, 1024 or 2048 gets rid of some geojson artifacts but increases the tilesSetCache size // tile buffer on each side
        debug: config.vectorTiles.geojsonVT.debug || 0,     // logging level (0 to disable, 1 or 2)
        lineMetrics: config.vectorTiles.geojsonVT.lineMetrics || false, // whether to enable line metrics tracking for LineString/MultiLineString features
        promoteId: config.vectorTiles.geojsonVT.promoteId || null,    // name of a feature property to promote to feature.id. Cannot be used with `generateId`
        generateId: config.vectorTiles.geojsonVT.generateId || false,  // whether to generate feature ids. Cannot be used with `promoteId`
        indexMaxZoom: config.vectorTiles.geojsonVT.indexMaxZoom || 5,       // max zoom in the initial tile index
        indexMaxPoints: config.vectorTiles.geojsonVT.indexMaxPoints || 100000 // max number of points per tile in the index
      })
      const indexEnd = (Date.now() - indexStart) / 1000;
      log.debug(`${id} tile indexing complete in ${indexEnd} milliseconds`)
    }
    const tile = tilesSetCache[id].getTile(z,x,y)
    if (!tile) {
      res.set(204)
      return res.send()
    }
    const pbf = Buffer.from(vtpbf.fromGeojsonVt({
        [id]: tile
      })
    )
    const duration = (Date.now() - start) / 1000
    log.debug(`${id},output=vector-tiles tile=${z},${x},${y} features=${data.features.length} duration=${duration}`)
    res.set({
      // 'Content-Type': 'application/x-protobuf', //issued a pull request to add x-protobuf compressible:true to mime-db, until then need application/json or other compressible format mime type to have compression use gzip on these
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age:' + maxAge //not sure if this is needed as eventually the cache will be handled by koop memory or in nginx, but leaving it in for now
    })
    res.send(pbf);
  })
}
// TODO change the "tiles" to reflect the id above and optional query parameters
VectorTiles.prototype.metadata = function (req, res) {
  this.model.pull(req, (e, data) => {
    const metadata = Winnow.query(data).metadata
    const json = {
      attribution: metadata.attribution,
      bounds: metadata.extent,
      center: metadata.center,
      created: metadata.created,
      description: metadata.description,
      filesize: 0,
      fillzoom: 8,
      format: 'pbf',
      id: metadata.name || 'layer 1',
      name: metadata.name || 'layer1',
      private: false,
      scheme: 'zxy',
      tilejson: '2.2.0',
      tiles: [ 'http://localhost:8085/craigslist/washingtondc/apartments/VectorTiles/{z}/{x}/{y}.pbf' ],
      vector_layers: [
        {
          description: metadata.descriptions,
          fields: formatFields(metadata.fields),
          id: 'layer',
          source: metadata.source,
          source_name: metadata.source
        }
      ],
      webpage: metadata.webpage
    }
    res.status(200).json(json)
  })
}

function formatFields (inFields) {
  return inFields.reduce((fields, field) => {
    fields[field.name] = field.description || field.type
    return fields
  }, {})
}

module.exports = VectorTiles

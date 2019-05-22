const geojsonVT = require('geojson-vt')
const vtpbf = require('vt-pbf')
const Logger = require('koop-logger')
const Winnow = require('winnow')
const zlib = require('zlib')

const log = new Logger()

const tiles = new Array();

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
    if (!tiles[id]) {
      const indexStart = Date.now();
      log.debug(`${id} waiting for geojsonvt to index tiles`)
      tiles[id] = geojsonVT(data, {
        maxZoom: 17,
        indexMaxZoom: 5,
        buffer: 2048,
        tolerance: 2
      })
      const indexEnd = (Date.now() - indexStart) / 1000;
      log.debug(`${id} tile indexing complete in ${indexEnd} milliseconds`)
    }
    const tile = tiles[id].getTile(z,x,y)
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
      'Cache-Control': 'public, max-age:3600',
      'Content-Encoding': 'gzip'
    })

    //zlib.gzip enables a 4x decrease in data size sent with no noticeable performance decrease
    zlib.gzip(pbf, function(_, result) {
      res.send(result);
    })
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
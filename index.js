const geojsonVT = require('geojson-vt')
const vtpbf = require('vt-pbf')
const Logger = require('koop-logger')
const Winnow = require('winnow')
const log = new Logger()

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

VectorTiles.prototype.serve = function (req, res) {
  this.model.pull(req, (e, data) => {
    if (e) return res.status(e.code || 500).json({ error: e.message })
    const {z, y, x} = Object.keys(req.params).reduce((keys, key) => {
      keys[key] = parseInt(req.params[key])
      return keys
    }, {})

    const start = Date.now()
    const tile = geojsonVT(data).getTile(z, x, y)
    const pbf = vtpbf.fromGeojsonVt({layer: tile})
    const duration = (Date.now() - start) / 1000
    log.debug(`output=vector-tiles tile=${z},${x},${y} features=${data.features.length} duration=${duration}`)
    res.set({'Content-Type': 'application/octet-stream'})
    res.send(pbf)
  })
}

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

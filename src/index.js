const serve = require('./serve')
const metadata = require('./metadata')

function VectorTiles () {}
VectorTiles.version = require('../package.json').version
VectorTiles.type = 'output'
VectorTiles.routes = [
  {
    path: 'VectorTiles/:z([0-9]+)/:x([0-9]+)/:y([0-9]+).pbf',
    methods: ['get'],
    handler: 'serve'
  },
  {
    path: 'VectorTiles/tiles.json',
    methods: ['get'],
    handler: 'metadata'
  }
]

VectorTiles.prototype.serve = serve

// TODO change the "tiles" to reflect the id above and optional query parameters
VectorTiles.prototype.metadata = metadata

module.exports = VectorTiles

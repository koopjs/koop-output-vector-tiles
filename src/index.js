const serve = require('./serve')
const metadata = require('./metadata')
const esriMetadata = require('./esri-metadata')
const esriRoot = require('./esri-root')

function VectorTileServer () {}
VectorTileServer.version = require('../package.json').version
VectorTileServer.type = 'output'
VectorTileServer.routes = [
  {
    path: 'VectorTileServer/:z([0-9]+)/:x([0-9]+)/:y([0-9]+).pbf',
    methods: ['get'],
    handler: 'serve'
  },
  {
    path: 'VectorTileServer/tiles.json',
    methods: ['get'],
    handler: 'metadata'
  },
  {
    path: 'VectorTileServer',
    methods: ['get'],
    handler: 'esriMetadata'
  },
  {
    path: 'VectorTileServer/resources/styles/root.json',
    methods: ['get'],
    handler: 'esriRoot'
  }
]

VectorTileServer.prototype.serve = serve

VectorTileServer.prototype.metadata = metadata

VectorTileServer.prototype.esriMetadata = esriMetadata

VectorTileServer.prototype.esriRoot = esriRoot

module.exports = VectorTileServer

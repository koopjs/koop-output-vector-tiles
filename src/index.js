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
    methods: ['get', 'post'],
    handler: 'serve'
  },
  {
    path: 'VectorTileServer/tiles.json',
    methods: ['get'],
    handler: 'metadata'
  },
  {
    path: '$namespace/rest/services/$providerParams/VectorTileServer/:z([0-9]+)/:x([0-9]+)/:y([0-9]+).pbf',
    methods: ['get', 'post'],
    handler: 'serve'
  },
  {
    path: '$namespace/rest/services/$providerParams/VectorTileServer',
    methods: ['get', 'post'],
    handler: 'esriMetadata'
  },
  {
    path: '$namespace/rest/services/$providerParams/VectorTileServer/',
    methods: ['get', 'post'],
    handler: 'esriMetadata'
  },
  {
    path: '$namespace/rest/services/$providerParams/VectorTileServer/resources/styles/root.json',
    methods: ['get'],
    handler: 'esriRoot'
  }
]

VectorTileServer.prototype.serve = serve

VectorTileServer.prototype.metadata = metadata

VectorTileServer.prototype.esriMetadata = esriMetadata

VectorTileServer.prototype.esriRoot = esriRoot

module.exports = VectorTileServer

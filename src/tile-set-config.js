const _ = require('lodash')
const config = require('config')
// geojson-vt options; anything undefined will use geojsonVT defaults
module.exports = {
  maxZoom: _.get(config, 'vectorTiles.geojsonVT.maxZoom'), // max zoom to preserve detail on; can't be higher than 24
  tolerance: _.get(config, 'vectorTiles.geojsonVT.tolerance'), // simplification tolerance (higher means simpler)
  extent: _.get(config, 'vectorTiles.geojsonVT.extent'), // tile extent (both width and height)
  buffer: _.get(config, 'vectorTiles.geojsonVT.buffer'), // 64 is the original default, using a higher number like 512, 1024 or 2048 gets rid of some geojson artifacts but increases the tilesSetCache size // tile buffer on each side
  debug: _.get(config, 'vectorTiles.geojsonVT.debug'), // logging level (0 to disable, 1 or 2)
  lineMetrics: _.get(config, 'vectorTiles.geojsonVT.lineMetrics'), // whether to enable line metrics tracking for LineString/MultiLineString features
  promoteId: _.get(config, 'vectorTiles.geojsonVT.promoteId'), // name of a feature property to promote to feature.id. Cannot be used with `generateId`
  generateId: _.get(config, 'vectorTiles.geojsonVT.generateId'), // whether to generate feature ids. Cannot be used with `promoteId`
  indexMaxZoom: _.get(config, 'vectorTiles.geojsonVT.indexMaxZoom'), // max zoom in the initial tile index
  indexMaxPoints: _.get(config, 'vectorTiles.geojsonVT.indexMaxPoints') // max number of points per tile in the index
}

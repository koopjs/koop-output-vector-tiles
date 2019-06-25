const _ = require('lodash')
const config = require('config')

// Get configured paint properties and overwrite hardcoded properties
const linePaint = Object.assign({ 'line-width': 2, 'line-color': '#FF0000' }, _.get(config, 'koopOutputVectorTiles.line.paint'))
const fillPaint = Object.assign({ 'fill-opacity': 0.5, 'fill-color': '#008000' }, _.get(config, 'koopOutputVectorTiles.fill.paint'))
const circlePaint = Object.assign({ 'circle-radius': 3, 'circle-color': '#007cbf' }, _.get(config, 'koopOutputVectorTiles.circle.paint'))

function getRenderingInfo (type, paint = {}) {
  let result
  switch (type) {
    case 'LineString':
    case 'MultiLineString':
    case 'line':
      result = {
        type: 'line',
        paint: Object.assign({}, linePaint, paint)
      }
      break
    case 'Polygon':
    case 'MultiPolygon':
    case 'fill':
      result = {
        type: 'fill',
        paint: Object.assign({}, fillPaint, paint)
      }
      break
    case 'Point':
    case 'circle':
    default:
      result = {
        type: 'circle',
        paint: Object.assign({}, circlePaint, paint)
      }
  }
  return result
}

module.exports = function (type, paint) {
  return getRenderingInfo(type, paint)
}

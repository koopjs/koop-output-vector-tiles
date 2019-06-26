const _ = require('lodash')
const esriExtent = require('esri-extent')
const proj4 = require('proj4')
const template = require('./esri-template-metadata')

/**
 * Generate a Esri extent object (web mercator) from GeoJSON data
 * @param {object} geojson
 */
function esriExtentWebMercator (geojson) {
  const extentWgs84 = esriExtent(geojson)
  const mins = proj4('EPSG:4326', 'EPSG:3857', [extentWgs84.xmin, extentWgs84.ymin])
  const maxs = proj4('EPSG:4326', 'EPSG:3857', [extentWgs84.xmax, extentWgs84.ymax])
  return {
    xmin: mins[0],
    ymin: mins[1],
    xmax: maxs[0],
    ymax: maxs[1],
    spatialReference: {
      cs: 'pcs',
      wkid: 102100
    }
  }
}

module.exports = function (req, res) {
  // Adjust layer specific properties
  this.model.pull(req, (e, geojson) => {
    if (e) return res.status(500).json(e)
    if (!geojson) return res.status(404).send()

    // Process metadata through Winnow so we get a data extent
    const { metadata = {} } = geojson
    const extent = metadata.extent || esriExtentWebMercator(geojson)

    const body = _.cloneDeep(template)
    if (metadata.name) body.name = metadata.name
    body.initialExtent = extent
    body.fullExtent = extent

    res.status(200).json(body)
  })
}

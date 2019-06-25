const _ = require('lodash')
const Utils = require('./utils')
const template = require('./esri-template-root')
const esriRenderingInfo = require('./esri-rendering-info')

module.exports = function (req, res) {
  this.model.pull(req, (e, geojson) => {
    // clone the root.json template
    const body = _.cloneDeep(template)

    // extract geojson metadata property
    const { metadata } = geojson

    // compose the layer id from request parameters
    const id = Utils.getTileSetKey(req.params.host, req.params.id)

    // Fetch the vector-tile feature type if set in metadata; otherwise use geometry type
    const metadataType = _.get(metadata, 'vt.type', metadata.geometryType)

    // Fetch the vector-tile paint object if set in metadata
    const metadataPaint = _.get(metadata, 'vt.paint')

    // compose the rendering type and paint object
    const { type, paint } = esriRenderingInfo(metadataType, metadataPaint)

    // add the composed layer properties to the response body
    Object.assign(body.layers[0], { id, 'source-layer': id, type, paint })

    // set the tile url
    body.sources.esri.url = `${req.protocol}://${req.headers.host || req.host}${req.path.replace('resources/styles/root.json', '')}`

    res.status(200).json(body)
  })
}

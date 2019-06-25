const _ = require('lodash')
const template = require('./esri-template-metadata')

module.exports = function (req, res) {
  // Adjust layer specific properties
  this.model.pull(req, (e, geojson) => {
    const { metadata } = geojson
    const body = _.cloneDeep(template)
    if (metadata.name) body.name = metadata.name
    if (metadata.extent) {
      body.initialExtent = metadata.extent
      body.fullExtent = metadata.extent
    }
    res.status(200).json(body)
  })
}

const esriExtent = require('esri-extent')
const Winnow = require('Winnow')
const { getTileSetKey } = require('./utils')

/**
 * Create "center" value for metadata
 * @param {object} extent
 */
function center (extent) {
  const x = (extent.xmax - extent.xmin) / 2
  const y = (extent.ymax - extent.ymin) / 2
  return `${x},${y},10` // @TODO - calculate best zoom level for this extent
}

module.exports = function (req, res) {
  const tileSetKey = getTileSetKey(req.params.host, req.params.id)
  this.model.pull(req, (e, geojson) => {
    if (e) return res.status(500).json(e)
    if (!geojson) return res.status(404).send()
    const metadata = Winnow.query(geojson).metadata
    const extent = esriExtent(geojson)

    const json = {
      attribution: metadata.attribution,
      bounds: `${extent.xmin},${extent.ymin},${extent.xmax},${extent.ymax}`,
      center: center(extent),
      created: metadata.created,
      description: metadata.description,
      filesize: 0,
      fillzoom: 8,
      format: 'pbf',
      id: metadata.name || tileSetKey,
      name: metadata.name || tileSetKey,
      private: false,
      scheme: 'zxy',
      tilejson: '2.2.0',
      tiles: [ `${req.protocol}://${req.headers.host || req.host}${req.path.replace('tiles.json', '{z}/{x}/{y}.pbf')}` ],
      vector_layers: [
        {
          description: metadata.descriptions,
          fields: formatFields(metadata.fields),
          id: tileSetKey,
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

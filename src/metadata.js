const Winnow = require('winnow')
const Utils = require('./utils')

module.exports = function (req, res) {
  const tileSetKey = Utils.getTileSetKey(req.params.host, req.params.id)
  this.model.pull(req, (e, data) => {
    if (!data) return res.status(404).send()
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

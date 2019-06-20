const _ = require('lodash')
const geojsonVT = require('geojson-vt')
const vtpbf = require('vt-pbf')
const Logger = require('koop-logger')
const config = require('config')
const tileSetConfig = require('./tile-set-config')
const log = new Logger()
const Utils = require('./utils')
const TileSetsCache = require('./tile-sets-cache')

const useTileSetCache = _.get(config, 'vectorTiles.cache', true)

// Tile response headers
const responseHeaders = {
  'Content-Type': _.get(config, 'vectorTiles.contentType', 'application/x-protobuf'),
  'Cache-Control': `public, max-age: ${_.get(config, 'vectorTiles.maxAge', 3600)}`
}

const tileSetsCache = new TileSetsCache({ expires: _.get(config, 'vectorTiles.cacheExpiration') })

function getPbfTile (key, data, z, y, x, options = {}) {
  let tileSet

  if (useTileSetCache) {
    tileSet = tileSetsCache.retrieve(key)
    if (!tileSet) tileSet = tileSetsCache.upsert(key, data)
  } else tileSet = geojsonVT(data, tileSetConfig)

  const tile = tileSet.getTile(z, x, y)

  if (!tile) return

  return Buffer.from(vtpbf.fromGeojsonVt({
    [key]: tile
  }))
}

module.exports = function (req, res) {
  this.model.pull(req, (e, data) => {
    if (!data) return res.status(404).send()

    const start = Date.now()

    // Error from provider
    if (e) return res.status(e.code || 500).json({ error: e.message })

    // Extract Tile indicies
    const { z, x, y } = _.chain(req.params)
      .pick(['z', 'y', 'x'])
      .mapValues(index => { return Number(index) })
      .value()

    // Make key for the cached tile layer
    const key = Utils.getTileSetKey(req.params.host, req.params.id)

    // Get PBF
    const pbfTile = getPbfTile(key, data, z, y, x)

    if (!pbfTile) return res.status(204).send()

    log.debug(`output=vector-tiles: ${key}, tile=${z},${x},${y} features=${data.features.length} duration=${(Date.now() - start) / 1000} seconds`)
    res.set(responseHeaders).status(200).send(pbfTile)
  })
}

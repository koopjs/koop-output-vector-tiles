const geojsonVT = require('geojson-vt')
const tileSetConfig = require('./tile-set-config')

// In-memory cache for geojsonVT results
class TileSetCache {
  constructor (options = {}) {
    this.tileSetTtl = (options.ttl || 300) * 1000
    this.tileSets = new Map()
  }

  /**
   * Upsert data to cache
   * @param {string} key
   * @param {object} geojson
   */
  upsert (key, geojson) {
    const tileSet = geojsonVT(geojson, tileSetConfig)
    this.tileSets.set(key, {
      data: tileSet,
      expirationTimestamp: Date.now() + this.tileSetTtl
    })
    return tileSet
  }

  /**
   * Retrieve data from cache
   * @param {string} key
   */
  retrieve (key) {
    const tileSet = this.tileSets.get(key)
    if (tileSet && tileSet.expirationTimestamp > Date.now()) return tileSet.data
  }
}

module.exports = TileSetCache

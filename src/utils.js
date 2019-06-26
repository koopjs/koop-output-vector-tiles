const Utils = {}

/**
 * Generate a tile set key/id from Koop host and id parameters
 */
Utils.getTileSetKey = function getTileSetKey (host, id) {
  const fragments = []
  if (host) fragments.push(host)
  if (id) fragments.push(id)
  if (fragments.length > 0) return fragments.join('-')
  return '_'
}

module.exports = Utils
